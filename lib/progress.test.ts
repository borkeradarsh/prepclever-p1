// Pure derivation tests against a small hand-built path, so a change in the mock
// catalogue cannot quietly change what these assert.

import { describe, expect, it } from "vitest";
import {
  courseProgress,
  deriveStageProgress,
  findLastFreeLesson,
  findNextLesson,
  isFirstRun,
  orderedLessons,
  readinessSummary,
  weeklyGoalState,
} from "@/lib/progress";
import type { Course, Path, Progress } from "@/types/domain";

function lesson(id: string, order: number, access: "free" | "paid" = "paid") {
  return { id, slug: id, title: id, type: "reading" as const, durationMin: 20, order, access };
}

const courses: Course[] = [
  {
    id: "c1",
    slug: "c1",
    title: "Course one",
    summary: "",
    stageId: "s1",
    // Deliberately out of order, to prove ordering is derived and not assumed.
    lessons: [lesson("l2", 2), lesson("l1", 1, "free")],
  },
  {
    id: "c2",
    slug: "c2",
    title: "Course two",
    summary: "",
    stageId: "s2",
    lessons: [lesson("l3", 1, "free"), lesson("l4", 2)],
  },
];

const path: Path = {
  roleId: "genai_llm",
  situation: "student",
  title: "Test path",
  stages: [
    { id: "s2", order: 2, name: "Stage two", outcome: "", courseIds: ["c2"] },
    { id: "s1", order: 1, name: "Stage one", outcome: "", courseIds: ["c1"] },
  ],
};

function progressWith(completed: string[], overrides: Partial<Progress> = {}): Progress {
  return {
    completedLessonIds: completed,
    lastLessonId: completed.at(-1) ?? null,
    weeklyGoalSessions: null,
    sessionsThisWeek: 0,
    streakDays: 0,
    ...overrides,
  };
}

describe("orderedLessons", () => {
  it("sorts by order without mutating the course", () => {
    expect(orderedLessons(courses[0]).map((item) => item.id)).toEqual(["l1", "l2"]);
    expect(courses[0].lessons.map((item) => item.id)).toEqual(["l2", "l1"]);
  });
});

describe("findNextLesson", () => {
  it("returns the first lesson of the first stage for a new user", () => {
    expect(findNextLesson(path, courses, progressWith([]))?.lesson.id).toBe("l1");
  });

  it("walks stage then course then lesson order", () => {
    expect(findNextLesson(path, courses, progressWith(["l1"]))?.lesson.id).toBe("l2");
    expect(findNextLesson(path, courses, progressWith(["l1", "l2"]))?.lesson.id).toBe("l3");
  });

  it("returns null once everything is complete", () => {
    expect(findNextLesson(path, courses, progressWith(["l1", "l2", "l3", "l4"]))).toBeNull();
  });
});

describe("findLastFreeLesson", () => {
  it("returns the last free lesson in path order", () => {
    expect(findLastFreeLesson(path, courses)?.lesson.id).toBe("l3");
  });
});

describe("deriveStageProgress", () => {
  it("marks the first stage up next for a new user and locks the rest", () => {
    const result = deriveStageProgress(path, courses, progressWith([]));
    expect(result.stages.map((stage) => stage.state)).toEqual(["up_next", "locked"]);
    expect(result.allComplete).toBe(false);
  });

  it("marks a partly done stage in progress", () => {
    const result = deriveStageProgress(path, courses, progressWith(["l1"]));
    expect(result.stages[0]).toMatchObject({ state: "in_progress", completed: 1, total: 2 });
    expect(result.stages[0].ratio).toBe(0.5);
  });

  it("never reports more than one open stage", () => {
    const result = deriveStageProgress(path, courses, progressWith(["l1", "l3"]));
    const open = result.stages.filter((stage) => stage.state !== "done" && stage.state !== "locked");
    expect(open).toHaveLength(1);
    expect(open[0].stageId).toBe("s1");
  });

  it("reports done stages and overall completion", () => {
    const result = deriveStageProgress(path, courses, progressWith(["l1", "l2", "l3", "l4"]));
    expect(result.stages.map((stage) => stage.state)).toEqual(["done", "done"]);
    expect(result).toMatchObject({ completed: 4, total: 4, allComplete: true });
  });

  it("returns stages in order regardless of how the path lists them", () => {
    const result = deriveStageProgress(path, courses, progressWith([]));
    expect(result.stages.map((stage) => stage.stageId)).toEqual(["s1", "s2"]);
  });
});

describe("courseProgress", () => {
  it("counts only lessons of that course", () => {
    expect(courseProgress(courses[0], progressWith(["l1", "l3"]))).toEqual({
      completed: 1,
      total: 2,
      ratio: 0.5,
    });
  });
});

describe("isFirstRun", () => {
  it("is true only with no completions and no last lesson", () => {
    expect(isFirstRun(progressWith([]))).toBe(true);
    expect(isFirstRun(progressWith(["l1"]))).toBe(false);
  });
});

describe("weeklyGoalState", () => {
  it("is first run until a goal is set", () => {
    expect(weeklyGoalState(progressWith([])).kind).toBe("first_run");
  });

  it("tracks progress towards the goal", () => {
    const state = weeklyGoalState(
      progressWith([], { weeklyGoalSessions: 3, sessionsThisWeek: 2, streakDays: 4 }),
    );
    expect(state).toEqual({ kind: "in_progress", done: 2, goal: 3, streak: 4 });
  });

  it("reports met when the goal is reached or passed", () => {
    expect(
      weeklyGoalState(progressWith([], { weeklyGoalSessions: 3, sessionsThisWeek: 3 })).kind,
    ).toBe("met");
    expect(
      weeklyGoalState(progressWith([], { weeklyGoalSessions: 3, sessionsThisWeek: 4 })).kind,
    ).toBe("met");
  });
});

describe("readinessSummary", () => {
  const items = [
    { id: "resume", label: "Resume", done: true },
    { id: "github", label: "GitHub", done: false },
    { id: "linkedin", label: "LinkedIn", done: false },
  ];

  it("picks the first incomplete item", () => {
    expect(readinessSummary(items)).toMatchObject({ done: 1, total: 3, allDone: false });
    expect(readinessSummary(items).next?.id).toBe("github");
  });

  it("reports allDone with no next item", () => {
    const all = items.map((item) => ({ ...item, done: true }));
    expect(readinessSummary(all)).toMatchObject({ next: null, allDone: true });
  });

  it("is not allDone when there are no items at all", () => {
    expect(readinessSummary([])).toMatchObject({ next: null, allDone: false });
  });
});
