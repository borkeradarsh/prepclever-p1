// Tracks and role fit, as pure functions (docs/dashboard-v2-spec.md section 3).

import {
  defaultRoleByTrack,
  situationsOutsideResearch,
  trackLabelOverrides,
  trackLabels,
  trackLowerBound,
} from "@/content/tracks.config";
import type { Role, RoleFit, RoleId, Situation, Track, YearsBand } from "@/types/domain";

const trackByBand: Record<YearsBand, Track> = {
  "0-1": "fresher",
  "2-5": "switcher",
  "6-10": "mid",
  "10+": "senior",
};

export function deriveTrack(situation: Situation, yearsBand: YearsBand | null): Track {
  if (situation === "student" || situation === "non_tech") return "fresher";
  // A working situation always has a band once onboarding validates it; a
  // missing one is treated as the most junior track rather than guessed upward.
  return yearsBand ? trackByBand[yearsBand] : "fresher";
}

export function trackLabel(track: Track, situation: Situation): string {
  return trackLabelOverrides[situation]?.[track] ?? trackLabels[track];
}

export function defaultRoleForTrack(track: Track): RoleId {
  return defaultRoleByTrack[track];
}

/** False for situations the research does not cover, so the UI can flag them. */
export function isCoveredByResearch(situation: Situation): boolean {
  return !situationsOutsideResearch.includes(situation);
}

export function resolveRole(choice: RoleId | "not_sure", track: Track) {
  return choice === "not_sure"
    ? { roleId: defaultRoleForTrack(track), roleIsDefault: true }
    : { roleId: choice, roleIsDefault: false };
}

/**
 * Compares the track's lower bound with the role's minimum years: on track if
 * it meets it, a stretch if short by two or fewer, otherwise enter through an
 * adjacent role first (Block 1 then shows the role's typical background).
 */
export function roleFit(track: Track, role: Pick<Role, "minYears">): RoleFit {
  const years = trackLowerBound[track];
  if (years >= role.minYears) return "on_track";
  if (role.minYears - years <= 2) return "stretch";
  return "adjacent_first";
}
