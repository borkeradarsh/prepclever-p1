import { describe, expect, it } from "vitest";
import { getDefaultRole, resolveRole } from "@/components/auth/onboarding/config";

// Smoke coverage for the onboarding business rules, to prove the test runner
// and the "@/" alias are wired. The full suite the build spec asks for
// (every situation mapping, plus the copy-length limits) is still to come.
describe("getDefaultRole", () => {
  it("maps a situation to its default role", () => {
    expect(getDefaultRole("student")).toBe("genai_llm");
    expect(getDefaultRole("it_services")).toBe("backend_to_ai");
  });
});

describe("resolveRole", () => {
  it("keeps an explicit choice and flags it as not a default", () => {
    expect(resolveRole("ai_data", "student")).toEqual({
      roleId: "ai_data",
      roleIsDefault: false,
    });
  });

  it('resolves "not_sure" to the situation default and flags it', () => {
    expect(resolveRole("not_sure", "product_tech")).toEqual({
      roleId: "ml_mlops",
      roleIsDefault: true,
    });
  });
});
