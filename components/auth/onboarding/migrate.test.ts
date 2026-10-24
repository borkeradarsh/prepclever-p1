import { describe, expect, it } from "vitest";
import { migrateOnboardingState, parseOnboardingCookie } from "@/components/auth/onboarding/migrate";

const saved = (patch: Record<string, unknown>) => ({
  situation: "it_services",
  yearsBand: "6-10",
  roleId: "genai_llm",
  roleIsDefault: false,
  currentStep: "done",
  completedAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-01T00:00:00.000Z",
  ...patch,
});

describe("year band migration", () => {
  it("moves 0-2 to 0-1 and 3-5 to 2-5", () => {
    expect(migrateOnboardingState(saved({ yearsBand: "0-2" })).yearsBand).toBe("0-1");
    expect(migrateOnboardingState(saved({ yearsBand: "3-5" })).yearsBand).toBe("2-5");
  });

  it("keeps bands that did not change", () => {
    expect(migrateOnboardingState(saved({ yearsBand: "6-10" })).yearsBand).toBe("6-10");
    expect(migrateOnboardingState(saved({ yearsBand: "10+" })).yearsBand).toBe("10+");
    expect(migrateOnboardingState(saved({ yearsBand: null })).yearsBand).toBeNull();
  });
});

describe("role id migration", () => {
  it.each([
    ["ml_mlops", "ml_engineer"],
    ["ai_platform", "ai_platform_mlops"],
    ["ai_data", "ai_data_engineer"],
    ["backend_to_ai", "ai_backend"],
    ["genai_llm", "genai_llm"],
  ])("maps %s to %s", (from, to) => {
    expect(migrateOnboardingState(saved({ roleId: from })).roleId).toBe(to);
  });

  it("drops an unknown role rather than keeping it", () => {
    const state = migrateOnboardingState(saved({ roleId: "astronaut", roleIsDefault: true }));
    expect(state.roleId).toBeNull();
    expect(state.roleIsDefault).toBe(false);
  });
});

describe("parseOnboardingCookie", () => {
  it("reads an old cookie end to end, keeping completion", () => {
    const cookie = encodeURIComponent(JSON.stringify(saved({ yearsBand: "3-5", roleId: "backend_to_ai" })));
    expect(parseOnboardingCookie(cookie)).toMatchObject({
      situation: "it_services",
      yearsBand: "2-5",
      roleId: "ai_backend",
      currentStep: "done",
      completedAt: "2026-10-01T00:00:00.000Z",
    });
  });

  it("returns the empty state for a missing or malformed cookie", () => {
    expect(parseOnboardingCookie(undefined).currentStep).toBe("situation");
    expect(parseOnboardingCookie("%7Bnot-json").situation).toBeNull();
    expect(migrateOnboardingState("nonsense").roleId).toBeNull();
  });

  it("rejects an unknown situation or step", () => {
    const state = migrateOnboardingState(saved({ situation: "astronaut", currentStep: "warp" }));
    expect(state.situation).toBeNull();
    expect(state.currentStep).toBe("situation");
  });
});
