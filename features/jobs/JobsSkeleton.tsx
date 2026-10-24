// Loading placeholders with the loaded layout's dimensions: the same card
// min-height, the same grid and the same control heights, so nothing shifts
// when the data arrives.

import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { SoftCard } from "@/components/ui/SoftCard";
import { dashboardCopy } from "@/content/dashboard.config";

const CONTROL_HEIGHT = "2.75rem"; // min-h-11, the 44px tap target
const LABEL_HEIGHT = "0.9rem";

function ControlSkeleton() {
  return (
    <div className="grid gap-[var(--space-xs)]">
      <Skeleton width="45%" height={LABEL_HEIGHT} />
      <Skeleton height={CONTROL_HEIGHT} />
    </div>
  );
}

export function JobFilterBarSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-[var(--space-sm)] pb-[var(--space-lg)]">
      <div className="grid gap-[var(--space-xs)]">
        <Skeleton width="4rem" height={LABEL_HEIGHT} />
        <Skeleton height={CONTROL_HEIGHT} />
      </div>
      <div className="grid grid-cols-2 gap-[var(--space-sm)] md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <ControlSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <SoftCard className="flex h-full min-h-[var(--job-card-min-height)] flex-col gap-[var(--space-sm)]">
      <div className="flex justify-between">
        <Skeleton width="7rem" height="1.6rem" radius="pill" />
        <Skeleton width="4.5rem" height="1.6rem" radius="pill" />
      </div>
      <SkeletonText lines={2} />
      <Skeleton width="70%" height="0.8rem" />
      <Skeleton width="50%" height="0.8rem" />
      <div className="flex flex-wrap gap-[var(--space-xs)]">
        {["6rem", "5rem", "7rem", "4.5rem"].map((width) => (
          <Skeleton key={width} width={width} height="1.6rem" radius="pill" />
        ))}
      </div>
      <div className="mt-auto flex items-end justify-between gap-[var(--space-sm)]">
        <Skeleton width="55%" height="0.8rem" />
        <Skeleton width="4.5rem" height={CONTROL_HEIGHT} />
      </div>
    </SoftCard>
  );
}

/** The results header and a page of cards. Six fills two rows at every width. */
export function JobResultsSkeleton() {
  return (
    <div role="status" className="grid gap-[var(--space-md)] pb-[var(--space-xl)]">
      <span className="sr-only">{dashboardCopy.states.loadingLabel}</span>
      <div aria-hidden="true" className="grid gap-[var(--space-xs)]">
        <Skeleton width="6rem" height="1.4rem" />
        <Skeleton width="45%" height="0.9rem" />
        <Skeleton width="70%" height="0.9rem" />
      </div>
      <ul aria-hidden="true" className="grid auto-rows-fr gap-[var(--space-md)] md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index}>
            <JobCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
