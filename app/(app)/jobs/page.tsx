// /jobs: AI jobs at GCCs, filtered in the URL. Free for everyone
// (ACCESS_RULES.jobs), so there is no access check on this page.
//
// States: loading (loading.tsx while the profile loads, then a keyed Suspense
// per filter change), error (error.tsx), first-run, empty and populated
// (features/jobs/JobResults). Dev: ?devSample=1 adds labelled samples.

import type { Metadata } from "next";
import { Suspense } from "react";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { jobsCopy } from "@/content/jobs.config";
import { JobFilterBarLoader } from "@/features/jobs/JobFilterBarLoader";
import { JobResults } from "@/features/jobs/JobResults";
import { JobFilterBarSkeleton, JobResultsSkeleton } from "@/features/jobs/JobsSkeleton";
import { getProfile } from "@/lib/data";
import { jobsHref, parseJobFilters } from "@/lib/jobs/filters";
import { normalizeRoleId } from "@/lib/jobs/normalize-role";
import type { RoleId } from "@/types/domain";

export const metadata: Metadata = { title: `${jobsCopy.title} · PrepClever` };

type JobsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** The role filter's default. Without a profile the list simply opens on All roles. */
async function defaultRoleId(): Promise<RoleId | null> {
  try {
    return normalizeRoleId((await getProfile()).roleId);
  } catch {
    return null;
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const [params, roleId] = await Promise.all([searchParams, defaultRoleId()]);
  const filters = parseJobFilters(params, roleId);

  return (
    <AppContainer>
      <PageHeader title={jobsCopy.title} subtext={jobsCopy.subtext} />
      <Suspense key={filters.devSample ? "samples" : "default"} fallback={<JobFilterBarSkeleton />}>
        <JobFilterBarLoader filters={filters} />
      </Suspense>
      {/* Keyed by the filters, so every change shows the skeleton rather than stale cards. */}
      <Suspense key={jobsHref(filters)} fallback={<JobResultsSkeleton />}>
        <JobResults filters={filters} />
      </Suspense>
    </AppContainer>
  );
}
