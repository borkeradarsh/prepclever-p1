import { Chip } from "@/components/ui/Chip";
import { dashboardCopy } from "@/content/dashboard.config";
import type { StageState } from "@/types/domain";

type StageStateBadgeProps = { state: StageState };

export function StageStateBadge({ state }: StageStateBadgeProps) {
  return (
    <Chip selected={state === "in_progress"}>
      {dashboardCopy.pathOverview.stateLabels[state]}
    </Chip>
  );
}
