import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { dashboardCopy } from "@/content/dashboard.config";
import { BlockGridSkeleton } from "@/features/home/BlockGrid";
import { MetricsRowSkeleton } from "@/features/home/MetricsRow";

/** While the greeting loads: the header, then the same widget skeletons the page streams in. */
export default function DashboardLoading() {
  return (
    <AppContainer>
      {/* The real header: same height as the loaded one, and the page keeps its h1. */}
      <PageHeader title={dashboardCopy.greeting.withoutName} subtext={dashboardCopy.greeting.subtext} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-[var(--space-xl)] pb-[var(--space-xl)]">
        <MetricsRowSkeleton />
        <BlockGridSkeleton />
      </div>
    </AppContainer>
  );
}
