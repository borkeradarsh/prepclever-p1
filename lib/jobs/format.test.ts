import { describe, expect, it } from "vitest";
import { applyTarget, experienceRange, formatJobDate, isStale, relativeTime } from "./format";

describe("formatJobDate", () => {
  it("formats in UTC", () => {
    expect(formatJobDate("2026-10-20T00:00:00.000Z")).toBe("20 Oct 2026");
  });
});

describe("experienceRange", () => {
  it("words every shape a posting can give", () => {
    expect(experienceRange(3, 6)).toBe("3–6 years");
    expect(experienceRange(4, 4)).toBe("4 years");
    expect(experienceRange(8, null)).toBe("8+ years");
    expect(experienceRange(null, 2)).toBe("Up to 2 years");
    expect(experienceRange(null, null)).toBeNull();
  });
});

describe("applyTarget", () => {
  it("never calls a LinkedIn listing the company's careers site", () => {
    expect(applyTarget("https://in.linkedin.com/jobs/view/123")).toEqual({ kind: "board", siteName: "LinkedIn" });
    expect(applyTarget("https://www.linkedin.com/jobs/view/123")).toEqual({ kind: "board", siteName: "LinkedIn" });
  });

  it("treats other hosts as the careers site", () => {
    expect(applyTarget("https://careers.nike.com/en/job/R-1")).toEqual({ kind: "careers" });
    expect(applyTarget("https://notlinkedin.com/x")).toEqual({ kind: "careers" });
  });

  it("does not throw on a malformed URL", () => {
    expect(applyTarget("not a url").kind).toBe("board");
  });
});

describe("relativeTime and isStale", () => {
  const now = new Date("2026-10-24T12:00:00.000Z");
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

  it("words the age", () => {
    expect(relativeTime(hoursAgo(0.5), now)).toBe("just now");
    expect(relativeTime(hoursAgo(1), now)).toBe("1 hour ago");
    expect(relativeTime(hoursAgo(5), now)).toBe("5 hours ago");
    expect(relativeTime(hoursAgo(30), now)).toBe("1 day ago");
    expect(relativeTime(hoursAgo(80), now)).toBe("3 days ago");
  });

  it("is stale only after 48 hours", () => {
    expect(isStale(hoursAgo(48), now)).toBe(false);
    expect(isStale(hoursAgo(49), now)).toBe(true);
  });
});
