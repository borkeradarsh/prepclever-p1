// Every progress derivation the roadmap and dashboard need, as pure functions
// over plain data. Widgets render these results; they never recompute them.

import type { Block, BlockId, BlockProgress, Checklist, ChecklistItem, Progress } from "@/types/domain";

/** The whole roadmap's done over total, summed from per-block progress. */
export function roadmapTotals(progress: Pick<BlockProgress, "done" | "total">[]): { done: number; total: number } {
  return progress.reduce((sum, block) => ({ done: sum.done + block.done, total: sum.total + block.total }), { done: 0, total: 0 });
}

/** The key a block item is stored under in `doneItems` and `lastItem`. */
export const itemKey = (blockId: BlockId, itemSlug: string) => `${blockId}/${itemSlug}`;
/** The key a concept is stored under in `doneItems` and `lastItem`. */
export const conceptKey = (conceptId: string) => `concept:${conceptId}`;

export function emptyProgress(): Progress {
  return {
    completedLessonIds: [],
    auditRatings: {},
    checklistDone: [],
    doneItems: [],
    lastItem: null,
    weeklyGoalSessions: null,
    sessionsThisWeek: 0,
    streakDays: 0,
  };
}

export function isLessonComplete(lessonId: string, progress: Progress) {
  return progress.completedLessonIds.includes(lessonId);
}

export function isItemDone(key: string, progress: Progress) {
  return progress.doneItems.includes(key);
}

export function isFirstRun(progress: Progress) {
  return (
    progress.doneItems.length === 0 &&
    progress.completedLessonIds.length === 0 &&
    Object.keys(progress.auditRatings).length === 0 &&
    progress.lastItem === null
  );
}

/**
 * Done over total for a block. Only available items count: a coming-soon item
 * can never be finished, so it must not hold a block below 100%. `extraKeys`
 * adds Block 3's concepts, which are per role and not in the block config.
 */
export function blockProgress(block: Block, progress: Progress, extraKeys: string[] = []): BlockProgress {
  const keys = [
    ...block.items.filter((item) => item.status === "available").map((item) => itemKey(block.slug, item.slug)),
    ...extraKeys,
  ];
  const done = keys.filter((key) => progress.doneItems.includes(key)).length;
  const total = keys.length;
  return {
    blockId: block.slug,
    done,
    total,
    ratio: total === 0 ? 0 : done / total,
    state: done === 0 ? "not_started" : done === total ? "done" : "in_progress",
  };
}

export function checklistProgress(checklist: Checklist, progress: Progress) {
  const done = new Set(progress.checklistDone);
  const total = checklist.items.length;
  const completed = checklist.items.filter((item) => done.has(item.id)).length;
  return {
    done: completed,
    total,
    ratio: total === 0 ? 0 : completed / total,
    next: checklist.items.find((item) => !done.has(item.id)) ?? null,
  };
}

/** Profile readiness: Block 4's checklists taken together. Hidden when complete. */
export function profileReadiness(checklists: Checklist[], progress: Progress) {
  const done = new Set(progress.checklistDone);
  let next: { checklistId: Checklist["id"]; item: ChecklistItem } | null = null;
  let total = 0;
  let completed = 0;
  for (const list of checklists) {
    for (const item of list.items) {
      total += 1;
      if (done.has(item.id)) completed += 1;
      else if (!next) next = { checklistId: list.id, item };
    }
  }
  return { done: completed, total, next, allDone: total > 0 && completed === total };
}

export type WeeklyGoalKind = "first_run" | "in_progress" | "met";

export function weeklyGoalState(progress: Progress) {
  const goal = progress.weeklyGoalSessions;
  const done = progress.sessionsThisWeek;
  const kind: WeeklyGoalKind = goal === null ? "first_run" : done >= goal ? "met" : "in_progress";
  return { kind, done, goal, streak: progress.streakDays };
}
