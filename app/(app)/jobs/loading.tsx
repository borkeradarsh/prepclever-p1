import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { jobsCopy } from "@/content/jobs.config";
import { JobFilterBarSkeleton, JobResultsSkeleton } from "@/features/jobs/JobsSkeleton";

/** The whole page while the user's profile (the default role) loads. */
export default function JobsLoading() {
  return (
    <AppContainer>
      <PageHeader title={jobsCopy.title} subtext={jobsCopy.subtext} />
      <JobFilterBarSkeleton />
      <JobResultsSkeleton />
    </AppContainer>
  );
}
