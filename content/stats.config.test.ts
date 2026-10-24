// These stats are the only figures the product quotes to a user, so the shape
// rules are enforced rather than trusted.

import { describe, expect, it } from "vitest";
import {
  gccStats,
  getStat,
  getStatsForRole,
  onboardingProofStatId,
  pulseStatIdsByRole,
} from "@/content/stats.config";
import { roles } from "@/content/roles.config";

describe("gccStats", () => {
  it("has unique ids", () => {
    const ids = gccStats.map((stat) => stat.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every stat a short claim, a source and an ISO date", () => {
    for (const stat of gccStats) {
      expect(stat.text.length).toBeGreaterThan(20);
      expect(stat.text.length).toBeLessThanOrEqual(160);
      expect(stat.sourceLabel).not.toHaveLength(0);
      expect(stat.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(stat.checkedOn))).toBe(false);
      expect(typeof stat.verified).toBe("boolean");
    }
  });

  it("keeps at least one unverified stat, so the dev-only marker is exercised", () => {
    expect(gccStats.some((stat) => !stat.verified)).toBe(true);
  });
});

describe("pulseStatIdsByRole", () => {
  it("covers every onboarding role with real stat ids", () => {
    for (const role of roles) {
      const ids = pulseStatIdsByRole[role.id];
      expect(ids.length).toBeGreaterThan(0);
      for (const id of ids) expect(getStat(id)).not.toBeNull();
      expect(getStatsForRole(role.id)).toHaveLength(ids.length);
    }
  });
});

describe("v2 wording", () => {
  it("words the experience statistic as the spec requires", () => {
    expect(getStat("experience_share")?.text).toBe("56% of GCC hiring is for 4 to 10 years of experience.");
  });

  it("keeps the Zyoin pay premium approximate and unverified", () => {
    expect(getStat("pay_premium")).toMatchObject({ verified: false, sourceLabel: expect.stringContaining("Zyoin") });
    expect(getStat("pay_premium")?.text).toContain("approximate");
  });
});

describe("onboardingProofStatId", () => {
  // Locks the string the onboarding payoff screen renders today, so moving that
  // copy out of OnboardingFlow.tsx later cannot change what the user sees.
  it("matches the proof line onboarding currently hardcodes", () => {
    expect(getStat(onboardingProofStatId)).toMatchObject({
      text: "GCC hiring in AI, data science and analytics grew about 38% year on year in H1 2026.",
      sourceLabel: "Source: foundit, H1 2026",
    });
  });
});
