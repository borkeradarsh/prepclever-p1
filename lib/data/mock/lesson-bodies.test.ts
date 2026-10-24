// No data function hands a lesson body to a free user (docs/dashboard-v2-spec.md
// section 7). Runs the real mock data layer over every concept and lesson with
// the request cookies stubbed, then searches every result for body text.

import { beforeEach, describe, expect, it, vi } from "vitest";
import { concepts } from "@/content/concepts";

const jar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => void jar.set(name, value),
  }),
}));

// No mock network delay: this test makes hundreds of reads.
vi.mock("@/lib/data/mock/store", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/data/mock/store")>()),
  latency: async () => {},
}));

const data = await import("@/lib/data/mock");
const { buildLessons, buildLessonBody } = await import("@/lib/data/mock/lessons.mock");

// Every body the mock can produce starts with this marker (lessons.mock.ts).
const BODY_MARKER = "PLACEHOLDER CONTENT";
const leaks = (value: unknown) => JSON.stringify(value ?? null).includes(BODY_MARKER);

const asPlan = (plan: "free" | "pro") => {
  jar.clear();
  jar.set("prepclever-dev", `plan:${plan}`);
};

describe("lesson bodies for free users", () => {
  beforeEach(() => asPlan("free"));

  it("checks for the right marker", () => {
    const concept = concepts[0];
    expect(buildLessonBody(concept, buildLessons(concept)[0]).body).toContain(BODY_MARKER);
  });

  it("never come back from getLessonBody, for any lesson", async () => {
    for (const concept of concepts) {
      for (const lesson of buildLessons(concept)) {
        expect(await data.getLessonBody(concept.id, lesson.slug), lesson.id).toBeNull();
      }
    }
  });

  it("are never part of a concept, lesson or neighbour read", async () => {
    for (const concept of concepts) {
      expect(leaks(await data.getConcept(concept.domain, concept.id)), concept.id).toBe(false);
      for (const lesson of buildLessons(concept)) {
        expect(leaks(await data.getLesson(concept.id, lesson.slug)), lesson.id).toBe(false);
        expect(leaks(await data.getLessonNeighbours(concept.id, lesson.slug)), lesson.id).toBe(false);
      }
    }
  });

  it("are never part of any other read in the data contract", async () => {
    const reads = await Promise.all([
      data.getUser(),
      data.getProfile(),
      data.getProgress(),
      data.getBlocks(),
      data.getBlock("upskilling"),
      data.getBlockItem("upskilling", "track-plan"),
      data.getRoleSyllabus(),
      data.getGapReport(),
      data.getNextRecommended(),
      data.getChecklists(),
      data.getRoles(),
    ]);
    for (const result of reads) expect(leaks(result)).toBe(false);
  });

  it("leave a free user's concept marked locked while its body is withheld", async () => {
    const concept = concepts[0];
    const lesson = buildLessons(concept)[0];
    const view = await data.getConcept(concept.domain, concept.id);
    expect(view?.locked).toBe(true);
    expect(await data.getLessonBody(concept.id, lesson.slug)).toBeNull();
  });
});

describe("lesson bodies for Pro users", () => {
  beforeEach(() => asPlan("pro"));

  it("come back from getLessonBody, so the free check above is meaningful", async () => {
    const concept = concepts[0];
    const lesson = buildLessons(concept)[0];
    expect((await data.getLessonBody(concept.id, lesson.slug))?.body).toContain(BODY_MARKER);
    expect((await data.getConcept(concept.domain, concept.id))?.locked).toBe(false);
  });
});
