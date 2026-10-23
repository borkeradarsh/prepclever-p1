import { describe, expect, it } from "vitest";
import { isAppRoute, routes } from "@/lib/routes";

describe("routes.lesson", () => {
  it("builds a lesson URL", () => {
    expect(routes.lesson("python-for-ai-engineers", "typed-python-setup")).toBe(
      "/courses/python-for-ai-engineers/lessons/typed-python-setup",
    );
  });

  it("encodes slugs so a stray character cannot break the path", () => {
    expect(routes.lesson("a/b", "c d")).toBe("/courses/a%2Fb/lessons/c%20d");
  });
});

describe("isAppRoute", () => {
  it("matches app routes and their children", () => {
    expect(isAppRoute("/dashboard")).toBe(true);
    expect(isAppRoute("/courses/some-course/lessons/some-lesson")).toBe(true);
  });

  it("does not match marketing or auth routes", () => {
    expect(isAppRoute("/")).toBe(false);
    expect(isAppRoute("/login")).toBe(false);
    expect(isAppRoute("/onboarding/situation")).toBe(false);
  });

  it("does not match a route that merely starts with the same letters", () => {
    expect(isAppRoute("/dashboards")).toBe(false);
  });
});
