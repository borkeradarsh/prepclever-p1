// The four acceptance scenarios from the build spec, as Progress seeds. Pure: no
// cookies, no latency, so they can be unit tested directly.

import { orderedLessons } from "@/lib/progress";
import type { Course, Path, Progress } from "@/types/domain";
import type { Scenario } from "@/lib/dev-flags";

/** Lessons of a path in the order a user would work through them. */
function lessonsInPathOrder(path: Path, courses: Course[]) {
  const byId = new Map(courses.map((course) => [course.id, course]));
  return [...path.stages]
    .sort((a, b) => a.order - b.order)
    .flatMap((stage) =>
      stage.courseIds
        .map((id) => byId.get(id))
        .filter((course): course is Course => Boolean(course))
        .flatMap((course) => orderedLessons(course)),
    );
}

function emptyProgress(): Progress {
  return {
    completedLessonIds: [],
    lastLessonId: null,
    weeklyGoalSessions: null,
    sessionsThisWeek: 0,
    streakDays: 0,
  };
}

export const scenarioSeeds: Record<Scenario, (path: Path, courses: Course[]) => Progress> = {
  "first-run": () => emptyProgress(),

  /**
   * Three lessons in. Course one has a free lesson 1 and paid lessons after it,
   * so the next lesson is paid: on a free plan this is the locked Continue state,
   * on Pro it is the ordinary one. Both cases come from the same seed.
   */
  "in-progress": (path, courses) => {
    const done = lessonsInPathOrder(path, courses).slice(0, 3);
    return {
      completedLessonIds: done.map((lesson) => lesson.id),
      lastLessonId: done.at(-1)?.id ?? null,
      weeklyGoalSessions: 3,
      sessionsThisWeek: 2,
      streakDays: 4,
    };
  },

  complete: (path, courses) => {
    const all = lessonsInPathOrder(path, courses);
    return {
      completedLessonIds: all.map((lesson) => lesson.id),
      lastLessonId: all.at(-1)?.id ?? null,
      weeklyGoalSessions: 3,
      sessionsThisWeek: 3,
      streakDays: 11,
    };
  },
};

export function seedProgress(scenario: Scenario, path: Path, courses: Course[]): Progress {
  return scenarioSeeds[scenario](path, courses);
}
