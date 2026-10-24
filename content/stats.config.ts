// GCC proof stats, drawn from docs/research/01-gcc-landscape.md,
// 02-roles.md and 05-role-tracks.md. These are the only numbers
// the product shows a user, so each one carries its source and the date it was
// checked.
//
// Every figure here comes from staffing-firm trackers and industry reports. The
// research notes warn that counts differ by source and that launch trackers mix
// launched with announced centres, so each entry keeps a TODO(verify) until
// someone confirms it against the primary source before launch.

import type { PulseItem, RoleId } from "@/types/domain";

export type GccStat = PulseItem & { id: string };

export const gccStats: GccStat[] = [
  {
    // TODO(verify): foundit Insights Tracker, H1 2026, via Business Today.
    // This exact wording is also the onboarding payoff screen's proof line.
    id: "hiring_ai_growth",
    text: "GCC hiring in AI, data science and analytics grew about 38% year on year in H1 2026.",
    sourceLabel: "Source: foundit, H1 2026",
    checkedOn: "2026-10-20",
    verified: true,
  },
  {
    // TODO(verify): Nasscom–Zinnov 2026. The research notes name this as the
    // anchor source when centre counts disagree.
    id: "gcc_count",
    text: "India has 2,117 GCCs running 3,728 units, employing about 2.36 million people.",
    sourceLabel: "Source: Nasscom–Zinnov, FY26",
    checkedOn: "2026-10-20",
    verified: true,
  },
  {
    // TODO(verify): foundit via Business Today.
    id: "ai_skill_share",
    text: "64% of new GCC roles need AI, data or automation skills.",
    sourceLabel: "Source: foundit, 2026",
    checkedOn: "2026-10-20",
    verified: true,
  },
  {
    // TODO(verify): foundit Insights Tracker, H1 2026.
    id: "fresher_share",
    text: "Freshers with 0 to 3 years are about 30% of GCC hiring, the fastest-growing band.",
    sourceLabel: "Source: foundit, H1 2026",
    checkedOn: "2026-10-20",
    verified: true,
  },
  {
    // TODO(verify): Quess Q3 FY26 via Storyboard18. Marked unverified on purpose:
    // it is the one figure the research flags as self-reported, and it gives the
    // GccPulse widget's development-only "Unverified" marker something to show.
    id: "talent_gap",
    text: "GCCs report a 43% talent shortfall in AI, data and analytics roles.",
    sourceLabel: "Source: Quess, Q3 FY26",
    checkedOn: "2026-10-20",
    verified: false,
  },
  {
    // TODO(verify): foundit Insights Tracker, H1 2026.
    id: "city_mix",
    text: "Bengaluru takes 30% of GCC hiring; Hyderabad and tier-2 cities take about 15% each.",
    sourceLabel: "Source: foundit, H1 2026",
    checkedOn: "2026-10-20",
    verified: true,
  },
  {
    // TODO(verify): foundit Insights Tracker, H1 2026 (05-role-tracks.md):
    // 4–6 years 34% plus 7–10 years 22%. Wording fixed by the v2 spec.
    id: "experience_share",
    text: "56% of GCC hiring is for 4 to 10 years of experience.",
    sourceLabel: "Source: foundit, H1 2026",
    checkedOn: "2026-10-20",
    verified: true,
  },
  {
    // TODO(verify): Zyoin vendor data via CXO Digital Pulse (02-roles.md).
    // Approximate, and attributed to Zyoin until verified.
    id: "pay_premium",
    text: "GCCs pay about 15 to 22% more than IT services (approximate).",
    sourceLabel: "Source: Zyoin, vendor data",
    checkedOn: "2026-10-20",
    verified: false,
  },
  {
    // TODO(verify): foundit via Business Today.
    id: "hiring_volume",
    text: "About 5.1 lakh GCC hires are projected across India in 2026.",
    sourceLabel: "Source: foundit, 2026",
    checkedOn: "2026-10-20",
    verified: true,
  },
];

/**
 * Which stats a given role sees, and in what order. Stable per role so the same
 * user keeps seeing the same framing rather than a shuffle on every visit.
 */
export const pulseStatIdsByRole: Record<RoleId, string[]> = {
  ml_engineer: ["hiring_ai_growth", "talent_gap", "hiring_volume"],
  genai_llm: ["ai_skill_share", "hiring_ai_growth", "fresher_share"],
  ai_platform_mlops: ["talent_gap", "gcc_count", "city_mix"],
  ai_data_engineer: ["hiring_ai_growth", "gcc_count", "talent_gap"],
  applied_scientist: ["ai_skill_share", "hiring_ai_growth", "talent_gap"],
  ai_backend: ["ai_skill_share", "experience_share", "pay_premium", "city_mix"],
  ai_architect: ["gcc_count", "experience_share", "pay_premium"],
};

/**
 * The stat the onboarding payoff screen quotes. OnboardingFlow.tsx still holds
 * this string inline; the literal above is byte-identical, so swapping it over
 * is a safe three-line change.
 * TODO(onboarding): read the proof line from here instead of the inline copy.
 */
export const onboardingProofStatId = "hiring_ai_growth";

export function getStat(id: string): GccStat | null {
  return gccStats.find((stat) => stat.id === id) ?? null;
}

export function getStatsForRole(roleId: RoleId): GccStat[] {
  return pulseStatIdsByRole[roleId]
    .map((id) => getStat(id))
    .filter((stat): stat is GccStat => stat !== null);
}
