import { describe, expect, it } from "vitest";
import { emptyProgress } from "@/lib/progress";
import { resolveStartDestination } from "@/lib/start";

describe("/start destination", () => {
  it("sends incomplete onboarding to onboarding", () => {
    expect(resolveStartDestination(false, null)).toBe("/onboarding/situation");
    expect(resolveStartDestination(false, emptyProgress())).toBe("/onboarding/situation");
  });

  it("sends a completed user who has opened nothing to Block 1's role page", () => {
    expect(resolveStartDestination(true, emptyProgress())).toBe("/roadmap/market/your-role");
  });

  it("sends anyone who has started to the dashboard", () => {
    expect(resolveStartDestination(true, { ...emptyProgress(), lastItem: "market/landscape" })).toBe("/dashboard");
    expect(resolveStartDestination(true, { ...emptyProgress(), auditRatings: { rag: "learning" } })).toBe("/dashboard");
  });

  it("falls back to the dashboard when progress could not be read", () => {
    expect(resolveStartDestination(true, null)).toBe("/dashboard");
  });
});
