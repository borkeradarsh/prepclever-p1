// The dev scenarios as Progress seeds. Pure: no cookies, no latency, so they can
// be unit tested directly. A seed applies until the user changes something;
// from then on the progress cookie holds the whole state (see store.ts).

import { checklists } from "@/content/checklists.config";
import { resolveBlocks } from "@/lib/journey";
import { conceptKey, emptyProgress, itemKey } from "@/lib/progress";
import { learningOrder } from "@/lib/syllabus";
import type { Progress, Rating, RoleId } from "@/types/domain";
import type { Scenario } from "@/lib/dev-flags";
import { buildLessons } from "./lessons.mock";

export const scenarioSeeds: Record<Scenario, (roleId: RoleId) => Progress> = {
  "first-run": () => emptyProgress(),

  /**
   * Two Block 1 items done and a partial audit, so Continue points at the last
   * Block 1 item and the gap report has something to score.
   */
  "in-progress": (roleId) => {
    const order = learningOrder(roleId).map((concept) => concept.id);
    const sample: Rating[] = ["confident", "confident", "learning", "learning", "not_started", "confident"];
    return {
      ...emptyProgress(),
      doneItems: [itemKey("market", "landscape"), itemKey("market", "your-role")],
      lastItem: itemKey("market", "your-role"),
      auditRatings: Object.fromEntries(sample.map((rating, index) => [order[index], rating])),
      checklistDone: checklists[0].items.slice(0, 2).map((item) => item.id),
      weeklyGoalSessions: 3,
      sessionsThisWeek: 2,
      streakDays: 4,
    };
  },

  complete: (roleId) => {
    const order = learningOrder(roleId);
    const blockItems = resolveBlocks().flatMap((block) =>
      block.items.filter((item) => item.status === "available").map((item) => itemKey(block.slug, item.slug)),
    );
    return {
      completedLessonIds: order.flatMap((concept) => buildLessons(concept).map((lesson) => lesson.id)),
      auditRatings: Object.fromEntries(order.map((concept) => [concept.id, "confident" as Rating])),
      checklistDone: checklists.flatMap((list) => list.items.map((item) => item.id)),
      doneItems: [...blockItems, ...order.map((concept) => conceptKey(concept.id))],
      lastItem: blockItems.at(-1) ?? null,
      weeklyGoalSessions: 3,
      sessionsThisWeek: 3,
      streakDays: 11,
    };
  },
};

export function seedProgress(scenario: Scenario, roleId: RoleId): Progress {
  return scenarioSeeds[scenario](roleId);
}
