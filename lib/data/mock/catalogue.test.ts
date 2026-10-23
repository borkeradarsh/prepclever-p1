// Enforces the catalogue's invariants for every role, so adding content cannot
// quietly break the access rule or the URL structure.

import { describe, expect, it } from "vitest";
import { paths, roles } from "@/components/auth/onboarding/config";
import { ACCESS_RULES } from "@/lib/access";
import { buildCatalogue, buildPath } from "@/lib/data/mock/catalogue.mock";
import type { RoleId } from "@/types/domain";

const roleIds = roles.map((role) => role.id);

describe("buildCatalogue", () => {
  it("covers every onboarding role", () => {
    expect(roleIds).toHaveLength(5);
  });

  it.each(roleIds)("builds four stages for %s that match the onboarding config", (roleId) => {
    const { stages } = buildCatalogue(roleId);
    expect(stages).toHaveLength(4);
    expect(stages.map((stage) => stage.order)).toEqual([1, 2, 3, 4]);
    expect(stages.map((stage) => ({ name: stage.name, outcome: stage.outcome }))).toEqual(
      paths[roleId].stages.map((stage) => ({ name: stage.name, outcome: stage.outcome })),
    );
  });

  it.each(roleIds)("gives %s one or two courses per stage", (roleId) => {
    const { stages } = buildCatalogue(roleId);
    for (const stage of stages) {
      expect(stage.courseIds.length).toBeGreaterThanOrEqual(1);
      expect(stage.courseIds.length).toBeLessThanOrEqual(2);
    }
  });

  it.each(roleIds)("gives every %s course four to six lessons", (roleId) => {
    for (const course of buildCatalogue(roleId).courses) {
      expect(course.lessons.length).toBeGreaterThanOrEqual(4);
      expect(course.lessons.length).toBeLessThanOrEqual(6);
      expect(course.lessons.map((lesson) => lesson.order)).toEqual(
        course.lessons.map((_, index) => index + 1),
      );
    }
  });

  it.each(roleIds)("makes exactly lesson 1 of every %s course free", (roleId) => {
    for (const course of buildCatalogue(roleId).courses) {
      const [first, ...rest] = course.lessons;
      expect(first.access).toBe("free");
      for (const lesson of rest) expect(lesson.access).toBe(ACCESS_RULES.defaultLessonAccess);
    }
  });

  it.each(roleIds)("keeps %s ids and slugs unique and URL-safe", (roleId) => {
    const { courses } = buildCatalogue(roleId);
    const courseSlugs = courses.map((course) => course.slug);
    expect(new Set(courseSlugs).size).toBe(courseSlugs.length);

    const lessonIds = courses.flatMap((course) => course.lessons.map((lesson) => lesson.id));
    expect(new Set(lessonIds).size).toBe(lessonIds.length);

    for (const course of courses) {
      expect(course.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      const slugs = course.lessons.map((lesson) => lesson.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it.each(roleIds)("gives every %s lesson a plausible duration", (roleId) => {
    for (const course of buildCatalogue(roleId).courses) {
      for (const lesson of course.lessons) {
        expect(lesson.durationMin).toBeGreaterThanOrEqual(10);
        expect(lesson.durationMin).toBeLessThanOrEqual(60);
      }
    }
  });

  it("points every stage at courses that exist", () => {
    for (const roleId of roleIds) {
      const { stages, courses } = buildCatalogue(roleId);
      const ids = new Set(courses.map((course) => course.id));
      for (const stage of stages) {
        for (const courseId of stage.courseIds) expect(ids.has(courseId)).toBe(true);
      }
    }
  });

  it("is deterministic", () => {
    expect(buildCatalogue("genai_llm")).toEqual(buildCatalogue("genai_llm"));
  });
});

describe("buildPath", () => {
  it("titles the path from the situation and the role", () => {
    expect(buildPath("backend_to_ai", "it_services").title).toBe(
      "Service-company engineer → Backend → AI at a GCC",
    );
  });

  it("carries the role, situation and stages", () => {
    const path = buildPath("ai_data" as RoleId, "student");
    expect(path).toMatchObject({ roleId: "ai_data", situation: "student" });
    expect(path.stages).toHaveLength(4);
  });
});
