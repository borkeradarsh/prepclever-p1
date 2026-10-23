// Covers the access rule itself. The catalogue's own invariants (which lessons
// are free) are tested in lib/data/mock/catalogue.test.ts.

import { describe, expect, it } from "vitest";
import { ACCESS_RULES, canAccess, canViewRoadmapDetail } from "@/lib/access";

const free = { plan: "free" as const };
const pro = { plan: "pro" as const };

describe("canAccess", () => {
  it("lets anyone open a free item", () => {
    expect(canAccess(free, { access: "free" })).toBe(true);
    expect(canAccess(pro, { access: "free" })).toBe(true);
  });

  it("keeps a free user out of a paid item", () => {
    expect(canAccess(free, { access: "paid" })).toBe(false);
  });

  it("lets a pro user open a paid item", () => {
    expect(canAccess(pro, { access: "paid" })).toBe(true);
  });
});

describe("canViewRoadmapDetail", () => {
  it("follows the configured rule", () => {
    expect(ACCESS_RULES.roadmapDetail).toBe("paid");
    expect(canViewRoadmapDetail(free)).toBe(false);
    expect(canViewRoadmapDetail(pro)).toBe(true);
  });

  // Acceptance criterion: flipping a rule changes behaviour everywhere with no
  // component edits. Proven here rather than asserted in a comment.
  it("opens roadmap detail to free users when the rule is relaxed", () => {
    const original = ACCESS_RULES.roadmapDetail;
    try {
      ACCESS_RULES.roadmapDetail = "free";
      expect(canViewRoadmapDetail(free)).toBe(true);
    } finally {
      ACCESS_RULES.roadmapDetail = original;
    }
  });
});
