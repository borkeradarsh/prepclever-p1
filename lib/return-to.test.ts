import { describe, expect, it } from "vitest";
import { safeReturnTo } from "@/lib/return-to";

describe("safeReturnTo", () => {
  it.each(["/dashboard", "/roadmap/upskilling", "/roadmap/market/your-role?tab=pay#postings", "/"])(
    "accepts the same-site path %s",
    (value) => {
      expect(safeReturnTo(value)).toBe(value);
    },
  );

  it.each([
    "//evil.com",
    "//evil.com/path",
    "https://evil.com",
    "javascript:alert(1)",
    "evil.com",
    "dashboard",
    "/\\evil.com",
    "\\\\evil.com",
    "/path\nwith-newline",
    "/\tevil",
    "",
  ])("rejects %j", (value) => {
    expect(safeReturnTo(value)).toBe("/dashboard");
  });

  it("rejects non-strings and absurd lengths", () => {
    expect(safeReturnTo(undefined)).toBe("/dashboard");
    expect(safeReturnTo(null)).toBe("/dashboard");
    expect(safeReturnTo(["/dashboard"])).toBe("/dashboard");
    expect(safeReturnTo(`/${"a".repeat(3000)}`)).toBe("/dashboard");
  });

  it("uses the given fallback", () => {
    expect(safeReturnTo("//evil.com", "/start")).toBe("/start");
  });
});
