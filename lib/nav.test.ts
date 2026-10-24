import { describe, expect, it } from "vitest";
import { blocks as blockConfigs } from "@/content/blocks.config";
import { sectionLabels, sidebarNav, tabNav } from "@/content/nav.config";
import { buildBlockViews, resolveBlocks } from "@/lib/journey";
import { breadcrumbFor, buildNavBlocks, isActivePath, sidebarContext } from "@/lib/nav";
import { emptyProgress, itemKey } from "@/lib/progress";
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
