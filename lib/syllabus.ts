// Role syllabus, learning order and gap scoring (docs/dashboard-v2-spec.md
// section 4). Pure functions over the concept map, so every role can be tested.

import { concepts as allConcepts, domainIndex, domains } from "@/content/concepts";
import type {
  Concept,
  DomainReadiness,
  GapReport,
  Rating,
  RoleId,
  RoleSyllabus,
  SyllabusConcept,
} from "@/types/domain";

export const ratingPoints: Record<Rating, number> = { not_started: 0, learning: 1, confident: 2 };
/** Core counts double: weight = level (2 core, 1 good to know). */
const weightOf = (level: 1 | 2) => level;

/**
 * Kahn's topological sort over the role's relevant concepts. Prerequisites the
 * role does not need are ignored. Among concepts ready at the same time: core
 * before good to know, then domain order, then file order.
 */
export function learningOrder(roleId: RoleId, source: Concept[] = allConcepts): Concept[] {
  const relevant = source.filter((concept) => concept.levels[roleId] >= 1);
  const ids = new Set(relevant.map((concept) => concept.id));
  const fileIndex = new Map(source.map((concept, index) => [concept.id, index]));
  const pending = new Map(
    relevant.map((concept) => [concept.id, new Set(concept.prerequisites.filter((id) => ids.has(id)))]),
  );

  const rank = (concept: Concept) => [
    concept.levels[roleId] === 2 ? 0 : 1,
    domainIndex(concept.domain),
    fileIndex.get(concept.id) ?? 0,
  ];
  const before = (a: Concept, b: Concept) => {
    const [ra, rb] = [rank(a), rank(b)];
    for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
    return 0;
  };

  const order: Concept[] = [];
  let remaining = [...relevant];
  while (remaining.length > 0) {
    const ready = remaining.filter((concept) => pending.get(concept.id)!.size === 0);
    if (ready.length === 0) {
      throw new Error(`Prerequisite cycle among: ${remaining.map((concept) => concept.id).join(", ")}`);
    }
    const next = ready.sort(before)[0];
    order.push(next);
    remaining = remaining.filter((concept) => concept.id !== next.id);
    for (const deps of pending.values()) deps.delete(next.id);
  }
  return order;
}

/** Prerequisites a role does not need: shown as an "Optional prerequisite" hint. */
export function optionalPrerequisites(concept: Concept, roleId: RoleId, source: Concept[] = allConcepts) {
  const byId = new Map(source.map((item) => [item.id, item]));
  return concept.prerequisites.filter((id) => (byId.get(id)?.levels[roleId] ?? 0) === 0);
}

/** Concepts grouped by domain (only domains with something relevant), each in learning order. */
export function buildSyllabus(roleId: RoleId, ratings: Record<string, Rating>): RoleSyllabus {
  const order = learningOrder(roleId);
  const entries: SyllabusConcept[] = order.map((concept) => ({
    concept,
    level: concept.levels[roleId] as 1 | 2,
    optionalPrerequisites: optionalPrerequisites(concept, roleId),
    rating: ratings[concept.id] ?? "not_started",
  }));

  return {
    roleId,
    order: order.map((concept) => concept.id),
    domains: domains
      .map((domain) => ({ domain, concepts: entries.filter((entry) => entry.concept.domain === domain.id) }))
      .filter((group) => group.concepts.length > 0),
  };
}

/** sum(weight * points) / sum(weight * 2), or 0 for an empty set. */
export function readinessScore(entries: Pick<SyllabusConcept, "level" | "rating">[]): number {
  const possible = entries.reduce((sum, entry) => sum + weightOf(entry.level) * 2, 0);
  if (possible === 0) return 0;
  const earned = entries.reduce((sum, entry) => sum + weightOf(entry.level) * ratingPoints[entry.rating], 0);
  return earned / possible;
}

export function buildGapReport(syllabus: RoleSyllabus, ratings: Record<string, Rating>): GapReport {
  const entries = syllabus.domains.flatMap((group) => group.concepts);
  const byId = new Map(entries.map((entry) => [entry.concept.id, entry]));

  const domainScores: DomainReadiness[] = syllabus.domains.map((group) => ({
    domain: group.domain,
    readiness: readinessScore(group.concepts),
    total: group.concepts.length,
    confident: group.concepts.filter((entry) => entry.rating === "confident").length,
  }));

  return {
    readiness: readinessScore(entries),
    domains: domainScores,
    gaps: syllabus.order
      .map((id) => byId.get(id)!)
      .filter((entry) => entry.rating !== "confident"),
    ratedCount: entries.filter((entry) => ratings[entry.concept.id] !== undefined).length,
    total: entries.length,
  };
}
