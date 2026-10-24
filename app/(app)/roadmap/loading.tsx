import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { roadmapCopy } from "@/content/roadmap.config";

/** The real header and six cards at the loaded card's minimum height, so nothing moves when they arrive. */
export default function RoadmapLoading() {
  return (
    <AppContainer>
      {/* The header is static copy, so it renders for real and does not move. */}
      <PageHeader title={roadmapCopy.title} subtext={roadmapCopy.subtext} />
      <div role="status" aria-label={roadmapCopy.loadingLabel}>
        <div className="grid auto-rows-fr gap-[var(--space-md)] pb-[var(--space-xl)]">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-[var(--space-sm)] md:gap-[var(--space-md)]">
              <Skeleton width="2.5rem" height="2.5rem" radius="pill" />
              <div className="grid min-h-[var(--roadmap-card-min-height)] content-start gap-[var(--space-sm)] rounded-[var(--radius-soft-lg)] border border-border-soft p-[var(--space-md)] md:p-[var(--space-lg)]">
                <Skeleton width="5rem" height="0.75rem" />
                <Skeleton width="70%" height="1.4rem" />
                <SkeletonText lines={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppContainer>
  );
}
