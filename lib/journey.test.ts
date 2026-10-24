import { describe, expect, it } from "vitest";
import { learningOrder } from "@/lib/syllabus";
import { buildBlockItemView, buildBlockViews, itemNeighbours, nextRecommended, resolveBlocks } from "@/lib/journey";
import { conceptKey, emptyProgress, itemKey } from "@/lib/progress";
import type { Plan, Progress, Rating } from "@/types/domain";

const blocks = resolveBlocks();
const order = learningOrder("genai_llm").map((concept) => concept.id);

const recommend = (progress: Progress, plan: Plan = "free") =>
  nextRecommended({ blocks, progress, plan, learningOrder: order, ratings: progress.auditRatings });

const withDone = (...keys: string[]): Progress => ({ ...emptyProgress(), doneItems: keys });
const block1 = ["landscape", "your-role", "target-companies"].map((slug) => itemKey("market", slug));
const block2 = [itemKey("gap-analysis", "skill-audit"), itemKey("gap-analysis", "gap-report")];

describe("nextRecommended", () => {
  it("starts with the first Block 1 item", () => {
    expect(recommend(emptyProgress())).toMatchObject({ kind: "item", blockId: "market", itemSlug: "landscape", locked: false });
  });

  it("finishes Block 1 before anything else", () => {
    expect(recommend(withDone(block1[0], block1[1]))).toMatchObject({ itemSlug: "target-companies" });
  });

  it("then the skill audit, then the gap report", () => {
    expect(recommend(withDone(...block1))).toMatchObject({ blockId: "gap-analysis", itemSlug: "skill-audit" });
    expect(recommend(withDone(...block1, block2[0]))).toMatchObject({ itemSlug: "gap-report" });
  });

  it("then the first gap in learning order, locked for free users", () => {
    const free = recommend(withDone(...block1, ...block2), "free");
    expect(free).toMatchObject({ kind: "concept", conceptId: order[0], locked: true });
    const pro = recommend(withDone(...block1, ...block2), "pro");
    expect(pro).toMatchObject({ kind: "concept", conceptId: order[0], locked: false });
  });

  it("skips concepts rated confident", () => {
    const progress = { ...withDone(...block1, ...block2), auditRatings: { [order[0]]: "confident" as Rating } };
    expect(recommend(progress)).toMatchObject({ kind: "concept", conceptId: order[1] });
  });

  it("then Blocks 4 to 6 in order, skipping coming-soon items", () => {
    const allConfident = Object.fromEntries(order.map((id) => [id, "confident" as Rating]));
    const progress = { ...withDone(...block1, ...block2), auditRatings: allConfident };
    expect(recommend(progress, "pro")).toMatchObject({ blockId: "positioning", itemSlug: "resume", locked: false });

    const positioning = ["resume", "linkedin", "github"].map((slug) => itemKey("positioning", slug));
    const later = { ...progress, doneItems: [...progress.doneItems, ...positioning] };
    expect(recommend(later)).toMatchObject({ blockId: "referrals", itemSlug: "where-to-apply", locked: true });
  });

  it("returns null when everything is done", () => {
    const every = blocks.flatMap((block) => block.items.map((item) => itemKey(block.slug, item.slug)));
    const progress = { ...withDone(...every, ...order.map(conceptKey)) };
    expect(recommend(progress)).toBeNull();
  });
});

describe("itemNeighbours", () => {
  it("links within a block", () => {
    const { previous, next } = itemNeighbours(blocks, "market", "your-role");
    expect(previous?.href).toBe("/roadmap/market/landscape");
    expect(next.href).toBe("/roadmap/market/target-companies");
  });

  it("links the last item of a block to the next block", () => {
    expect(itemNeighbours(blocks, "market", "target-companies").next.href).toBe("/roadmap/gap-analysis");
  });

  it("links the last item of the last block to the dashboard", () => {
    expect(itemNeighbours(blocks, "interviews", "interview-pillars").next.href).toBe("/dashboard");
  });

  it("never sends Next to a coming-soon item", () => {
    expect(itemNeighbours(blocks, "positioning", "github").next.href).toBe("/roadmap/referrals");
    expect(itemNeighbours(blocks, "referrals", "where-to-apply").next.href).toBe("/roadmap/interviews");
  });

  it("has no Previous on a block's first item", () => {
    expect(itemNeighbours(blocks, "market", "landscape").previous).toBeNull();
    expect(itemNeighbours(blocks, "gap-analysis", "skill-audit").previous).toBeNull();
  });

  it("still gives a coming-soon item its neighbours", () => {
    const { previous, next } = itemNeighbours(blocks, "positioning", "resume-evaluate");
    expect(previous?.href).toBe("/roadmap/positioning/github");
    expect(next.href).toBe("/roadmap/referrals");
    // ...but never sends Previous back onto another coming-soon item.
    expect(itemNeighbours(blocks, "referrals", "application-tracker").previous?.href).toBe(
      "/roadmap/referrals/where-to-apply",
    );
  });

  it("titles Next after what it opens", () => {
    expect(itemNeighbours(blocks, "market", "landscape").next.title).toBe("Your target role");
    expect(itemNeighbours(blocks, "market", "target-companies").next.title).toBe(blocks[1].title);
    expect(itemNeighbours(blocks, "interviews", "interview-pillars").next.title).toBe("Home");
  });

  it("walks every available item in order, then the next block, ending at the dashboard", () => {
    const steps = blocks.flatMap((block) =>
      block.items.filter((item) => item.status === "available").map((item) => ({ block: block.slug, item: item.slug })),
    );
    steps.forEach((step, index) => {
      const next = itemNeighbours(blocks, step.block, step.item).next.href;
      const following = steps[index + 1];
      if (!following) expect(next).toBe("/dashboard");
      else if (following.block === step.block) expect(next).toBe(`/roadmap/${following.block}/${following.item}`);
      else expect(next).toBe(`/roadmap/${following.block}`);
    });
  });
});

describe("lock behaviour per block", () => {
  const expected = { market: false, "gap-analysis": false, upskilling: true, positioning: true, referrals: true, interviews: true };

  for (const plan of ["free", "pro"] as const) {
    it(`locks the right items for a ${plan} user`, () => {
      const views = buildBlockViews(blocks, plan, emptyProgress(), order);
      for (const block of views) {
        const paidBlock = expected[block.slug];
        expect(block.locked).toBe(plan === "free" && paidBlock);
        for (const item of block.items) {
          const view = buildBlockItemView(views, block.slug, item.slug, plan, emptyProgress());
          // The concept map is the one free item inside a Pro block.
          const freeOverride = block.slug === "upskilling" && item.slug === "concept-map";
          expect(view?.locked, `${block.slug}/${item.slug}`).toBe(plan === "free" && paidBlock && !freeOverride);
        }
      }
    });
  }
});

describe("block views", () => {
  it("locks Pro blocks for free users only", () => {
    const free = buildBlockViews(blocks, "free", emptyProgress(), order);
    expect(free.map((block) => block.locked)).toEqual([false, false, true, true, true, true]);
    const pro = buildBlockViews(blocks, "pro", emptyProgress(), order);
    expect(pro.every((block) => !block.locked)).toBe(true);
  });

  it("counts Block 3's concepts in its progress", () => {
    const [, , upskilling] = buildBlockViews(blocks, "pro", withDone(conceptKey(order[0])), order);
    expect(upskilling.progress).toMatchObject({ done: 1, total: 2 + order.length, state: "in_progress" });
  });

  it("builds an item view with lock state and done flag", () => {
    const views = buildBlockViews(blocks, "free", withDone(block1[0]), order);
    expect(buildBlockItemView(views, "market", "landscape", "free", withDone(block1[0]))).toMatchObject({
      locked: false,
      done: true,
    });
    expect(buildBlockItemView(views, "interviews", "prep-by-round", "free", emptyProgress())?.locked).toBe(true);
    expect(buildBlockItemView(views, "market", "nope", "free", emptyProgress())).toBeNull();
  });
});
