// Where `/start` sends someone (spec section 3, edit 3). Pure so it is testable;
// app/start/route.ts supplies the inputs.

import { firstItem } from "@/content/blocks.config";
import { routes } from "@/lib/routes";
import type { Progress } from "@/types/domain";

/** True once the user has opened, finished or rated anything on the roadmap. */
export function hasStartedRoadmap(progress: Progress): boolean {
  return (
    progress.lastItem !== null ||
    progress.doneItems.length > 0 ||
    progress.completedLessonIds.length > 0 ||
    Object.keys(progress.auditRatings).length > 0
  );
}

export function resolveStartDestination(onboardingComplete: boolean, progress: Progress | null): string {
  if (!onboardingComplete) return routes.onboarding;
  if (progress && !hasStartedRoadmap(progress)) return routes.blockItem(firstItem.block, firstItem.item);
  return routes.dashboard;
}
