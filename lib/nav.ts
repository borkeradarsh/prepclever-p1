// The app shell's navigation model, derived from the block views (and so from
// content/blocks.config.ts): the sidebar, the drawer and the breadcrumb all
// read this, so none of them can list a block or item the config does not
// have. Pure and dependency-light, so client components can import it.

import { canAccess } from "@/lib/access";
import { conceptKey, itemKey } from "@/lib/progress";
import { routes } from "@/lib/routes";
import type { BlockId, BlockState, BlockView, DomainId, ItemStatus, Plan, RoleSyllabus } from "@/types/domain";

export interface NavBlockItem {
  slug: string;
  title: string;
  href: string;
  status: ItemStatus;
  locked: boolean;
  done: boolean;
}

/** One of the role's concepts in the Block 3 sidebar. */
export interface NavConcept {
  id: string;
  title: string;
  href: string;
  /** 2 core, 1 good to know. */
  level: 1 | 2;
  done: boolean;
  /** The concept page is a free preview; this marks its lessons as locked. */
  locked: boolean;
}

export interface NavConceptGroup {
  domain: { id: DomainId; title: string };
  concepts: NavConcept[];
}

export interface NavBlock {
  slug: BlockId;
  order: number;
  title: string;
  shortTitle: string;
  href: string;
  status: ItemStatus;
  locked: boolean;
  state: BlockState;
  done: number;
  total: number;
  items: NavBlockItem[];
  /** Block 3 only: the role's concepts by domain, each domain in learning order. */
  groups?: NavConceptGroup[];
}

/** Everything the shell renders, loaded once per request by the app layout. */
export interface ShellData {
  /** Null when the user could not be loaded: no plan badge, no upgrade button. */
  plan: Plan | null;
  firstName: string | null;
  roleChip: { role: string; track: string } | null;
  /** Null when the blocks could not be loaded: the roadmap shows as one link. */
  blocks: NavBlock[] | null;
}

function conceptGroups(syllabus: RoleSyllabus, locked: boolean, done: Set<string>): NavConceptGroup[] {
  return syllabus.domains.map((group) => ({
    domain: { id: group.domain.id, title: group.domain.title },
    concepts: group.concepts.map((entry) => ({
      id: entry.concept.id,
      title: entry.concept.title,
      href: routes.concept(entry.concept.domain, entry.concept.id),
      level: entry.level,
      done: done.has(conceptKey(entry.concept.id)),
      locked,
    })),
  }));
}

/** `syllabus` adds Block 3's concept groups; without it Block 3 lists only its items. */
export function buildNavBlocks(
  blocks: BlockView[],
  plan: Plan,
  doneItems: string[],
  syllabus: RoleSyllabus | null = null,
): NavBlock[] {
  const done = new Set(doneItems);
  return blocks.map((block) => ({
    slug: block.slug,
    order: block.order,
    title: block.title,
    shortTitle: block.shortTitle,
    href: routes.block(block.slug),
    status: block.status,
    locked: block.locked,
    state: block.progress.state,
    done: block.progress.done,
    total: block.progress.total,
    items: block.items.map((item) => ({
      slug: item.slug,
      title: item.title,
      href: routes.blockItem(block.slug, item.slug),
      status: item.status,
      locked: !canAccess({ plan }, item),
      done: done.has(itemKey(block.slug, item.slug)),
    })),
    ...(block.slug === "upskilling" && syllabus
      ? { groups: conceptGroups(syllabus, !canAccess({ plan }, { access: block.tier }), done) }
      : {}),
  }));
}

/** A concept in a block's groups, with the domain it sits in. */
export function findConcept(block: NavBlock, conceptId: string) {
  for (const group of block.groups ?? []) {
    const concept = group.concepts.find((entry) => entry.id === conceptId);
    if (concept) return { group, concept };
  }
  return null;
}

/** True for the link itself and anything below it. */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type SidebarContext =
  | { kind: "home" }
  | {
      kind: "block";
      block: NavBlock;
      activeItem: string | null;
      /** Block 3: the concept being viewed (its page or one of its lessons). */
      activeConcept: string | null;
      /** Block 3: the domain to show expanded. */
      activeDomain: DomainId | null;
    };

function segments(pathname: string): string[] {
  return pathname.split("?")[0].split("/").filter(Boolean).map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });
}

/**
 * Inside `/roadmap/<block>` the sidebar switches to that block's contents.
 * Anything else, including `/roadmap` itself and roadmap pages that are not a
 * block (such as the concept map), keeps the home context.
 */
export function sidebarContext(pathname: string, blocks: NavBlock[] | null): SidebarContext {
  const [root, blockSlug, itemSlug, conceptId] = segments(pathname);
  if (root !== "roadmap" || !blockSlug || !blocks) return { kind: "home" };
  const block = blocks.find((entry) => entry.slug === blockSlug);
  if (!block) return { kind: "home" };
  const item = itemSlug ? block.items.find((entry) => entry.slug === itemSlug) : undefined;
  // Concept URLs are /roadmap/upskilling/<domain>/<concept>[/<lesson>].
  const found = !item && conceptId ? findConcept(block, conceptId) : null;
  return {
    kind: "block",
    block,
    activeItem: item?.slug ?? null,
    activeConcept: found?.concept.id ?? null,
    activeDomain: found?.group.domain.id ?? null,
  };
}

export interface Crumb {
  label: string;
  href: string;
}

/** Labels for the first path segment; anything unlisted gets no breadcrumb. */
export type SectionLabels = Record<"dashboard" | "roadmap" | "jobs" | "explore" | "profile" | "upgrade", string>;

/**
 * Home first, then the section, then the block and item when they resolve.
 * The last crumb is the current page.
 */
export function breadcrumbFor(pathname: string, blocks: NavBlock[] | null, labels: SectionLabels): Crumb[] {
  const [root, second, third, fourth] = segments(pathname);
  const home: Crumb = { label: labels.dashboard, href: routes.dashboard };
  if (!root || root === "dashboard" || !(root in labels)) return [home];

  const crumbs: Crumb[] = [home, { label: labels[root as keyof SectionLabels], href: `/${root}` }];
  if (root !== "roadmap" || !second) return crumbs;

  const block = blocks?.find((entry) => entry.slug === second);
  if (!block) return crumbs;
  crumbs.push({ label: block.shortTitle, href: block.href });

  const item = third ? block.items.find((entry) => entry.slug === third) : undefined;
  if (item) crumbs.push({ label: item.title, href: item.href });
  const concept = !item && fourth ? findConcept(block, fourth) : null;
  if (concept) crumbs.push({ label: concept.concept.title, href: concept.concept.href });
  return crumbs;
}
