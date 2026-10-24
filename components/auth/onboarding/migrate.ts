// Reads a saved onboarding state of any age and returns one in today's shape.
// Pure, so the cookie readers (route handlers, the mock store) and the
// localStorage fallback all migrate the same way.

import {
  emptyOnboardingState,
  ONBOARDING_STEPS,
  ROLE_IDS,
  SITUATIONS,
  YEARS_BANDS,
  type OnboardingState,
  type OnboardingStep,
  type RoleId,
  type Situation,
  type YearsBand,
} from "./types";

/** Year chips before v2: 0-2 and 3-5 were re-cut to 0-1 and 2-5. */
const LEGACY_YEARS: Record<string, YearsBand> = { "0-2": "0-1", "3-5": "2-5" };

/** Role ids before v2, when there were five roles. */
const LEGACY_ROLES: Record<string, RoleId> = {
  ml_mlops: "ml_engineer",
  ai_platform: "ai_platform_mlops",
  ai_data: "ai_data_engineer",
  backend_to_ai: "ai_backend",
};

const oneOf = <T extends string>(values: readonly T[], value: unknown): T | null =>
  typeof value === "string" && (values as readonly string[]).includes(value) ? (value as T) : null;

export function migrateYearsBand(value: unknown): YearsBand | null {
  if (typeof value === "string" && value in LEGACY_YEARS) return LEGACY_YEARS[value];
  return oneOf(YEARS_BANDS, value);
}

export function migrateRoleId(value: unknown): RoleId | null {
  if (typeof value === "string" && value in LEGACY_ROLES) return LEGACY_ROLES[value];
  return oneOf(ROLE_IDS, value);
}

/** Unknown or malformed fields fall back to their empty value rather than throwing. */
export function migrateOnboardingState(raw: unknown): OnboardingState {
  const empty = emptyOnboardingState();
  if (!raw || typeof raw !== "object") return empty;
  const input = raw as Record<string, unknown>;

  const situation: Situation | null = oneOf(SITUATIONS, input.situation);
  const roleId = migrateRoleId(input.roleId);
  return {
    situation,
    yearsBand: migrateYearsBand(input.yearsBand),
    roleId,
    roleIsDefault: roleId !== null && input.roleIsDefault === true,
    currentStep: oneOf<OnboardingStep>(ONBOARDING_STEPS, input.currentStep) ?? empty.currentStep,
    completedAt: typeof input.completedAt === "string" ? input.completedAt : null,
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : empty.updatedAt,
  };
}

/** Parses the `prepclever-onboarding` cookie value (URI-encoded JSON). */
export function parseOnboardingCookie(value: string | null | undefined): OnboardingState {
  if (!value) return emptyOnboardingState();
  try {
    return migrateOnboardingState(JSON.parse(decodeURIComponent(value)));
  } catch {
    return emptyOnboardingState();
  }
}
