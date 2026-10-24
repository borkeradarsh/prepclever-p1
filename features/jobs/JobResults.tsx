import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { jobsCopy } from "@/content/jobs.config";
import { getJobs, roleTitle } from "@/lib/data";
import { clearedFilters, jobsHref } from "@/lib/jobs/filters";
import { formatJobDate, isStale, relativeTime } from "@/lib/jobs/format";
import type { JobFilters, JobPage } from "@/types/domain";
import { JobCard } from "./JobCard";
import { JobsPagination } from "./JobsPagination";
import { secondaryLink } from "@/components/ui/link-styles";

const copy = jobsCopy;

function Freshness({ page }: { page: JobPage }) {
  if (!page.updatedAt) return null;
  if (page.source === "examples") {
    return <p className="text-text-subtle">{copy.results.examplesFreshness(formatJobDate(page.updatedAt))}</p>;
  }
  const now = new Date();
  return (
    <>
      <p className="text-text-subtle">{copy.results.collectedFreshness(relativeTime(page.updatedAt, now))}</p>
      {isStale(page.updatedAt, now) ? <p className="text-danger-ink">{copy.results.staleWarning}</p> : null}
    </>
  );
}

/**
 * The list widget, in three of its five states: first-run (nothing collected
 * yet), empty (filters match nothing), and populated. Loading is the Suspense
 * fallback (JobResultsSkeleton) and error is the route's error boundary.
 */
export async function JobResults({ filters }: { filters: JobFilters }) {
  const page = await getJobs(filters);

  if (page.totalUnfiltered === 0) {
    return (
      <EmptyState
        className="mb-[var(--space-xl)]"
        title={copy.firstRun.title}
        body={copy.firstRun.body}
        action={
          <Link href={copy.firstRun.actionHref} className={secondaryLink}>
            {copy.firstRun.action}
          </Link>
        }
      />
    );
  }

  if (page.total === 0) {
    return (
      <EmptyState
        className="mb-[var(--space-xl)]"
        title={copy.empty.title}
        body={copy.empty.body}
        action={
          <Link href={jobsHref(clearedFilters(filters))} className={secondaryLink}>
            {copy.empty.action}
          </Link>
        }
      />
    );
  }

  const from = (page.page - 1) * page.pageSize + 1;
  const to = from + page.jobs.length - 1;

  return (
    <section aria-labelledby="jobs-results-heading" className="grid gap-[var(--space-md)] pb-[var(--space-xl)]">
      <div className="grid gap-[var(--space-xs)]">
        <h2 id="jobs-results-heading" className="font-heading text-lg leading-tight text-text-primary">
          {copy.results.heading(page.total)}
        </h2>
        <p className="text-text-subtle">{copy.results.range(from, to, page.total)}</p>
        <Freshness page={page} />
      </div>

      <ul className="grid auto-rows-fr gap-[var(--space-md)] md:grid-cols-2 lg:grid-cols-3">
        {page.jobs.map((job) => (
          <li key={job.id}>
            <JobCard job={job} roleTitle={job.roleId ? roleTitle(job.roleId) : null} />
          </li>
        ))}
      </ul>

      <JobsPagination filters={filters} page={page.page} pageCount={page.pageCount} />
    </section>
  );
}
