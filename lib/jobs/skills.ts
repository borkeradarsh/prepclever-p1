// Skill tags for a job whose posting has not been classified yet: the role's
// most distinctive core concepts from the concept map. They describe the role,
// not the posting, and the UI says so (Job.skillsBasis = "role").

import { concepts as allConcepts } from "@/content/concepts";
import type { Concept, RoleId } from "@/types/domain";

export const MAX_SKILL_TAGS = 5;

/**
 * The role's core (level 2) concepts that the fewest other roles also treat as
 * core, so each role's tags read as that role rather than shared basics. Ties
 * keep the concept map's file order.
 */
export function roleSkillTags(roleId: RoleId, limit = MAX_SKILL_TAGS, source: Concept[] = allConcepts): string[] {
  const coreFor = (concept: Concept) =>
    (Object.values(concept.levels) as number[]).filter((level) => level === 2).length;

  return source
    .map((concept, index) => ({ concept, index }))
    .filter(({ concept }) => concept.levels[roleId] === 2)
    .sort((a, b) => coreFor(a.concept) - coreFor(b.concept) || a.index - b.index)
    .slice(0, limit)
    .map(({ concept }) => concept.id);
}
