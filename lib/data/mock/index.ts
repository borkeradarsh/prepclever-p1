// Mock implementations of the lib/data contract. Each one reads the dev flags,
// simulates latency, optionally fails on purpose, and then composes the
// catalogue, the scenario seed and the stored delta.

import { getStatsForRole } from "@/content/stats.config";
import { findNextLesson, orderedLessons } from "@/lib/progress";
import { getFirstName } from "@/lib/user/profile";
import type {
  Course,
  Lesson,
  LessonRef,
  Path,
  Progress,
  PulseItem,
  ReadinessItem,
  RoleId,
  User,
} from "@/types/domain";
import { buildCatalogue, buildPath } from "./catalogue.mock";
import { buildReadiness } from "./readiness.mock";
import { seedProgress } from "./scenarios";
import {
  applyDelta,
  latency,
  maybeFail,
  readDevFlags,
  readProgressDelta,
  readTarget,
  writeProgressDelta,
} from "./store";

/** The user's path and courses, with no latency: used by the functions below. */
async function loadCatalogue(): Promise<{ path: Path; courses: Course[] }> {
  const { roleId, situation } = await readTarget();
  return { path: buildPath(roleId, situation), courses: buildCatalogue(roleId).courses };
}

async function loadProgress(): Promise<Progress> {
  const [flags, { path, courses }, delta] = await Promise.all([
    readDevFlags(),
    loadCatalogue(),
    readProgressDelta(),
  ]);
  return applyDelta(seedProgress(flags.scenario, path, courses), delta);
}

export async function getUser(): Promise<User> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "user");
  return { id: "mock-user", firstName: await getFirstName(), plan: flags.plan };
}

export async function getPath(): Promise<Path> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "path");
  return (await loadCatalogue()).path;
}

export async function getCourses(): Promise<Course[]> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "path");
  return (await loadCatalogue()).courses;
}

export async function getCourse(slug: string): Promise<Course | null> {
  const flags = await readDevFlags();
  await latency(flags);
  const { courses } = await loadCatalogue();
  return courses.find((course) => course.slug === slug) ?? null;
}

export async function getLesson(courseSlug: string, lessonSlug: string): Promise<LessonRef | null> {
  const flags = await readDevFlags();
  await latency(flags);
  const { courses } = await loadCatalogue();
  const course = courses.find((item) => item.slug === courseSlug);
  if (!course) return null;
  const lesson = course.lessons.find((item) => item.slug === lessonSlug);
  return lesson ? { course, lesson } : null;
}

export async function getProgress(): Promise<Progress> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "goal");
  return loadProgress();
}

export async function getNextLesson(): Promise<LessonRef | null> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "continue");
  const { path, courses } = await loadCatalogue();
  return findNextLesson(path, courses, await loadProgress());
}

export async function getPulse(roleId: RoleId): Promise<PulseItem[]> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "pulse");
  return getStatsForRole(roleId);
}

export async function getReadiness(): Promise<ReadinessItem[]> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "readiness");
  return buildReadiness(flags.scenario);
}

export async function setWeeklyGoal(sessions: number): Promise<Progress> {
  const delta = await readProgressDelta();
  await writeProgressDelta({ ...delta, weeklyGoalSessions: sessions });
  return loadProgress();
}

export async function markLessonComplete(lessonId: string): Promise<Progress> {
  const delta = await readProgressDelta();
  if (!delta.addedLessonIds.includes(lessonId)) {
    await writeProgressDelta({ ...delta, addedLessonIds: [...delta.addedLessonIds, lessonId] });
  }
  return loadProgress();
}

/** Neighbouring lessons within a course, for the lesson page's prev/next links. */
export async function getLessonNeighbours(
  courseSlug: string,
  lessonSlug: string,
): Promise<{ previous: Lesson | null; next: Lesson | null }> {
  const course = await getCourse(courseSlug);
  if (!course) return { previous: null, next: null };
  const lessons = orderedLessons(course);
  const index = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index === -1) return { previous: null, next: null };
  return { previous: lessons[index - 1] ?? null, next: lessons[index + 1] ?? null };
}
