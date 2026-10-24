// Compact cookie encoding for Progress (docs/dashboard-v2-spec.md section 9).
//
//   v1~<scenario>~<ratings>~<lessons>~<checklist>~<items>~<last>~<goal>
//
// Ratings are one digit per concept in concept order (0 unrated, 1 not
// started, 2 learning, 3 confident), trailing zeros trimmed. Lists are base36
// indexes joined with "."; unknown ids are dropped. Every character is URL
// safe, so the value needs no escaping. The scenario tag lets a dev scenario
// switch discard progress recorded under another scenario.
//
// Indexes point into the catalogues passed in, so those must only ever grow at
// the end. TODO(persistence): move progress to the database and delete this.

import type { Progress, Rating } from "@/types/domain";

export interface CodecSpace {
  conceptIds: string[];
  lessonIds: string[];
  checklistIds: string[];
  itemKeys: string[];
}

export type StoredProgress = Omit<Progress, "sessionsThisWeek" | "streakDays">;

const VERSION = "v1";
const RATINGS: Rating[] = ["not_started", "learning", "confident"];

function encodeList(values: string[], space: string[]) {
  const index = new Map(space.map((value, position) => [value, position]));
  return values
    .map((value) => index.get(value))
    .filter((position): position is number => position !== undefined)
    .map((position) => position.toString(36))
    .join(".");
}

function decodeList(raw: string, space: string[]) {
  if (raw === "") return [];
  return raw
    .split(".")
    .map((part) => space[parseInt(part, 36)])
    .filter((value): value is string => value !== undefined);
}

export function encodeProgress(progress: StoredProgress, scenario: string, space: CodecSpace): string {
  const ratings = space.conceptIds
    .map((id) => {
      const rating = progress.auditRatings[id];
      return rating ? String(RATINGS.indexOf(rating) + 1) : "0";
    })
    .join("")
    .replace(/0+$/, "");
  const last = progress.lastItem ? encodeList([progress.lastItem], space.itemKeys) : "";
  return [
    VERSION,
    scenario,
    ratings,
    encodeList(progress.completedLessonIds, space.lessonIds),
    encodeList(progress.checklistDone, space.checklistIds),
    encodeList(progress.doneItems, space.itemKeys),
    last,
    progress.weeklyGoalSessions === null ? "" : String(progress.weeklyGoalSessions),
  ].join("~");
}

/** Null for anything that is not a v1 value, so a stale cookie reads as empty. */
export function decodeProgress(
  raw: string | null | undefined,
  space: CodecSpace,
): { scenario: string; progress: StoredProgress } | null {
  if (!raw) return null;
  const parts = raw.split("~");
  if (parts.length !== 8 || parts[0] !== VERSION) return null;
  const [, scenario, ratings, lessons, checklist, items, last, goal] = parts;

  const auditRatings: Record<string, Rating> = {};
  [...ratings].forEach((digit, position) => {
    const rating = RATINGS[Number(digit) - 1];
    const id = space.conceptIds[position];
    if (rating && id) auditRatings[id] = rating;
  });
  const goalNumber = goal === "" ? null : Number(goal);

  return {
    scenario,
    progress: {
      auditRatings,
      completedLessonIds: decodeList(lessons, space.lessonIds),
      checklistDone: decodeList(checklist, space.checklistIds),
      doneItems: decodeList(items, space.itemKeys),
      lastItem: decodeList(last, space.itemKeys)[0] ?? null,
      weeklyGoalSessions: goalNumber !== null && Number.isFinite(goalNumber) ? goalNumber : null,
    },
  };
}
