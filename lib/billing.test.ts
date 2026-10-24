import { describe, expect, it } from "vitest";
import { billingMode, decideUpgrade, parseUpgradeSource } from "@/lib/billing";

describe("parseUpgradeSource", () => {
  it("keeps a known entry point", () => {
    expect(parseUpgradeSource("locked-page")).toBe("locked-page");
    expect(parseUpgradeSource("sidebar")).toBe("sidebar");
  });

  it("counts anything else as the nav button", () => {
    expect(parseUpgradeSource(undefined)).toBe("nav");
    expect(parseUpgradeSource("<script>")).toBe("nav");
    expect(parseUpgradeSource(["sidebar"])).toBe("nav");
  });
});

describe("billing stub", () => {
  it("mocks the upgrade outside production, and has nothing to sell in production", () => {
    expect(billingMode("development")).toBe("mock");
    expect(billingMode("test")).toBe("mock");
    expect(billingMode("production")).toBe("none");
  });

  it("returns to a safe returnTo after a mock upgrade", () => {
    expect(decideUpgrade("mock", "/roadmap/upskilling")).toEqual({ status: "upgraded", returnTo: "/roadmap/upskilling" });
  });

  it("never returns to an unsafe returnTo", () => {
    expect(decideUpgrade("mock", "//evil.com")).toEqual({ status: "upgraded", returnTo: "/dashboard" });
  });

  it("shows Pro is opening soon in production", () => {
    expect(decideUpgrade("none", "/roadmap/upskilling")).toEqual({
      status: "opening_soon",
      returnTo: "/roadmap/upskilling",
    });
  });
});
