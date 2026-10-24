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
