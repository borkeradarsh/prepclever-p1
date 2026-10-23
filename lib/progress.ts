// Every derivation the dashboard needs, as pure functions over plain data.
// Widgets render these results; they never recompute them.

import type {
  Course,
  LessonRef,
  Path,
  PathProgress,
  Progress,
  ReadinessItem,
  StageProgress,
  StageState,
} from "@/types/domain";

export function orderedLessons(course: Course) {
  return [...course.lessons].sort((a, b) => a.order - b.order);
}

function orderedStages(path: Path) {
  return [...path.stages].sort((a, b) => a.order - b.order);
}

/** Courses of a stage, in the order the stage lists them. */
function stageCourses(stageCourseIds: string[], courses: Course[]) {
  const byId = new Map(courses.map((course) => [course.id, course]));
  return stageCourseIds
    .map((id) => byId.get(id))
    .filter((course): course is Course => Boolean(course));
}

export function courseProgress(course: Course, progress: Progress) {
  const done = new Set(progress.completedLessonIds);
  const total = course.lessons.length;
  const completed = course.lessons.filter((lesson) => done.has(lesson.id)).length;
  return { completed, total, ratio: total === 0 ? 0 : completed / total };
}

export function isLessonComplete(lessonId: string, progress: Progress) {
  return progress.completedLessonIds.includes(lessonId);
}

export function deriveStageProgress(
  path: Path,
  courses: Course[],
  progress: Progress,
): PathProgress {
  const done = new Set(progress.completedLessonIds);
  let seenUnfinished = false;

  const stages: StageProgress[] = orderedStages(path).map((stage) => {
    const lessons = stageCourses(stage.courseIds, courses).flatMap((course) => course.lessons);
    const total = lessons.length;
    const completed = lessons.filter((lesson) => done.has(lesson.id)).length;
    const isDone = total > 0 && completed === total;

    let state: StageState;
    if (isDone) {
      state = "done";
    } else if (seenUnfinished) {
      // An earlier stage is still open, so this one is not reachable yet.
      state = "locked";
    } else {
      seenUnfinished = true;
      state = completed > 0 ? "in_progress" : "up_next";
    }

    return { stageId: stage.id, state, completed, total, ratio: total === 0 ? 0 : completed / total };
  });

  const total = stages.reduce((sum, stage) => sum + stage.total, 0);
  const completed = stages.reduce((sum, stage) => sum + stage.completed, 0);

  return { stages, total, completed, allComplete: total > 0 && completed === total };
}

/**
 * The first lesson the user has not completed, in stage then course then lesson
 * order. Null when the whole path is done.
 */
export function findNextLesson(
  path: Path,
  courses: Course[],
  progress: Progress,
): LessonRef | null {
  const done = new Set(progress.completedLessonIds);

  for (const stage of orderedStages(path)) {
    for (const course of stageCourses(stage.courseIds, courses)) {
      for (const lesson of orderedLessons(course)) {
        if (!done.has(lesson.id)) return { course, lesson };
      }
    }
  }

  return null;
}

/** The last free lesson the user can open, for the locked card's fallback link. */
export function findLastFreeLesson(path: Path, courses: Course[]): LessonRef | null {
  let found: LessonRef | null = null;

  for (const stage of orderedStages(path)) {
    for (const course of stageCourses(stage.courseIds, courses)) {
      for (const lesson of orderedLessons(course)) {
        if (lesson.access === "free") found = { course, lesson };
      }
    }
  }

  return found;
}

export function isFirstRun(progress: Progress) {
  return progress.completedLessonIds.length === 0 && progress.lastLessonId === null;
}

export type WeeklyGoalKind = "first_run" | "in_progress" | "met";

export function weeklyGoalState(progress: Progress) {
  const goal = progress.weeklyGoalSessions;
  const done = progress.sessionsThisWeek;
  const kind: WeeklyGoalKind = goal === null ? "first_run" : done >= goal ? "met" : "in_progress";
  return { kind, done, goal, streak: progress.streakDays };
}

export function readinessSummary(items: ReadinessItem[]) {
  const total = items.length;
  const doneItems = items.filter((item) => item.done);
  return {
    next: items.find((item) => !item.done) ?? null,
    done: doneItems.length,
    total,
    allDone: total > 0 && doneItems.length === total,
  };
}
