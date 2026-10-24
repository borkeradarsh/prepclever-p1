// Integrity of the concept map data. Everything in Blocks 2 and 3 is built on
// it, so a bad edit to the JSON must fail here rather than in a page.

import { describe, expect, it } from "vitest";
import { ROLE_IDS } from "@/components/auth/onboarding/types";
import { conceptMapRoles, concepts, coreCount, domains, relevantConcepts } from "@/content/concepts";

describe("concept map data", () => {
  it("has 71 concepts across 8 domains and 7 roles", () => {
    expect(concepts).toHaveLength(71);
    expect(domains).toHaveLength(8);
    expect(conceptMapRoles.map((role) => role.id)).toEqual(ROLE_IDS);
  });

  it("has unique concept ids, each in a known domain", () => {
    expect(new Set(concepts.map((concept) => concept.id)).size).toBe(concepts.length);
    const domainIds = new Set(domains.map((domain) => domain.id));
    for (const concept of concepts) expect(domainIds.has(concept.domain), concept.id).toBe(true);
  });

  it("only names prerequisites that exist", () => {
    const ids = new Set(concepts.map((concept) => concept.id));
    for (const concept of concepts) {
      for (const id of concept.prerequisites) expect(ids.has(id), `${concept.id} -> ${id}`).toBe(true);
    }
  });

  it("has no prerequisite cycles", () => {
    const byId = new Map(concepts.map((concept) => [concept.id, concept]));
    const state = new Map<string, "visiting" | "done">();
    const visit = (id: string, path: string[]) => {
      if (state.get(id) === "done") return;
      if (state.get(id) === "visiting") throw new Error(`cycle: ${[...path, id].join(" -> ")}`);
      state.set(id, "visiting");
      for (const next of byId.get(id)!.prerequisites) visit(next, [...path, id]);
      state.set(id, "done");
    };
    expect(() => concepts.forEach((concept) => visit(concept.id, []))).not.toThrow();
  });

  it("gives every role a level of 0, 1 or 2 for every concept", () => {
    for (const concept of concepts) {
      for (const roleId of ROLE_IDS) expect([0, 1, 2], `${concept.id}/${roleId}`).toContain(concept.levels[roleId]);
    }
  });

  it("matches the spec's core counts per role", () => {
    expect(Object.fromEntries(ROLE_IDS.map((roleId) => [roleId, coreCount(roleId)]))).toEqual({
      ml_engineer: 32,
      genai_llm: 24,
      ai_platform_mlops: 17,
      ai_data_engineer: 17,
      applied_scientist: 23,
      ai_backend: 18,
      ai_architect: 20,
    });
  });

  it("gives every concept a description, subtopics and a practice project", () => {
    for (const concept of concepts) {
      expect(concept.description.length, concept.id).toBeGreaterThan(20);
      expect(concept.topics.length, concept.id).toBeGreaterThanOrEqual(4);
      expect(concept.practiceProject.length, concept.id).toBeGreaterThan(10);
    }
  });

  it("gives every role a non-empty syllabus", () => {
    for (const roleId of ROLE_IDS) expect(relevantConcepts(roleId).length).toBeGreaterThan(0);
  });
});
