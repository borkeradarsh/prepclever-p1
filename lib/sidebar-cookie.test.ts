import { describe, expect, it } from "vitest";
import { parseSidebarCookie, serializeSidebarCookie, SIDEBAR_COOKIE } from "@/lib/sidebar-cookie";

describe("parseSidebarCookie", () => {
  it("reads a collapsed sidebar", () => {
    expect(parseSidebarCookie("collapsed")).toBe("collapsed");
    expect(parseSidebarCookie(" collapsed ")).toBe("collapsed");
  });

  it("defaults to expanded for a missing, empty or unknown value", () => {
    expect(parseSidebarCookie(undefined)).toBe("expanded");
    expect(parseSidebarCookie(null)).toBe("expanded");
    expect(parseSidebarCookie("")).toBe("expanded");
    expect(parseSidebarCookie("expanded")).toBe("expanded");
    expect(parseSidebarCookie("COLLAPSED")).toBe("expanded");
    expect(parseSidebarCookie("collapsed; Path=/")).toBe("expanded");
  });

  it("round-trips through the cookie the toggle writes", () => {
    for (const state of ["collapsed", "expanded"] as const) {
      const cookie = serializeSidebarCookie(state);
      expect(cookie.startsWith(`${SIDEBAR_COOKIE}=${state};`)).toBe(true);
      expect(cookie).toContain("Path=/");
      const value = cookie.split(";")[0].split("=")[1];
      expect(parseSidebarCookie(value)).toBe(state);
    }
  });
});
