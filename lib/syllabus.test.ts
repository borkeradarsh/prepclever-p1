import { describe, expect, it } from "vitest";
import { ROLE_IDS } from "@/components/auth/onboarding/types";
import { concepts, domainIndex, relevantConcepts } from "@/content/concepts";
import { buildGapReport, buildSyllabus, learningOrder, optionalPrerequisites, readinessScore } from "@/lib/syllabus";
import type { Concept, Rating } from "@/types/domain";

const levels = (level: 0 | 1 | 2) =>
  Object.fromEntries(ROLE_IDS.map((roleId) => [roleId, level])) as Concept["levels"];

const concept = (id: string, prerequisites: string[], level: 0 | 1 | 2, domain: Concept["domain"] = "math"): Concept => ({
  id,
  title: id,
  domain,
  prerequisites,
  levels: levels(level),
  description: "",
  topics: [],
  practiceProject: "",
});

describe("learningOrder on the real concept map", () => {
  it.each(ROLE_IDS)("orders every relevant concept once for %s", (roleId) => {
    const order = learningOrder(roleId).map((item) => item.id);
    expect(order.sort()).toEqual(relevantConcepts(roleId).map((item) => item.id).sort());
  });

  it.each(ROLE_IDS)("always puts relevant prerequisites first for %s", (roleId) => {
    const order = learningOrder(roleId);
    const position = new Map(order.map((item, index) => [item.id, index]));
    for (const item of order) {
      for (const prerequisite of item.prerequisites) {
        if (!position.has(prerequisite)) continue; // not needed by this role
        expect(position.get(prerequisite)!, `${prerequisite} before ${item.id}`).toBeLessThan(position.get(item.id)!);
      }
    }
  });

  it("puts a core concept first when nothing blocks it", () => {
    for (const roleId of ROLE_IDS) {
      const first = learningOrder(roleId)[0];
      expect(first.levels[roleId], roleId).toBe(2);
    }
  });
});

describe("learningOrder tie-breaks", () => {
  it("prefers core over good to know, then domain order, then file order", () => {
    const data = [
      concept("good-math", [], 1, "math"),
      concept("core-cs", [], 2, "cs"),
      concept("core-math-b", [], 2, "math"),
      concept("core-math-a", [], 2, "math"),
    ];
    expect(domainIndex("math")).toBeLessThan(domainIndex("cs"));
    expect(learningOrder("ml_engineer", data).map((item) => item.id)).toEqual([
      "core-math-b",
      "core-math-a",
      "core-cs",
      "good-math",
    ]);
  });

  it("ignores prerequisites the role does not need", () => {
    const data = [concept("skipped", [], 0), concept("needs-skipped", ["skipped"], 2)];
    expect(learningOrder("ml_engineer", data).map((item) => item.id)).toEqual(["needs-skipped"]);
    expect(optionalPrerequisites(data[1], "ml_engineer", data)).toEqual(["skipped"]);
  });

  it("lets a prerequisite unblock its dependants", () => {
    const data = [concept("b", ["a"], 2), concept("a", [], 1)];
    expect(learningOrder("ml_engineer", data).map((item) => item.id)).toEqual(["a", "b"]);
  });

  it("refuses a cycle instead of looping", () => {
    expect(() => learningOrder("ml_engineer", [concept("a", ["b"], 2), concept("b", ["a"], 2)])).toThrow(/cycle/);
  });
});

describe("buildSyllabus", () => {
  it("shows only domains with at least one relevant concept, in map order", () => {
    for (const roleId of ROLE_IDS) {
      const syllabus = buildSyllabus(roleId, {});
      const ids = syllabus.domains.map((group) => group.domain.id);
      expect(ids).toEqual([...ids].sort((a, b) => domainIndex(a) - domainIndex(b)));
      for (const group of syllabus.domains) expect(group.concepts.length).toBeGreaterThan(0);
    }
  });

  it("labels each concept core or good to know and defaults ratings to not started", () => {
    const syllabus = buildSyllabus("genai_llm", {});
    for (const entry of syllabus.domains.flatMap((group) => group.concepts)) {
      expect([1, 2]).toContain(entry.level);
      expect(entry.rating).toBe("not_started");
    }
  });
});

describe("gap report scoring", () => {
  it("scores readiness as weighted points over the maximum", () => {
    // core confident 2*2, good to know learning 1*1, over 2*2 + 1*2
    expect(readinessScore([
      { level: 2, rating: "confident" },
      { level: 1, rating: "learning" },
    ])).toBeCloseTo(5 / 6);
    expect(readinessScore([])).toBe(0);
  });

  it("is 0 with nothing rated and 1 with everything confident", () => {
    const empty = buildGapReport(buildSyllabus("ai_backend", {}), {});
    expect(empty.readiness).toBe(0);
    expect(empty.ratedCount).toBe(0);
    expect(empty.gaps).toHaveLength(empty.total);

    const all = Object.fromEntries(concepts.map((item) => [item.id, "confident" as Rating]));
    const full = buildGapReport(buildSyllabus("ai_backend", all), all);
    expect(full.readiness).toBe(1);
    expect(full.gaps).toHaveLength(0);
    for (const domain of full.domains) expect(domain.readiness).toBe(1);
  });

  it("lists gaps in learning order, skipping confident concepts", () => {
    const order = learningOrder("ml_engineer").map((item) => item.id);
    const ratings: Record<string, Rating> = { [order[0]]: "confident", [order[1]]: "learning" };
    const report = buildGapReport(buildSyllabus("ml_engineer", ratings), ratings);
    expect(report.gaps.map((gap) => gap.concept.id)).toEqual(order.slice(1));
    expect(report.ratedCount).toBe(2);
  });
});
