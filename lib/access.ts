// The only place access logic lives (docs/dashboard-v2-spec.md section 7,
// CLAUDE.md section 4). Components must never test a plan inline: call these.

import type { Access, BlockId, Plan, User } from "@/types/domain";

export const ACCESS_RULES: {
  blocks: Record<BlockId, Access>;
  /** What a free user may see of a locked item: never its body. */
  freePreview: { itemTitleAndSummary: boolean; conceptOverview: boolean };
  jobs: Access;
} = {
  blocks: {
    market: "free",
    "gap-analysis": "free",
    upskilling: "paid",
    positioning: "paid",
    referrals: "paid",
    interviews: "paid",
  },
  // conceptOverview: the concept description, subtopics and practice project.
  freePreview: { itemTitleAndSummary: true, conceptOverview: true },
  jobs: "free",
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

/** An item's access: its own override, else its block's default. */
export function resolveAccess(blockId: BlockId, override?: Access): Access {
  return override ?? ACCESS_RULES.blocks[blockId];
}

export function canPreview(kind: keyof typeof ACCESS_RULES.freePreview): boolean {
  return ACCESS_RULES.freePreview[kind];
}
