// The home roles row: every role, the user's target first, with how they
// fit it and how ready their one skill audit says they are. Pure.

import { coreCount } from "@/content/concepts";
import { hasAudit } from "@/lib/jobs/match";
import { buildGapReport, buildSyllabus } from "@/lib/syllabus";
import { roleFit } from "@/lib/tracks";
import type { Rating, Role, RoleId, RoleOverview, Track } from "@/types/domain";

export function roleOverviews(
  roles: Pick<Role, "id" | "title" | "shortDescription" | "minYears">[],
  targetId: RoleId,
  track: Track,
  ratings: Record<string, Rating>,
): RoleOverview[] {
  const audited = hasAudit(ratings);
  const overviews = roles.map((role) => ({
    roleId: role.id,
    title: role.title,
    shortDescription: role.shortDescription,
    isTarget: role.id === targetId,
    fit: roleFit(track, role),
    // Scored against each role's own syllabus, so ratings outside it do not count.
    readiness: audited ? buildGapReport(buildSyllabus(role.id, ratings), ratings).readiness : null,
    coreCount: coreCount(role.id),
  }));
  return [...overviews.filter((role) => role.isTarget), ...overviews.filter((role) => !role.isTarget)];
}
