import { describe, expect, it } from "vitest";
import { blocks as blockConfigs } from "@/content/blocks.config";
import { roadmapLinks, roadmapPageLabels, sectionLabels, sidebarNav, tabNav } from "@/content/nav.config";
import { buildBlockViews, resolveBlocks } from "@/lib/journey";
import { breadcrumbFor, buildNavBlocks, isActivePath, sidebarContext } from "@/lib/nav";
import { conceptKey, emptyProgress, itemKey } from "@/lib/progress";
import { buildSyllabus } from "@/lib/syllabus";
import type { Plan } from "@/types/domain";

const navFor = (plan: Plan, doneItems: string[] = []) =>
  buildNavBlocks(buildBlockViews(resolveBlocks(), plan, { ...emptyProgress(), doneItems }, []), plan, doneItems);

describe("nav blocks derive from blocks.config", () => {
  it("lists every configured block, in order, with its titles", () => {
    const nav = navFor("free");
    expect(nav.map((block) => block.slug)).toEqual(blockConfigs.map((block) => block.slug));
    expect(nav.map((block) => block.shortTitle)).toEqual(blockConfigs.map((block) => block.shortTitle));
    expect(nav.map((block) => block.order)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("lists every configured item of each block, in order, with its route", () => {
    for (const [index, block] of navFor("free").entries()) {
      const config = blockConfigs[index];
      expect(block.href).toBe(`/roadmap/${config.slug}`);
      expect(block.items.map((item) => item.slug)).toEqual(config.items.map((item) => item.slug));
      expect(block.items.map((item) => item.title)).toEqual(config.items.map((item) => item.title));
      for (const item of block.items) expect(item.href).toBe(`/roadmap/${config.slug}/${item.slug}`);
    }
  });

  it("keeps coming-soon items listed, with their status", () => {
    const positioning = navFor("free").find((block) => block.slug === "positioning");
    expect(positioning?.items.find((item) => item.slug === "resume-evaluate")?.status).toBe("coming_soon");
  });

  it("locks Blocks 3 to 6 and their items for free users, but not the free concept map", () => {
    const nav = navFor("free");
    expect(nav.map((block) => block.locked)).toEqual([false, false, true, true, true, true]);
    const upskilling = nav.find((block) => block.slug === "upskilling");
    expect(upskilling?.items.find((item) => item.slug === "concept-map")?.locked).toBe(false);
    expect(upskilling?.items.find((item) => item.slug === "track-plan")?.locked).toBe(true);
    expect(nav.find((block) => block.slug === "market")?.items.every((item) => !item.locked)).toBe(true);
  });

  it("shows Pro users no locks at all", () => {
    for (const block of navFor("pro")) {
      expect(block.locked).toBe(false);
      expect(block.items.every((item) => !item.locked)).toBe(true);
    }
  });

  it("ticks done items and carries the block's progress", () => {
    const market = navFor("free", [itemKey("market", "landscape")]).find((block) => block.slug === "market");
    expect(market?.items.map((item) => item.done)).toEqual([true, false, false]);
    expect(market).toMatchObject({ done: 1, total: 3, state: "in_progress" });
  });
});

describe("sidebarContext", () => {
  const nav = navFor("free");

  it("is the home context outside a block", () => {
    for (const path of ["/dashboard", "/jobs", "/explore", "/roadmap", "/roadmap/concept-map", "/roadmap/nope/x"]) {
      expect(sidebarContext(path, nav).kind).toBe("home");
    }
  });

  it("switches to a block's contents on its overview and items", () => {
    expect(sidebarContext("/roadmap/market", nav)).toMatchObject({ kind: "block", activeItem: null });
    const item = sidebarContext("/roadmap/market/your-role", nav);
    expect(item.kind === "block" && item.block.slug).toBe("market");
    expect(item.kind === "block" && item.activeItem).toBe("your-role");
  });

  it("falls back to home when the blocks could not load", () => {
    expect(sidebarContext("/roadmap/market", null).kind).toBe("home");
  });
});

describe("breadcrumbFor", () => {
  const nav = navFor("free");

  it("names the section, then the block, then the item", () => {
    expect(breadcrumbFor("/roadmap/market/your-role", nav, sectionLabels)).toEqual([
      { label: "Home", href: "/dashboard" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Market and role", href: "/roadmap/market" },
      { label: "Your target role", href: "/roadmap/market/your-role" },
    ]);
  });

  it("is just Home on the dashboard and on unknown sections", () => {
    expect(breadcrumbFor("/dashboard", nav, sectionLabels)).toEqual([{ label: "Home", href: "/dashboard" }]);
    expect(breadcrumbFor("/somewhere", nav, sectionLabels)).toHaveLength(1);
  });

  it("stops at the section for pages it cannot name", () => {
    expect(breadcrumbFor("/jobs/example-123", nav, sectionLabels).map((crumb) => crumb.label)).toEqual(["Home", "Jobs"]);
    expect(breadcrumbFor("/roadmap/market/nope", nav, sectionLabels)).toHaveLength(3);
  });
});

describe("shell nav lists", () => {
  it("puts Home, Roadmap, Jobs and Explore in the tab bar, and Profile only in the sidebar", () => {
    expect(tabNav.map((item) => item.label)).toEqual(["Home", "Roadmap", "Jobs", "Explore"]);
    expect(sidebarNav.map((item) => item.label)).toEqual(["Home", "Roadmap", "Jobs", "Explore", "Profile"]);
  });

  it("matches a link and its children only", () => {
    expect(isActivePath("/roadmap/market", "/roadmap")).toBe(true);
    expect(isActivePath("/roadmaps", "/roadmap")).toBe(false);
  });
});

describe("Block 3 concept groups", () => {
  const syllabus = buildSyllabus("genai_llm", {});
  const withGroups = (plan: Plan, doneItems: string[] = []) =>
    buildNavBlocks(buildBlockViews(resolveBlocks(), plan, { ...emptyProgress(), doneItems }, syllabus.order), plan, doneItems, syllabus);
  const upskilling = (plan: Plan, doneItems: string[] = []) => withGroups(plan, doneItems).find((block) => block.slug === "upskilling")!;

  it("lists the role's domains and concepts in learning order, only in Block 3", () => {
    const block = upskilling("free");
    expect(block.groups?.map((group) => group.domain.id)).toEqual(syllabus.domains.map((group) => group.domain.id));
    const ids = block.groups!.flatMap((group) => group.concepts.map((concept) => concept.id));
    expect(new Set(ids)).toEqual(new Set(syllabus.order));
    for (const group of block.groups!) {
      const positions = group.concepts.map((concept) => syllabus.order.indexOf(concept.id));
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    }
    expect(withGroups("free").filter((block) => block.groups).map((block) => block.slug)).toEqual(["upskilling"]);
  });

  it("badges core and good to know, ticks done concepts, and locks lessons for free users only", () => {
    const first = syllabus.order[0];
    const free = upskilling("free", [conceptKey(first)]).groups!.flatMap((group) => group.concepts);
    expect(free.find((concept) => concept.id === first)?.done).toBe(true);
    expect(free.every((concept) => concept.level === 1 || concept.level === 2)).toBe(true);
    expect(free.every((concept) => concept.locked)).toBe(true);
    expect(upskilling("pro").groups!.flatMap((group) => group.concepts).some((concept) => concept.locked)).toBe(false);
  });

  it("opens the concept's domain and marks it current, on the concept and its lessons", () => {
    const nav = withGroups("free");
    const group = upskilling("free").groups![1];
    const concept = group.concepts[0];
    for (const path of [concept.href, `${concept.href}/practice-project`]) {
      const context = sidebarContext(path, nav);
      expect(context).toMatchObject({ kind: "block", activeConcept: concept.id, activeDomain: group.domain.id, activeItem: null });
    }
    expect(sidebarContext("/roadmap/upskilling/track-plan", nav)).toMatchObject({ activeItem: "track-plan", activeConcept: null });
  });

  it("names the concept in the breadcrumb", () => {
    const concept = upskilling("free").groups![0].concepts[0];
    expect(breadcrumbFor(concept.href, withGroups("free"), sectionLabels).at(-1)).toEqual({
      label: concept.title,
      href: concept.href,
    });
  });
});

describe("concept map access", () => {
  const nav = navFor("free");

  it("is listed under Roadmap in the sidebar and drawer", () => {
    expect(roadmapLinks.map((link) => link.href)).toContain("/roadmap/concept-map");
  });

  it("keeps the home context on the map, where its row is the active one", () => {
    expect(sidebarContext("/roadmap/concept-map", nav).kind).toBe("home");
    expect(isActivePath("/roadmap/concept-map", roadmapLinks[0].href)).toBe(true);
  });

  it("names the map in the breadcrumb", () => {
    expect(breadcrumbFor("/roadmap/concept-map", nav, sectionLabels, roadmapPageLabels).map((crumb) => crumb.label)).toEqual([
      "Home",
      "Roadmap",
      "Concept map",
    ]);
  });
});
