// Role ids as the jobs filter accepts them. A saved onboarding answer or an old
// shared link may still carry a pre-v2 id (ml_mlops, ai_platform, ai_data,
// backend_to_ai); this maps those to today's seven. The map itself is
// onboarding's, so the two can never disagree, and onboarding is not changed.

import { migrateRoleId } from "@/components/auth/onboarding/migrate";
import type { RoleId } from "@/types/domain";

/** Today's id for any current or legacy role id; null for anything else. */
export function normalizeRoleId(value: unknown): RoleId | null {
  return migrateRoleId(value);
}
