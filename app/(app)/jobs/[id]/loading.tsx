import { AppContainer } from "@/components/layout/app/AppContainer";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { dashboardCopy } from "@/content/dashboard.config";

/** The job page's shape while it loads: crumb, title, apply button, sections. */
export default function JobLoading() {
  return (
    <AppContainer width="reading">
      <div role="status" className="grid gap-[var(--space-lg)] pb-[var(--space-xl)] pt-[var(--space-lg)]">
        <span className="sr-only">{dashboardCopy.states.loadingLabel}</span>
        <div aria-hidden="true" className="grid gap-[var(--space-lg)]">
          <Skeleton width="5rem" height="1rem" />
          <div className="grid gap-[var(--space-sm)]">
            <Skeleton width="80%" height="2.25rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
          <Skeleton width="60%" height="2.75rem" />
          <SkeletonText lines={3} />
          <SkeletonText lines={4} />
        </div>
      </div>
    </AppContainer>
  );
}
