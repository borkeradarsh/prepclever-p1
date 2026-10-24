// How well the user's skill audit covers a job (docs/jobs-spec.md section 6).
// Pure: the data layer supplies the ratings and the role's learning order.

import { getConceptById } from "@/content/concepts";
import { ratingPoints } from "@/lib/syllabus";
import type { Job, JobMatch, Rating } from "@/types/domain";

/** A user has taken the audit once they have rated anything. */
export function hasAudit(ratings: Record<string, Rating>): boolean {
  return Object.keys(ratings).length > 0;
}

/**
 * `percent` is the audit points of the required concepts over the maximum (two
 * per concept). `gaps` are the required concepts not rated confident, in the
 * role's learning order, leaving out concepts the role does not use.
 *
 * Null without an audit (the UI then prompts for one) or when the job lists no
 * skills, since there is nothing to match against.
 */
export function jobMatch(
  job: Pick<Job, "conceptIds">,
  ratings: Record<string, Rating>,
  roleOrder: string[],
): JobMatch | null {
  const required = [...new Set(job.conceptIds)];
  if (!hasAudit(ratings) || required.length === 0) return null;

  const rating = (id: string) => ratings[id] ?? "not_started";
  const points = required.reduce((sum, id) => sum + ratingPoints[rating(id)], 0);
  const position = new Map(roleOrder.map((id, index) => [id, index]));

  return {
    percent: Math.round((points / (2 * required.length)) * 100),
    confident: required.filter((id) => rating(id) === "confident").length,
    required: required.length,
    gaps: required
      .filter((id) => rating(id) !== "confident" && position.has(id))
      .sort((a, b) => position.get(a)! - position.get(b)!)
      .map((id) => getConceptById(id))
      .filter((concept) => concept !== null)
      .map((concept) => ({ id: concept.id, title: concept.title, domain: concept.domain })),
  };
}
