// The only place access logic lives (docs/dashboard-structure-spec.md section 6,
// CLAUDE.md section 4). Components must never test a plan inline: call these.

import type { Access, Plan, User } from "@/types/domain";

export const ACCESS_RULES = {
  /** Who may see the courses and lessons inside each stage. */
  roadmapDetail: "paid" as Access,
  /** Access given to every lesson that is not deliberately free. */
  defaultLessonAccess: "paid" as Access,
};

type PlanHolder = Pick<User, "plan">;
type AccessHolder = { access: Access };

/** A plan satisfies an access level: pro satisfies everything, free only free. */
function planSatisfies(plan: Plan, required: Access): boolean {
  return required === "free" || plan === "pro";
}

export function canAccess(user: PlanHolder, item: AccessHolder): boolean {
  return planSatisfies(user.plan, item.access);
}

export function canViewRoadmapDetail(user: PlanHolder): boolean {
  return planSatisfies(user.plan, ACCESS_RULES.roadmapDetail);
}
