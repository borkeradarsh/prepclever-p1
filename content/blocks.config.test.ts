import { describe, expect, it } from "vitest";
import { blocks, firstItem } from "@/content/blocks.config";
import { ACCESS_RULES } from "@/lib/access";
import { resolveBlocks } from "@/lib/journey";

describe("blocks", () => {
  it("defines the six blocks in order", () => {
    expect(blocks.map((block) => block.slug)).toEqual([
      "market",
      "gap-analysis",
      "upskilling",
      "positioning",
      "referrals",
      "interviews",
    ]);
  });

  it("gives every block a title, summary and bullets", () => {
    for (const block of blocks) {
      expect(block.title).not.toHaveLength(0);
      expect(block.summary).not.toHaveLength(0);
      expect(block.bullets.length).toBeGreaterThan(0);
    }
  });

  it("keeps item slugs unique within a block", () => {
    for (const block of blocks) {
      const slugs = block.items.map((item) => item.slug);
      expect(new Set(slugs).size, block.slug).toBe(slugs.length);
    }
  });

  it("marks exactly the spec's unbuilt items as coming soon", () => {
    const comingSoon = blocks.flatMap((block) =>
      block.items.filter((item) => item.status === "coming_soon").map((item) => `${block.slug}/${item.slug}`),
    );
    expect(comingSoon).toEqual([
      "positioning/resume-evaluate",
      "referrals/referral-outreach",
      "referrals/application-tracker",
    ]);
  });

  it("points the first item at a real Block 1 item", () => {
    const market = blocks.find((block) => block.slug === firstItem.block);
    expect(market?.items.some((item) => item.slug === firstItem.item)).toBe(true);
  });
});

describe("resolveBlocks", () => {
  it("takes each block's tier from the access rules: Blocks 1 and 2 free, 3 to 6 Pro", () => {
    expect(resolveBlocks().map((block) => block.tier)).toEqual(["free", "free", "paid", "paid", "paid", "paid"]);
    for (const block of resolveBlocks()) expect(block.tier).toBe(ACCESS_RULES.blocks[block.slug]);
  });

  it("gives items their block's access unless they override it", () => {
    const upskilling = resolveBlocks().find((block) => block.slug === "upskilling")!;
    expect(upskilling.items.find((item) => item.slug === "concept-map")?.access).toBe("free");
    expect(upskilling.items.find((item) => item.slug === "track-plan")?.access).toBe("paid");
  });

  it("numbers blocks from 1", () => {
    expect(resolveBlocks().map((block) => block.order)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
