import { describe, expect, it } from "vitest";
import { concepts } from "@/content/concepts";
import { allLessons, buildLessonBody, buildLessons } from "./lessons.mock";

describe("placeholder lessons", () => {
  it("gives each concept one lesson per subtopic plus a project, titled from the subtopics", () => {
    for (const concept of concepts) {
      const lessons = buildLessons(concept);
      expect(lessons).toHaveLength(concept.topics.length + 1);
      expect(lessons.slice(0, -1).map((lesson) => lesson.title)).toEqual(concept.topics);
      expect(lessons.at(-1)?.type).toBe("project");
    }
  });

  it("orders lessons from 1 and keeps durations between 8 and 40 minutes", () => {
    for (const concept of concepts) {
      const lessons = buildLessons(concept);
      expect(lessons.map((lesson) => lesson.order)).toEqual(lessons.map((_, index) => index + 1));
      for (const lesson of lessons) {
        expect(lesson.durationMin).toBeGreaterThanOrEqual(8);
        expect(lesson.durationMin).toBeLessThanOrEqual(40);
      }
    }
  });

  it("has unique ids overall and unique slugs within a concept", () => {
    expect(new Set(allLessons.map((lesson) => lesson.id)).size).toBe(allLessons.length);
    for (const concept of concepts) {
      const slugs = buildLessons(concept).map((lesson) => lesson.slug);
      expect(new Set(slugs).size, concept.id).toBe(slugs.length);
    }
  });

  it("makes every lesson Pro, as Block 3 is", () => {
    expect(allLessons.every((lesson) => lesson.access === "paid")).toBe(true);
  });

  it("marks bodies as placeholders", () => {
    const concept = concepts[0];
    const body = buildLessonBody(concept, buildLessons(concept)[0]);
    expect(body.placeholder).toBe(true);
    expect(body.body).toMatch(/PLACEHOLDER/);
  });
});
