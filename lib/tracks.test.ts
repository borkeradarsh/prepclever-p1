import { describe, expect, it } from "vitest";
import { getRoleById, roles } from "@/content/roles.config";
import {
  defaultRoleForTrack,
  deriveTrack,
  isCoveredByResearch,
  resolveRole,
  roleFit,
  trackLabel,
} from "@/lib/tracks";

describe("deriveTrack", () => {
  it("puts students and career switchers on the fresher track", () => {
    expect(deriveTrack("student", null)).toBe("fresher");
    expect(deriveTrack("non_tech", null)).toBe("fresher");
  });

  it.each(["it_services", "product_tech"] as const)("maps every band for %s", (situation) => {
    expect(deriveTrack(situation, "0-1")).toBe("fresher");
    expect(deriveTrack(situation, "2-5")).toBe("switcher");
    expect(deriveTrack(situation, "6-10")).toBe("mid");
    expect(deriveTrack(situation, "10+")).toBe("senior");
  });

  it("treats a working situation with no band as fresher, never guessing upward", () => {
    expect(deriveTrack("it_services", null)).toBe("fresher");
  });

  it("flags non-technical switchers as outside the research", () => {
    expect(isCoveredByResearch("non_tech")).toBe(false);
    expect(isCoveredByResearch("student")).toBe(true);
  });
});

describe("trackLabel", () => {
  it("calls the switcher track Service switcher or Early career by situation", () => {
    expect(trackLabel("switcher", "it_services")).toBe("Service switcher");
    expect(trackLabel("switcher", "product_tech")).toBe("Early career");
    expect(trackLabel("mid", "product_tech")).toBe("Mid");
  });
});

describe("defaults by track", () => {
  it("uses the spec's assumed defaults", () => {
    expect(defaultRoleForTrack("fresher")).toBe("ml_engineer");
    expect(defaultRoleForTrack("switcher")).toBe("ai_backend");
    expect(defaultRoleForTrack("mid")).toBe("genai_llm");
    expect(defaultRoleForTrack("senior")).toBe("ai_architect");
  });

  it("resolves Not sure yet to the track default and flags it", () => {
    expect(resolveRole("not_sure", "senior")).toEqual({ roleId: "ai_architect", roleIsDefault: true });
    expect(resolveRole("ai_data_engineer", "senior")).toEqual({ roleId: "ai_data_engineer", roleIsDefault: false });
  });
});

describe("roleFit", () => {
  it("is on track when the track meets the role's minimum years", () => {
    expect(roleFit("fresher", getRoleById("ml_engineer"))).toBe("on_track");
    expect(roleFit("switcher", getRoleById("ai_data_engineer"))).toBe("on_track");
    expect(roleFit("senior", getRoleById("ai_architect"))).toBe("on_track");
  });

  it("is a stretch when short by two years or fewer", () => {
    expect(roleFit("switcher", getRoleById("ai_platform_mlops"))).toBe("stretch"); // 2 vs 4
    expect(roleFit("fresher", getRoleById("ai_data_engineer"))).toBe("stretch"); // 0 vs 2
  });

  it("says adjacent role first when short by more than two", () => {
    expect(roleFit("fresher", getRoleById("genai_llm"))).toBe("adjacent_first"); // 0 vs 3
    expect(roleFit("mid", getRoleById("ai_architect"))).toBe("adjacent_first"); // 6 vs 10
  });

  it("never rates a senior below on track", () => {
    for (const role of roles) expect(roleFit("senior", role)).toBe("on_track");
  });
});
