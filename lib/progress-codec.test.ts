import { describe, expect, it } from "vitest";
import { codecSpace, ITEM_KEYS_V1, missingItemKeys, PROGRESS_COOKIE } from "@/lib/data/mock/store";
import { decodeProgress, encodeProgress, type StoredProgress } from "@/lib/progress-codec";
import type { Rating } from "@/types/domain";

const empty: StoredProgress = {
  completedLessonIds: [],
  auditRatings: {},
  checklistDone: [],
  doneItems: [],
  lastItem: null,
  weeklyGoalSessions: null,
};

describe("progress codec", () => {
  it("round-trips a typical progress", () => {
    const progress: StoredProgress = {
      completedLessonIds: [codecSpace.lessonIds[0], codecSpace.lessonIds[40]],
      auditRatings: { [codecSpace.conceptIds[0]]: "confident", [codecSpace.conceptIds[5]]: "not_started" },
      checklistDone: [codecSpace.checklistIds[2]],
      doneItems: [codecSpace.itemKeys[0], codecSpace.itemKeys.at(-1)!],
      lastItem: codecSpace.itemKeys[1],
      weeklyGoalSessions: 3,
    };
    expect(decodeProgress(encodeProgress(progress, "in-progress", codecSpace), codecSpace)).toEqual({
      scenario: "in-progress",
      progress,
    });
  });

  it("round-trips empty progress", () => {
    expect(decodeProgress(encodeProgress(empty, "first-run", codecSpace), codecSpace)?.progress).toEqual(empty);
  });

  it("drops ids it does not know instead of failing", () => {
    const encoded = encodeProgress({ ...empty, doneItems: ["nope/nope"], completedLessonIds: ["ghost"] }, "x", codecSpace);
    expect(decodeProgress(encoded, codecSpace)?.progress).toEqual(empty);
  });

  it("treats anything that is not a v1 value as no progress", () => {
    expect(decodeProgress(undefined, codecSpace)).toBeNull();
    expect(decodeProgress('{"addedLessonIds":[]}', codecSpace)).toBeNull();
    expect(decodeProgress("v0~a~b~c~d~e~f~g", codecSpace)).toBeNull();
  });

  it("uses only URL-safe characters, so the cookie needs no escaping", () => {
    const encoded = encodeProgress({ ...empty, lastItem: codecSpace.itemKeys[3] }, "in-progress", codecSpace);
    expect(encodeURIComponent(encoded)).toBe(encoded);
  });

  it("stays under 3.5 KB in the worst case", () => {
    const worst: StoredProgress = {
      completedLessonIds: codecSpace.lessonIds,
      auditRatings: Object.fromEntries(codecSpace.conceptIds.map((id) => [id, "confident" as Rating])),
      checklistDone: codecSpace.checklistIds,
      doneItems: codecSpace.itemKeys,
      lastItem: codecSpace.itemKeys.at(-1)!,
      weeklyGoalSessions: 14,
    };
    const cookie = `${PROGRESS_COOKIE}=${encodeProgress(worst, "in-progress", codecSpace)}`;
    expect(new TextEncoder().encode(cookie).length).toBeLessThan(3.5 * 1024);
  });
});

describe("item key catalogue", () => {
  it("gives every current block item a cookie index", () => {
    expect(missingItemKeys()).toEqual([]);
  });

  it("only ever grows: the v1 keys keep their positions", () => {
    expect(codecSpace.itemKeys.slice(0, ITEM_KEYS_V1.length)).toEqual(ITEM_KEYS_V1);
  });

  it("still reads a cookie written before Block 6 changed", () => {
    // Encoded against the v1 catalogue alone, as an older deploy would have.
    const v1Space = { ...codecSpace, itemKeys: ITEM_KEYS_V1 };
    const before = {
      ...empty,
      doneItems: ["market/landscape", "gap-analysis/skill-audit", "interviews/interview-pillars", ITEM_KEYS_V1.at(-1)!],
    };
    const cookie = encodeProgress(before, "in-progress", v1Space);
    expect(decodeProgress(cookie, codecSpace)?.progress.doneItems).toEqual(before.doneItems);
  });

  it("round-trips the new Block 6 keys", () => {
    const after = { ...empty, doneItems: ["interviews/interview-process", "interviews/dos-and-donts"] };
    expect(decodeProgress(encodeProgress(after, "complete", codecSpace), codecSpace)?.progress.doneItems).toEqual(
      after.doneItems,
    );
  });
});
