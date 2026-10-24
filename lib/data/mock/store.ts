// Request-scoped state for the mock data layer: dev flags, the user's onboarding
// answers, and the progress cookie, so a rating or a finished item survives a
// page load without a database.
//
// TODO(persistence): progress is a cookie (prepclever-progress), compactly
// encoded by lib/progress-codec.ts. It moves to the database next.

import { cookies } from "next/headers";
import { parseOnboardingCookie } from "@/components/auth/onboarding/migrate";
import type { OnboardingState } from "@/components/auth/onboarding/types";
import { allChecklistItemIds } from "@/content/checklists.config";
import { concepts } from "@/content/concepts";
import { DEV_COOKIE, parseDevFlags, serializeDevFlags, type DevFlags, type WidgetKey } from "@/lib/dev-flags";
import { resolveBlocks } from "@/lib/journey";
import { conceptKey, itemKey } from "@/lib/progress";
import { decodeProgress, encodeProgress, type CodecSpace } from "@/lib/progress-codec";
import { defaultRoleForTrack, deriveTrack } from "@/lib/tracks";
import type { Plan, Progress, UserProfile } from "@/types/domain";
import { allLessons } from "./lessons.mock";
import { seedProgress } from "./scenarios";

const ONBOARDING_COOKIE = "prepclever-onboarding";
export const PROGRESS_COOKIE = "prepclever-progress";
const MAX_AGE = 60 * 60 * 24 * 90;

/**
 * Item keys as they were when the progress cookie format shipped. Cookies store
 * indexes into this list, so it must never be reordered or shortened: removed
 * items stay here (unused), and new ones go in ITEM_KEYS_ADDED.
 */
export const ITEM_KEYS_V1: string[] = [
  ...["landscape", "your-role", "target-companies"].map((slug) => itemKey("market", slug)),
  ...["skill-audit", "gap-report"].map((slug) => itemKey("gap-analysis", slug)),
  ...["concept-map", "track-plan"].map((slug) => itemKey("upskilling", slug)),
  ...["resume", "linkedin", "github", "resume-evaluate"].map((slug) => itemKey("positioning", slug)),
  ...["where-to-apply", "referral-outreach", "application-tracker"].map((slug) => itemKey("referrals", slug)),
  // Retired in the Block 6 rewrite; kept so later indexes do not move.
  ...["interview-loop", "prep-by-round", "star-stories", "interview-pillars"].map((slug) => itemKey("interviews", slug)),
  ...concepts.map((concept) => conceptKey(concept.id)),
];

/** Keys added after v1, appended in the order they were introduced. */
const ITEM_KEYS_ADDED: string[] = ["interview-process", "interview-companies", "dos-and-donts"].map((slug) =>
  itemKey("interviews", slug),
);

/** The catalogues the progress cookie indexes into. Append-only. */
export const codecSpace: CodecSpace = {
  conceptIds: concepts.map((concept) => concept.id),
  lessonIds: allLessons.map((lesson) => lesson.id),
  checklistIds: allChecklistItemIds,
  itemKeys: [...ITEM_KEYS_V1, ...ITEM_KEYS_ADDED],
};

/** Every current block item must have a cookie index (tested). */
export function missingItemKeys(): string[] {
  const known = new Set(codecSpace.itemKeys);
  return resolveBlocks()
    .flatMap((block) => block.items.map((item) => itemKey(block.slug, item.slug)))
    .filter((key) => !known.has(key));
}

export async function readDevFlags(): Promise<DevFlags> {
  const store = await cookies();
  return parseDevFlags(store.get(DEV_COOKIE)?.value);
}

/** Mock billing only: production ignores the dev cookie, so this cannot grant Pro there. */
export async function writePlan(plan: Plan) {
  const store = await cookies();
  const flags = parseDevFlags(store.get(DEV_COOKIE)?.value);
  store.set(DEV_COOKIE, serializeDevFlags({ ...flags, plan }), { sameSite: "lax", maxAge: MAX_AGE, path: "/" });
}

/** The user's onboarding answers, migrated to today's ids, read-only. */
export async function readOnboarding(): Promise<OnboardingState> {
  const store = await cookies();
  return parseOnboardingCookie(store.get(ONBOARDING_COOKIE)?.value);
}

export async function readProfile(): Promise<UserProfile> {
  const state = await readOnboarding();
  const situation = state.situation ?? "student";
  const track = deriveTrack(situation, state.yearsBand);
  return { roleId: state.roleId ?? defaultRoleForTrack(track), track, situation, yearsBand: state.yearsBand };
}

/**
 * The scenario seed until the user changes something; after that, the cookie.
 * Progress saved under a different dev scenario is ignored, so switching
 * scenarios in development always shows that scenario.
 */
export async function readProgress(flags: DevFlags): Promise<Progress> {
  const [{ roleId }, store] = await Promise.all([readProfile(), cookies()]);
  const seed = seedProgress(flags.scenario, roleId);
  const stored = decodeProgress(store.get(PROGRESS_COOKIE)?.value, codecSpace);
  if (!stored || stored.scenario !== flags.scenario) return seed;
  return { ...seed, ...stored.progress };
}

export async function writeProgress(flags: DevFlags, progress: Progress) {
  const store = await cookies();
  store.set(PROGRESS_COOKIE, encodeProgress(progress, flags.scenario, codecSpace), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
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
