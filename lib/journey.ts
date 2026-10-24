// The roadmap as a journey: resolved blocks, Previous/Next links and the next
// recommended step (docs/dashboard-v2-spec.md sections 5, 6 and 8). Pure.

import { blocks as blockConfigs, type BlockConfig } from "@/content/blocks.config";
import { getConceptById, getDomain } from "@/content/concepts";
import { ACCESS_RULES, canAccess, resolveAccess } from "@/lib/access";
import { blockProgress, conceptKey, itemKey } from "@/lib/progress";
import { routes } from "@/lib/routes";
import type {
  Block,
  BlockId,
  Concept,
  Lesson,
  BlockItemView,
  BlockView,
  ItemLink,
  LastStudied,
  NextRecommended,
  Plan,
  Progress,
  Rating,
} from "@/types/domain";

/** Config plus the access rules: the shape every caller sees. */
export function resolveBlock(config: BlockConfig, index: number): Block {
  const items = config.items.map((item) => ({
    slug: item.slug,
    title: item.title,
    kind: item.kind,
    status: item.status,
    access: resolveAccess(config.slug, item.access),
    estimatedMinutes: item.estimatedMinutes,
    ...(item.extras ? { extras: item.extras } : {}),
  }));
  return {
    slug: config.slug,
    order: index + 1,
    title: config.title,
    shortTitle: config.shortTitle,
    summary: config.summary,
    bullets: config.bullets,
    tier: ACCESS_RULES.blocks[config.slug],
    status: items.some((item) => item.status === "available") ? "available" : "coming_soon",
    items,
  };
}

export function resolveBlocks(configs: BlockConfig[] = blockConfigs): Block[] {
  return configs.map(resolveBlock);
}

/** Per-user block views. `conceptIds` is the role syllabus, counted in Block 3. */
export function buildBlockViews(
  blocks: Block[],
  plan: Plan,
  progress: Progress,
  conceptIds: string[],
): BlockView[] {
  return blocks.map((block) => ({
    ...block,
    locked: !canAccess({ plan }, { access: block.tier }),
    progress: blockProgress(block, progress, block.slug === "upskilling" ? conceptIds.map(conceptKey) : []),
  }));
}

/**
 * Previous and Next for a block item. Coming-soon items are skipped, so Next
 * never lands on a dead end. After a block's last item, Next is the following
 * block's overview; after the last block, the dashboard.
 */
export function itemNeighbours(blocks: Block[], blockId: BlockId, itemSlug: string) {
  const index = blocks.findIndex((block) => block.slug === blockId);
  const block = blocks[index];
  const live = block.items.filter((item) => item.status === "available" || item.slug === itemSlug);
  const position = live.findIndex((item) => item.slug === itemSlug);

  const prevItem = position > 0 ? live[position - 1] : null;
  const nextItem = position >= 0 && position < live.length - 1 ? live[position + 1] : null;
  const nextBlock = blocks[index + 1] ?? null;

  const previous: ItemLink | null = prevItem
    ? { title: prevItem.title, href: routes.blockItem(block.slug, prevItem.slug) }
    : null;
  const next: ItemLink = nextItem
    ? { title: nextItem.title, href: routes.blockItem(block.slug, nextItem.slug) }
    : nextBlock
      ? { title: nextBlock.title, href: routes.block(nextBlock.slug) }
      : { title: "Home", href: routes.dashboard };
  return { previous, next };
}

/**
 * Previous and Next between concepts, in the role's learning order. After the
 * last concept, Next is Block 4. A concept outside the role has no Previous,
 * and Next returns to the Block 3 overview.
 */
export function conceptNeighbours(order: string[], conceptId: string): { previous: ItemLink | null; next: ItemLink } {
  const link = (id: string | undefined): ItemLink | null => {
    const concept = id ? getConceptById(id) : null;
    return concept ? { title: concept.title, href: routes.concept(concept.domain, concept.id) } : null;
  };
  const index = order.indexOf(conceptId);
  if (index === -1) return { previous: null, next: { title: "Block 3 overview", href: routes.block("upskilling") } };

  const after = blockConfigs[blockConfigs.findIndex((block) => block.slug === "upskilling") + 1];
  return {
    previous: link(order[index - 1]),
    next:
      link(order[index + 1]) ??
      (after ? { title: after.title, href: routes.block(after.slug) } : { title: "Home", href: routes.dashboard }),
  };
}

/**
 * Previous and Next for a lesson: the neighbouring lesson, else the concept
 * page before the first lesson, and the next concept after the last.
 */
export function lessonNeighbours(
  lessons: Pick<Lesson, "slug" | "title">[],
  lessonSlug: string,
  concept: Pick<Concept, "id" | "domain" | "title">,
  nextConcept: ItemLink,
): { previous: ItemLink; next: ItemLink } {
  const index = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const before = index > 0 ? lessons[index - 1] : null;
  const after = index >= 0 ? lessons[index + 1] : undefined;
  const lessonLink = (lesson: Pick<Lesson, "slug" | "title">): ItemLink => ({
    title: lesson.title,
    href: routes.conceptLesson(concept.domain, concept.id, lesson.slug),
  });
  return {
    previous: before ? lessonLink(before) : { title: concept.title, href: routes.concept(concept.domain, concept.id) },
    next: after ? lessonLink(after) : nextConcept,
  };
}

/**
 * Turns a progress key into something to link to: `block/item` or
 * `concept:<id>`. Unknown keys (an item since removed) give null.
 */
export function resolveLastItem(key: string | null, blocks: Block[]): LastStudied | null {
  if (!key) return null;
  if (key.startsWith("concept:")) {
    const concept = getConceptById(key.slice("concept:".length));
    if (!concept) return null;
    return {
      title: concept.title,
      href: routes.concept(concept.domain, concept.id),
      context: `Block 3 · ${getDomain(concept.domain)?.title ?? concept.domain}`,
    };
  }
  const [blockSlug, itemSlug] = key.split("/");
  const block = blocks.find((entry) => entry.slug === blockSlug);
  const item = block?.items.find((entry) => entry.slug === itemSlug);
  if (!block || !item) return null;
  return { title: item.title, href: routes.blockItem(block.slug, item.slug), context: `Block ${block.order} · ${block.shortTitle}` };
}

export function buildBlockItemView(
  views: BlockView[],
  blockId: string,
  itemSlug: string,
  plan: Plan,
  progress: Progress,
): BlockItemView | null {
  const block = views.find((view) => view.slug === blockId);
  const item = block?.items.find((entry) => entry.slug === itemSlug);
  if (!block || !item) return null;
  return {
    block,
    item,
    locked: !canAccess({ plan }, item),
    done: progress.doneItems.includes(itemKey(block.slug, item.slug)),
    ...itemNeighbours(views, block.slug, item.slug),
  };
}

/**
 * The audit is finished once it is marked done or every concept in the role's
 * syllabus has a rating, whichever comes first: autosaving means people rarely
 * press a button at the end.
 */
export function auditComplete(progress: Progress, learningOrder: string[]): boolean {
  if (progress.doneItems.includes(itemKey("gap-analysis", "skill-audit"))) return true;
  return learningOrder.length > 0 && learningOrder.every((id) => progress.auditRatings[id] !== undefined);
}

/**
 * The Continue card's target, in the spec's order: unfinished Block 1 items,
 * the skill audit, the gap report, the first gap in learning order (locked for
 * free users), then Blocks 4 to 6. Null when there is nothing left.
 */
export function nextRecommended(input: {
  blocks: Block[];
  progress: Progress;
  plan: Plan;
  learningOrder: string[];
  ratings: Record<string, Rating>;
}): NextRecommended | null {
  const { blocks, progress, plan, learningOrder, ratings } = input;
  const done = new Set(progress.doneItems);
  const byId = new Map(blocks.map((block) => [block.slug, block]));

  const firstOpen = (blockId: BlockId, only?: string[]): NextRecommended | null => {
    const block = byId.get(blockId);
    if (!block) return null;
    const item = block.items.find(
      (entry) =>
        entry.status === "available" &&
        (!only || only.includes(entry.slug)) &&
        !done.has(itemKey(blockId, entry.slug)),
    );
    if (!item) return null;
    return {
      kind: "item",
      blockId,
      itemSlug: item.slug,
      title: item.title,
      href: routes.blockItem(blockId, item.slug),
      locked: !canAccess({ plan }, item),
    };
  };

  const fromBlocks =
    firstOpen("market") ??
    (auditComplete(progress, learningOrder) ? null : firstOpen("gap-analysis", ["skill-audit"])) ??
    firstOpen("gap-analysis", ["gap-report"]);
  if (fromBlocks) return fromBlocks;

  const gapId = learningOrder.find((id) => ratings[id] !== "confident" && !done.has(conceptKey(id)));
  const gap = gapId ? getConceptById(gapId) : null;
  if (gap) {
    return {
      kind: "concept",
      conceptId: gap.id,
      title: gap.title,
      href: routes.concept(gap.domain, gap.id),
      locked: !canAccess({ plan }, { access: ACCESS_RULES.blocks.upskilling }),
    };
  }

  return firstOpen("positioning") ?? firstOpen("referrals") ?? firstOpen("interviews");
}
