// Mock implementations of the lib/data contract. Each read applies the dev
// flags (latency, forced failure), then composes the configs, the concept map
// and the user's progress. Each write updates the progress cookie and returns
// the new Progress.

import { checklists } from "@/content/checklists.config";
import { companies } from "@/content/companies.data";
import { getConceptById, getDomain } from "@/content/concepts";
import { resources } from "@/content/resources.data";
import { getRoleById, roles } from "@/content/roles.config";
import { getStatsForRole } from "@/content/stats.config";
import { canAccess } from "@/lib/access";
import { buildBlockItemView, buildBlockViews, nextRecommended, resolveBlocks } from "@/lib/journey";
import { conceptKey } from "@/lib/progress";
import { buildGapReport, buildSyllabus, optionalPrerequisites } from "@/lib/syllabus";
import { getFirstName } from "@/lib/user/profile";
import type {
  BlockItemView,
  BlockView,
  Checklist,
  Company,
  ConceptView,
  GapReport,
  Lesson,
  LessonBody,
  LessonRef,
  NextRecommended,
  Plan,
  Progress,
  PulseItem,
  Rating,
  Resource,
  Role,
  RoleId,
  RoleSyllabus,
  User,
  UserProfile,
} from "@/types/domain";
import type { DevFlags } from "@/lib/dev-flags";
import { buildLessonBody, buildLessons } from "./lessons.mock";
import {
  codecSpace,
  latency,
  maybeFail,
  readDevFlags,
  readOnboarding,
  readProfile,
  readProgress,
  writePlan,
  writeProgress,
} from "./store";

const blocks = resolveBlocks();

/** Flags, profile and progress together, with no latency: used by the functions below. */
async function loadContext() {
  const flags = await readDevFlags();
  const [profile, progress] = await Promise.all([readProfile(), readProgress(flags)]);
  return { flags, profile, progress };
}

async function updateProgress(change: (progress: Progress) => Progress): Promise<Progress> {
  const { flags, progress } = await loadContext();
  const next = change(progress);
  await writeProgress(flags, next);
  return next;
}

function syllabusFor(roleId: RoleId, progress: Progress) {
  return buildSyllabus(roleId, progress.auditRatings);
}

async function begin(widget: Parameters<typeof maybeFail>[1]): Promise<DevFlags> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, widget);
  return flags;
}

// Reads

export async function getUser(): Promise<User> {
  const flags = await begin("user");
  return { id: "mock-user", firstName: await getFirstName(), plan: flags.plan };
}

export async function getProfile(): Promise<UserProfile> {
  await begin("user");
  return readProfile();
}

/** No latency or forced failure: /start must always be able to route someone. */
export async function getOnboardingComplete(): Promise<boolean> {
  return (await readOnboarding()).currentStep === "done";
}

export async function getProgress(): Promise<Progress> {
  await begin("goal");
  return (await loadContext()).progress;
}

export async function getRoles(): Promise<Role[]> {
  await begin("user");
  return roles;
}

export async function getRole(roleId: RoleId): Promise<Role | null> {
  await begin("user");
  return roles.find((role) => role.id === roleId) ?? null;
}

export async function getBlocks(): Promise<BlockView[]> {
  await begin("journey");
  const { flags, profile, progress } = await loadContext();
  return buildBlockViews(blocks, flags.plan, progress, syllabusFor(profile.roleId, progress).order);
}

export async function getBlock(slug: string): Promise<BlockView | null> {
  return (await getBlocks()).find((block) => block.slug === slug) ?? null;
}

export async function getBlockItem(blockSlug: string, itemSlug: string): Promise<BlockItemView | null> {
  await begin("journey");
  const { flags, profile, progress } = await loadContext();
  const views = buildBlockViews(blocks, flags.plan, progress, syllabusFor(profile.roleId, progress).order);
  return buildBlockItemView(views, blockSlug, itemSlug, flags.plan, progress);
}

/** The user's role syllabus: domains, and concepts in learning order. */
export async function getRoleSyllabus(): Promise<RoleSyllabus> {
  await begin("syllabus");
  const { profile, progress } = await loadContext();
  return syllabusFor(profile.roleId, progress);
}

/**
 * A concept with its free preview and lesson titles. Lesson bodies are never
 * part of this: they come only from getLessonBody, after the access check.
 */
export async function getConcept(domainId: string, conceptId: string): Promise<ConceptView | null> {
  const flags = await begin("concept");
  const concept = getConceptById(conceptId);
  const domain = getDomain(domainId);
  if (!concept || !domain || concept.domain !== domain.id) return null;

  const { profile, progress } = await loadContext();
  const lessons = buildLessons(concept);
  return {
    concept,
    domain,
    level: concept.levels[profile.roleId],
    rating: progress.auditRatings[concept.id] ?? "not_started",
    prerequisites: concept.prerequisites
      .map((id) => getConceptById(id))
      .filter((item) => item !== null)
      .map((item) => ({ id: item.id, title: item.title, domain: item.domain, level: item.levels[profile.roleId] })),
    optionalPrerequisites: optionalPrerequisites(concept, profile.roleId),
    lessons,
    locked: lessons.some((lesson) => !canAccess({ plan: flags.plan }, lesson)),
  };
}

export async function getLesson(conceptId: string, lessonSlug: string): Promise<LessonRef | null> {
  await begin("concept");
  const concept = getConceptById(conceptId);
  const lesson = concept ? buildLessons(concept).find((item) => item.slug === lessonSlug) : undefined;
  return concept && lesson ? { concept, lesson } : null;
}

export async function getLessonNeighbours(
  conceptId: string,
  lessonSlug: string,
): Promise<{ previous: Lesson | null; next: Lesson | null }> {
  const concept = getConceptById(conceptId);
  if (!concept) return { previous: null, next: null };
  const lessons = buildLessons(concept);
  const index = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (index === -1) return { previous: null, next: null };
  return { previous: lessons[index - 1] ?? null, next: lessons[index + 1] ?? null };
}

/** The lesson body, or null when the user may not open it. Enforces access itself. */
export async function getLessonBody(conceptId: string, lessonSlug: string): Promise<LessonBody | null> {
  const flags = await begin("concept");
  const concept = getConceptById(conceptId);
  const lesson = concept ? buildLessons(concept).find((item) => item.slug === lessonSlug) : undefined;
  if (!concept || !lesson || !canAccess({ plan: flags.plan }, lesson)) return null;
  return buildLessonBody(concept, lesson);
}

export async function getGapReport(): Promise<GapReport> {
  await begin("gap");
  const { profile, progress } = await loadContext();
  return buildGapReport(syllabusFor(profile.roleId, progress), progress.auditRatings);
}

export async function getNextRecommended(): Promise<NextRecommended | null> {
  await begin("continue");
  const { flags, profile, progress } = await loadContext();
  return nextRecommended({
    blocks,
    progress,
    plan: flags.plan,
    learningOrder: syllabusFor(profile.roleId, progress).order,
    ratings: progress.auditRatings,
  });
}

export async function getChecklists(): Promise<Checklist[]> {
  await begin("readiness");
  return checklists;
}

export async function getCompanies(): Promise<Company[]> {
  await begin("journey");
  return companies;
}

export async function getResources(): Promise<Resource[]> {
  await begin("journey");
  return resources;
}

export async function getPulse(roleId: RoleId): Promise<PulseItem[]> {
  await begin("pulse");
  return getStatsForRole(roleId);
}

// Writes. Each one records what was touched last, for the Continue card.

export async function setRating(conceptId: string, rating: Rating): Promise<Progress> {
  if (!getConceptById(conceptId)) throw new Error(`Unknown concept ${conceptId}`);
  return updateProgress((progress) => ({
    ...progress,
    auditRatings: { ...progress.auditRatings, [conceptId]: rating },
  }));
}

export async function toggleChecklistItem(itemId: string): Promise<Progress> {
  if (!codecSpace.checklistIds.includes(itemId)) throw new Error(`Unknown checklist item ${itemId}`);
  return updateProgress((progress) => ({
    ...progress,
    checklistDone: progress.checklistDone.includes(itemId)
      ? progress.checklistDone.filter((id) => id !== itemId)
      : [...progress.checklistDone, itemId],
  }));
}

/** `key` is `block/item` or `concept:<id>` (lib/progress.ts itemKey, conceptKey). */
export async function markItemDone(key: string, done = true): Promise<Progress> {
  if (!codecSpace.itemKeys.includes(key)) throw new Error(`Unknown item ${key}`);
  return updateProgress((progress) => ({
    ...progress,
    doneItems: done
      ? [...new Set([...progress.doneItems, key])]
      : progress.doneItems.filter((existing) => existing !== key),
    lastItem: key,
  }));
}

/** Completing a concept's last lesson also marks the concept done, for Block 3's progress. */
export async function markLessonComplete(lessonId: string): Promise<Progress> {
  if (!codecSpace.lessonIds.includes(lessonId)) throw new Error(`Unknown lesson ${lessonId}`);
  const conceptId = lessonId.replace(/-(l\d+|project)$/, "");
  const concept = getConceptById(conceptId);
  return updateProgress((progress) => {
    const completedLessonIds = [...new Set([...progress.completedLessonIds, lessonId])];
    const conceptDone = concept
      ? buildLessons(concept).every((lesson) => completedLessonIds.includes(lesson.id))
      : false;
    return {
      ...progress,
      completedLessonIds,
      doneItems: conceptDone ? [...new Set([...progress.doneItems, conceptKey(conceptId)])] : progress.doneItems,
      lastItem: conceptKey(conceptId),
    };
  });
}

export async function setWeeklyGoal(sessions: number): Promise<Progress> {
  return updateProgress((progress) => ({ ...progress, weeklyGoalSessions: sessions }));
}

/** Mock billing only (lib/billing.ts). */
export async function setPlan(plan: Plan): Promise<void> {
  await writePlan(plan);
}

/** For the shell's role chip without a second lookup. */
export function roleTitle(roleId: RoleId): string {
  return getRoleById(roleId).title;
}
