import { describe, expect, it } from "vitest";
import { isAppRoute, routes } from "@/lib/routes";

describe("roadmap routes", () => {
  it("builds block and item URLs", () => {
    expect(routes.block("market")).toBe("/roadmap/market");
    expect(routes.blockItem("market", "your-role")).toBe("/roadmap/market/your-role");
  });

  it("encodes slugs so a stray character cannot break the path", () => {
    expect(routes.blockItem("a/b", "c d")).toBe("/roadmap/a%2Fb/c%20d");
  });

  it("builds an upgrade link that says where it came from and where to return", () => {
    expect(routes.upgradeFrom("locked-page", "/roadmap/upskilling/track-plan")).toBe(
      "/upgrade?from=locked-page&returnTo=%2Froadmap%2Fupskilling%2Ftrack-plan",
    );
  });
});

describe("isAppRoute", () => {
  it("matches app routes and their children", () => {
    expect(isAppRoute("/dashboard")).toBe(true);
    expect(isAppRoute("/roadmap/market/your-role")).toBe(true);
    expect(isAppRoute("/explore")).toBe(true);
  });

  it("does not match marketing or auth routes", () => {
    expect(isAppRoute("/")).toBe(false);
    expect(isAppRoute("/login")).toBe(false);
    expect(isAppRoute("/onboarding/situation")).toBe(false);
  });

  it("no longer claims the redirected legacy routes", () => {
    expect(isAppRoute("/courses/linalg/lessons/vectors")).toBe(false);
    expect(isAppRoute("/path")).toBe(false);
  });

  it("does not match a route that merely starts with the same letters", () => {
    expect(isAppRoute("/dashboards")).toBe(false);
  });
});
