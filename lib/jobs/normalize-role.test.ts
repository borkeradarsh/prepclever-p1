import { describe, expect, it } from "vitest";
import { ROLE_IDS } from "@/components/auth/onboarding/types";
import { normalizeRoleId } from "./normalize-role";

describe("normalizeRoleId", () => {
  it("keeps today's seven ids as they are", () => {
    for (const id of ROLE_IDS) expect(normalizeRoleId(id)).toBe(id);
  });

  it("maps the pre-v2 ids to today's", () => {
    expect(normalizeRoleId("ml_mlops")).toBe("ml_engineer");
    expect(normalizeRoleId("ai_platform")).toBe("ai_platform_mlops");
    expect(normalizeRoleId("ai_data")).toBe("ai_data_engineer");
    expect(normalizeRoleId("backend_to_ai")).toBe("ai_backend");
    expect(normalizeRoleId("genai_llm")).toBe("genai_llm");
  });

  it("returns null for anything else", () => {
    for (const value of [null, undefined, "", "all", "not_sure", "ML_ENGINEER", 3, {}]) {
      expect(normalizeRoleId(value)).toBeNull();
    }
  });
});
