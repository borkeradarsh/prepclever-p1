// The dev scenarios must produce valid progress for every role, and must land
// the Continue card where the spec says each state should.

import { describe, expect, it } from "vitest";
import { ROLE_IDS } from "@/components/auth/onboarding/types";
import { nextRecommended, resolveBlocks } from "@/lib/journey";
import { buildGapReport, buildSyllabus, learningOrder } from "@/lib/syllabus";
import { codecSpace } from "./store";
import { seedProgress } from "./scenarios";

const blocks = resolveBlocks();

describe.each(ROLE_IDS)("scenario seeds for %s", (roleId) => {
  const order = learningOrder(roleId).map((concept) => concept.id);
  const recommend = (scenario: Parameters<typeof seedProgress>[0], plan: "free" | "pro" = "free") => {
    const progress = seedProgress(scenario, roleId);
    return nextRecommended({ blocks, progress, plan, learningOrder: order, ratings: progress.auditRatings });
  };

  it("only references ids the progress cookie can store", () => {
    for (const scenario of ["live", "first-run", "in-progress", "complete"] as const) {
      const progress = seedProgress(scenario, roleId);
      for (const id of progress.completedLessonIds) expect(codecSpace.lessonIds).toContain(id);
      for (const id of progress.checklistDone) expect(codecSpace.checklistIds).toContain(id);
      for (const key of progress.doneItems) expect(codecSpace.itemKeys).toContain(key);
      for (const id of Object.keys(progress.auditRatings)) expect(codecSpace.conceptIds).toContain(id);
    }
  });

  it("first run starts at Block 1", () => {
    expect(recommend("first-run")).toMatchObject({ blockId: "market", itemSlug: "landscape" });
  });

  it("in progress resumes the last Block 1 item and has a partial gap report", () => {
    expect(recommend("in-progress")).toMatchObject({ blockId: "market", itemSlug: "target-companies" });
    const progress = seedProgress("in-progress", roleId);
    const report = buildGapReport(buildSyllabus(roleId, progress.auditRatings), progress.auditRatings);
    expect(report.readiness).toBeGreaterThan(0);
    expect(report.readiness).toBeLessThan(1);
  });

  it("complete leaves nothing to recommend and full readiness", () => {
    expect(recommend("complete", "pro")).toBeNull();
    const progress = seedProgress("complete", roleId);
    expect(buildGapReport(buildSyllabus(roleId, progress.auditRatings), progress.auditRatings).readiness).toBe(1);
  });
});
