// Typed access to the concept map (content/concept-map.data.json, generated from
// docs/research/14-ai-roles-concept-map.html). The JSON is the only source of
// concepts, domains and role levels: nothing else in the app restates them.

import data from "./concept-map.data.json";
import type { Concept, Domain, DomainId, Level, RoleId } from "@/types/domain";

export const domains: Domain[] = data.domains as Domain[];
export const concepts: Concept[] = data.concepts as Concept[];

/** The concept map's own role entries, for the one-line role descriptions. */
export const conceptMapRoles = data.roles as {
  id: RoleId;
  sourceKey: string;
  title: string;
  description: string;
}[];

const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));
const domainById = new Map(domains.map((domain) => [domain.id, domain]));

export function getConceptById(id: string): Concept | null {
  return conceptById.get(id) ?? null;
}

export function getDomain(id: string): Domain | null {
  return domainById.get(id as DomainId) ?? null;
}

/** Position of a domain in the map's order, for sorting. */
export function domainIndex(id: DomainId): number {
  return domains.findIndex((domain) => domain.id === id);
}

export function conceptLevel(concept: Concept, roleId: RoleId): Level {
  return concept.levels[roleId];
}

/** The role syllabus: every concept the role needs at level 1 or 2, in file order. */
export function relevantConcepts(roleId: RoleId): Concept[] {
  return concepts.filter((concept) => concept.levels[roleId] >= 1);
}

export function coreCount(roleId: RoleId): number {
  return concepts.filter((concept) => concept.levels[roleId] === 2).length;
}

export const levelLabels: Record<1 | 2, string> = {
  2: "Core",
  1: "Good to know",
};
