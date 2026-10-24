import { AppContainer } from "@/components/layout/app/AppContainer";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { roadmapCopy } from "@/content/roadmap.config";

/** Block overviews and item pages: a title, its chips, and a column of rows. */
export default function BlockLoading() {
  return (
    <AppContainer>
      <div role="status" aria-label={roadmapCopy.loadingLabel} className="pb-[var(--space-xl)]">
        <div className="grid gap-[var(--space-sm)] pb-[var(--space-lg)] pt-[var(--space-lg)]">
          <Skeleton width="min(100%, 24rem)" height="2.25rem" />
          <Skeleton width="min(100%, 32rem)" height="0.9rem" />
        </div>
        <div className="mb-[var(--space-lg)] flex gap-[var(--space-xs)]">
          <Skeleton width="4rem" height="1.6rem" radius="pill" />
          <Skeleton width="5.5rem" height="1.6rem" radius="pill" />
        </div>
        <div className="grid gap-[var(--space-xs)]">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} height="3.75rem" radius="md" />
          ))}
        </div>
        <SkeletonText lines={2} className="mt-[var(--space-lg)]" />
      </div>
    </AppContainer>
  );
}
