// Experience tracks (docs/research/05-role-tracks.md, docs/dashboard-v2-spec.md
// section 3). Labels and defaults live here; the derivation is lib/tracks.ts.

import type { RoleId, Situation, Track } from "@/types/domain";

/** The fewest years a track implies, used by the role-fit rule. */
export const trackLowerBound: Record<Track, number> = {
  fresher: 0,
  switcher: 2,
  mid: 6,
  senior: 10,
};

/**
 * ASSUMPTION (spec section 3): the role a track starts on. Drives the
 * "Popular for you" badge and what "Not sure yet" resolves to.
 */
export const defaultRoleByTrack: Record<Track, RoleId> = {
  fresher: "ml_engineer",
  switcher: "ai_backend",
  mid: "genai_llm",
  senior: "ai_architect",
};

export const trackLabels: Record<Track, string> = {
  fresher: "Fresher",
  switcher: "Service switcher",
  mid: "Mid",
  senior: "Senior",
};

/** The switcher track reads differently for someone already at a product company. */
export const trackLabelOverrides: Partial<Record<Situation, Partial<Record<Track, string>>>> = {
  product_tech: { switcher: "Early career" },
};

/**
 * Situations the research base does not cover. The track still resolves (to
 * fresher) but anything built on 05-role-tracks.md should say so.
 * TODO(research): cover career switchers from non-technical backgrounds.
 */
export const situationsOutsideResearch: Situation[] = ["non_tech"];
