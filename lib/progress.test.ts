// Pure derivation tests. Built on the real configs where the rule is about them
// (Block 4's checklists), on small hand-built data elsewhere.

import { describe, expect, it } from "vitest";
import { checklists } from "@/content/checklists.config";
import { resolveBlocks } from "@/lib/journey";
import {
  blockProgress,
  checklistProgress,
  emptyProgress,
  isFirstRun,
  itemKey,
  profileReadiness,
  weeklyGoalState,
} from "@/lib/progress";

const market = resolveBlocks()[0];
const positioning = resolveBlocks().find((block) => block.slug === "positioning")!;

describe("blockProgress", () => {
  it("starts not started", () => {
    expect(blockProgress(market, emptyProgress())).toMatchObject({ done: 0, total: 3, ratio: 0, state: "not_started" });
  });

  it("counts done items and finishes at 100%", () => {
    const some = { ...emptyProgress(), doneItems: [itemKey("market", "landscape")] };
    expect(blockProgress(market, some)).toMatchObject({ done: 1, state: "in_progress" });
    const all = { ...emptyProgress(), doneItems: market.items.map((item) => itemKey("market", item.slug)) };
    expect(blockProgress(market, all)).toMatchObject({ done: 3, ratio: 1, state: "done" });
  });

  it("does not let a coming-soon item hold a block below 100%", () => {
    const live = positioning.items.filter((item) => item.status === "available");
    const progress = { ...emptyProgress(), doneItems: live.map((item) => itemKey("positioning", item.slug)) };
    expect(blockProgress(positioning, progress).state).toBe("done");
  });
});

describe("checklists and profile readiness", () => {
  it("tracks one checklist and its next item", () => {
    const resume = checklists[0];
    const progress = { ...emptyProgress(), checklistDone: [resume.items[0].id] };
    expect(checklistProgress(resume, progress)).toMatchObject({ done: 1, total: resume.items.length, next: resume.items[1] });
  });

  it("derives profile readiness from all of Block 4's checklists", () => {
    const total = checklists.reduce((sum, list) => sum + list.items.length, 0);
    expect(profileReadiness(checklists, emptyProgress())).toMatchObject({ done: 0, total, allDone: false });
    const every = checklists.flatMap((list) => list.items.map((item) => item.id));
    expect(profileReadiness(checklists, { ...emptyProgress(), checklistDone: every })).toMatchObject({
      allDone: true,
      next: null,
    });
  });
});

describe("isFirstRun", () => {
  it("is true only before anything is touched", () => {
    expect(isFirstRun(emptyProgress())).toBe(true);
    expect(isFirstRun({ ...emptyProgress(), auditRatings: { rag: "learning" } })).toBe(false);
    expect(isFirstRun({ ...emptyProgress(), lastItem: "market/landscape" })).toBe(false);
  });
});

describe("weeklyGoalState", () => {
  it("covers first run, in progress and met", () => {
    expect(weeklyGoalState(emptyProgress()).kind).toBe("first_run");
    expect(weeklyGoalState({ ...emptyProgress(), weeklyGoalSessions: 3, sessionsThisWeek: 1 }).kind).toBe("in_progress");
    expect(weeklyGoalState({ ...emptyProgress(), weeklyGoalSessions: 3, sessionsThisWeek: 3 }).kind).toBe("met");
  });
});
