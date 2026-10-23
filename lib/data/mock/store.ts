// Request-scoped state for the mock data layer: dev flags, the user's onboarding
// answers, and a small progress delta so a goal or a completed lesson survives a
// page load without a database.
//
// TODO(persistence): the progress delta is a cookie, so it must stay small. Only
// the delta is stored, never the scenario seed. Replace with a real store before
// progress means anything.

import { cookies } from "next/headers";
import { emptyOnboardingState, type OnboardingState } from "@/components/auth/onboarding/types";
import { getDefaultRole } from "@/components/auth/onboarding/config";
import { DEV_COOKIE, parseDevFlags, type DevFlags, type WidgetKey } from "@/lib/dev-flags";
import type { Progress, RoleId, Situation } from "@/types/domain";

const ONBOARDING_COOKIE = "prepclever-onboarding";
export const PROGRESS_COOKIE = "prepclever-progress";
const PROGRESS_MAX_AGE = 60 * 60 * 24 * 90;

export type ProgressDelta = {
  addedLessonIds: string[];
  weeklyGoalSessions: number | null;
};

const emptyDelta = (): ProgressDelta => ({ addedLessonIds: [], weeklyGoalSessions: null });

export async function readDevFlags(): Promise<DevFlags> {
  const store = await cookies();
  return parseDevFlags(store.get(DEV_COOKIE)?.value);
}

/** The user's real onboarding answers, read-only. Falls back to sane defaults. */
export async function readOnboarding(): Promise<OnboardingState> {
  const store = await cookies();
  const raw = store.get(ONBOARDING_COOKIE)?.value;
  if (!raw) return emptyOnboardingState();
  try {
    return JSON.parse(decodeURIComponent(raw)) as OnboardingState;
  } catch {
    return emptyOnboardingState();
  }
}

export async function readTarget(): Promise<{ roleId: RoleId; situation: Situation }> {
  const state = await readOnboarding();
  const situation: Situation = state.situation ?? "student";
  return { roleId: state.roleId ?? getDefaultRole(situation), situation };
}

export async function readProgressDelta(): Promise<ProgressDelta> {
  const store = await cookies();
  const raw = store.get(PROGRESS_COOKIE)?.value;
  if (!raw) return emptyDelta();
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ProgressDelta>;
    return {
      addedLessonIds: Array.isArray(parsed.addedLessonIds) ? parsed.addedLessonIds : [],
      weeklyGoalSessions:
        typeof parsed.weeklyGoalSessions === "number" ? parsed.weeklyGoalSessions : null,
    };
  } catch {
    return emptyDelta();
  }
}

export async function writeProgressDelta(delta: ProgressDelta) {
  const store = await cookies();
  store.set(PROGRESS_COOKIE, encodeURIComponent(JSON.stringify(delta)), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: PROGRESS_MAX_AGE,
    path: "/",
  });
}

/** Applies the stored delta over a scenario seed. */
export function applyDelta(seed: Progress, delta: ProgressDelta): Progress {
  const completedLessonIds = [...new Set([...seed.completedLessonIds, ...delta.addedLessonIds])];
  return {
    ...seed,
    completedLessonIds,
    lastLessonId: delta.addedLessonIds.at(-1) ?? seed.lastLessonId,
    weeklyGoalSessions: delta.weeklyGoalSessions ?? seed.weeklyGoalSessions,
  };
}

/** Mock network delay, so loading states are reachable in development. */
export async function latency(flags: DevFlags) {
  const ms = flags.slow ? 2000 : 200 + Math.round(Math.random() * 300);
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/** Forced failure, so error states are reachable in development. */
export function maybeFail(flags: DevFlags, widget: WidgetKey) {
  if (flags.fail.includes(widget)) {
    throw new Error(`Mock failure for widget "${widget}" (dev flag).`);
  }
}
