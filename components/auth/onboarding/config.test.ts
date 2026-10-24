import { describe, expect, it } from "vitest";
import { situations, yearsBands } from "@/components/auth/onboarding/config";
import { SITUATIONS, YEARS_BANDS } from "@/components/auth/onboarding/types";

// The role cards are covered in content/roles.config.test.ts, where they are
// compared with the role definitions they derive from.
describe("onboarding config", () => {
  it("asks about the four situations", () => {
    expect(situations.map((item) => item.id)).toEqual(SITUATIONS);
  });

  it("asks for years only for working situations", () => {
    expect(situations.filter((item) => item.needsYears).map((item) => item.id)).toEqual([
      "it_services",
      "product_tech",
    ]);
  });

  it("offers the v2 year chips", () => {
    expect(yearsBands.map((item) => item.id)).toEqual(YEARS_BANDS);
    expect(yearsBands.map((item) => item.id)).toEqual(["0-1", "2-5", "6-10", "10+"]);
  });
});
