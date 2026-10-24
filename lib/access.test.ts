// Covers the access rule itself, by block and by preview.

import { describe, expect, it } from "vitest";
import { ACCESS_RULES, canAccess, canPreview, resolveAccess } from "@/lib/access";
import { resolveBlocks } from "@/lib/journey";

const free = { plan: "free" as const };
const pro = { plan: "pro" as const };

describe("canAccess", () => {
  it("lets anyone open a free item", () => {
    expect(canAccess(free, { access: "free" })).toBe(true);
    expect(canAccess(pro, { access: "free" })).toBe(true);
  });

  it("keeps a free user out of a paid item", () => {
    expect(canAccess(free, { access: "paid" })).toBe(false);
  });

  it("lets a pro user open a paid item", () => {
    expect(canAccess(pro, { access: "paid" })).toBe(true);
  });
});

describe("access by block", () => {
  it("opens Blocks 1 and 2 to free users and keeps 3 to 6 for Pro", () => {
    const blocks = resolveBlocks();
    expect(blocks.map((block) => canAccess(free, { access: block.tier }))).toEqual([true, true, false, false, false, false]);
    expect(blocks.every((block) => canAccess(pro, { access: block.tier }))).toBe(true);
  });

  it("lets an item override its block default", () => {
    expect(resolveAccess("upskilling")).toBe("paid");
    expect(resolveAccess("upskilling", "free")).toBe("free");
  });

  it("keeps jobs free", () => {
    expect(canAccess(free, { access: ACCESS_RULES.jobs })).toBe(true);
  });

  // Flipping a rule changes behaviour everywhere with no component edits.
  it("opens a block to free users when its rule is relaxed", () => {
    const original = ACCESS_RULES.blocks.positioning;
    try {
      ACCESS_RULES.blocks.positioning = "free";
      const positioning = resolveBlocks().find((block) => block.slug === "positioning")!;
      expect(canAccess(free, positioning.items[0])).toBe(true);
    } finally {
      ACCESS_RULES.blocks.positioning = original;
    }
  });
});

describe("free previews", () => {
  it("shows item titles and summaries and concept overviews to everyone", () => {
    expect(canPreview("itemTitleAndSummary")).toBe(true);
    expect(canPreview("conceptOverview")).toBe(true);
  });
});
