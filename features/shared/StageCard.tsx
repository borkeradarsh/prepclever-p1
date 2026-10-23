import type { ReactNode } from "react";
import { SoftCard } from "@/components/ui/SoftCard";
import { ProgressBar } from "@/components/ui/Progress";
import { StageStateBadge } from "@/features/shared/StageStateBadge";
import type { Stage, StageProgress } from "@/types/domain";

type StageCardProps = {
  stage: Stage;
  progress: StageProgress;
  /** Courses, lessons or a lock note. Only rendered when provided. */
  children?: ReactNode;
};

export function StageCard({ stage, progress, children }: StageCardProps) {
  return (
    <SoftCard>
      <div className="flex items-start gap-[var(--space-sm)]">
        <span
          aria-hidden="true"
          className="grid size-6 shrink-0 place-items-center rounded-[var(--radius-pill)] bg-brand-soft text-[length:var(--font-size-small)] text-text-primary"
        >
          {stage.order}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-base leading-tight text-text-primary">
            <span className="sr-only">Stage {stage.order}: </span>
            {stage.name}
          </p>
          <p className="mt-[var(--space-xs)] text-text-subtle">{stage.outcome}</p>
        </div>
        <StageStateBadge state={progress.state} />
      </div>

      {progress.state === "in_progress" ? (
        <ProgressBar
          value={progress.completed}
          max={progress.total}
          label={`${stage.name} progress`}
          className="mt-[var(--space-md)]"
        />
      ) : null}

      {children ? <div className="mt-[var(--space-md)]">{children}</div> : null}
    </SoftCard>
  );
}
