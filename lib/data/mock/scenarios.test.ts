// Proves each acceptance scenario actually produces the dashboard state it is
// meant to demonstrate, so the widgets built next session have something to show.

import { describe, expect, it } from "vitest";
import { roles } from "@/components/auth/onboarding/config";
import { canAccess } from "@/lib/access";
import { buildCatalogue, buildPath } from "@/lib/data/mock/catalogue.mock";
import { buildReadiness } from "@/lib/data/mock/readiness.mock";
import { seedProgress } from "@/lib/data/mock/scenarios";
import {
  deriveStageProgress,
  findNextLesson,
  isFirstRun,
  readinessSummary,
  weeklyGoalState,
} from "@/lib/progress";

const roleIds = roles.map((role) => role.id);
const free = { plan: "free" as const };
const pro = { plan: "pro" as const };

function fixture(roleId: (typeof roleIds)[number]) {
  const path = buildPath(roleId, "it_services");
  const { courses } = buildCatalogue(roleId);
  return { path, courses };
}

describe("first-run", () => {
  it.each(roleIds)("puts %s at the very first lesson, which is free", (roleId) => {
    const { path, courses } = fixture(roleId);
    const progress = seedProgress("first-run", path, courses);

    expect(isFirstRun(progress)).toBe(true);
    expect(weeklyGoalState(progress).kind).toBe("first_run");

    const next = findNextLesson(path, courses, progress);
    expect(next).not.toBeNull();
    expect(next?.lesson.order).toBe(1);
    expect(canAccess(free, next!.lesson)).toBe(true);

    expect(readinessSummary(buildReadiness("first-run"))).toMatchObject({ done: 0, allDone: false });
  });
});

describe("in-progress", () => {
  it.each(roleIds)("leaves %s on a paid lesson, so the locked card is reachable", (roleId) => {
    const { path, courses } = fixture(roleId);
    const progress = seedProgress("in-progress", path, courses);

    expect(progress.completedLessonIds).toHaveLength(3);
    expect(isFirstRun(progress)).toBe(false);

    const next = findNextLesson(path, courses, progress);
    expect(next).not.toBeNull();
    // The point of this scenario: free sees a lock here, pro does not.
    expect(canAccess(free, next!.lesson)).toBe(false);
    expect(canAccess(pro, next!.lesson)).toBe(true);
  });

  it("shows a part-finished weekly goal and a live streak", () => {
    const { path, courses } = fixture("genai_llm");
    const state = weeklyGoalState(seedProgress("in-progress", path, courses));
    expect(state).toEqual({ kind: "in_progress", done: 2, goal: 3, streak: 4 });
  });

  it("marks the first stage in progress and later stages locked", () => {
    const { path, courses } = fixture("genai_llm");
    const result = deriveStageProgress(path, courses, seedProgress("in-progress", path, courses));
    expect(result.stages[0].state).toBe("in_progress");
    expect(result.stages.slice(1).every((stage) => stage.state === "locked")).toBe(true);
    expect(result.allComplete).toBe(false);
  });
});

describe("complete", () => {
  it.each(roleIds)("finishes every %s lesson", (roleId) => {
    const { path, courses } = fixture(roleId);
    const progress = seedProgress("complete", path, courses);

    expect(findNextLesson(path, courses, progress)).toBeNull();

    const result = deriveStageProgress(path, courses, progress);
    expect(result.allComplete).toBe(true);
    expect(result.stages.every((stage) => stage.state === "done")).toBe(true);
    expect(weeklyGoalState(progress).kind).toBe("met");

    // Readiness hides itself in this scenario.
    expect(readinessSummary(buildReadiness("complete")).allDone).toBe(true);
  });
});
