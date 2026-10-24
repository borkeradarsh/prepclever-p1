// The jobs half of the data contract (docs/jobs-spec.md section 6). Callers
// import these from lib/data; JOBS_SOURCE picks the implementation and changes
// no caller. Server only: it reads env and request cookies.
//
// The match against the user's skill audit is computed here, the same way for
// both sources: the audit lives with the user's progress, not with the jobs.

import { jobMatch } from "@/lib/jobs/match";
import type { JobScore } from "@/lib/jobs/filters";
import { learningOrder } from "@/lib/syllabus";
import type { Job, JobFacets, JobFilters, JobMatch, JobPage, Rating } from "@/types/domain";
import * as mock from "./mock/jobs";
import { readDevFlags, readProfile, readProgress } from "./mock/store";
import * as supabase from "./supabase/jobs";

export type JobsSource = "mock" | "supabase";

export function jobsSource(): JobsSource {
  return process.env.JOBS_SOURCE === "supabase" ? "supabase" : "mock";
}

const impl = () => (jobsSource() === "supabase" ? supabase : mock);

/** The user's ratings and role learning order: everything a match needs. */
async function readAudit(): Promise<{ ratings: Record<string, Rating>; order: string[] }> {
  const flags = await readDevFlags();
  const [profile, progress] = await Promise.all([readProfile(), readProgress(flags)]);
  return { ratings: progress.auditRatings, order: learningOrder(profile.roleId).map((concept) => concept.id) };
}

export async function getJobs(filters: JobFilters): Promise<JobPage> {
  let score: JobScore | undefined;
  if (filters.sort === "best_match") {
    const { ratings, order } = await readAudit();
    score = (job) => jobMatch(job, ratings, order)?.percent ?? null;
  }
  return impl().getJobs(filters, score);
}

export async function getJob(id: string): Promise<Job | null> {
  return impl().getJob(id);
}

/** Null when the job is unknown, lists no skills, or the user has no audit yet. */
export async function getJobMatch(jobId: string): Promise<JobMatch | null> {
  const job = await getJob(jobId);
  if (!job) return null;
  const { ratings, order } = await readAudit();
  return jobMatch(job, ratings, order);
}

/** Matches for a page of jobs in one read of the audit, keyed by job id. */
export async function getJobMatches(jobs: Job[]): Promise<Record<string, JobMatch | null>> {
  const { ratings, order } = await readAudit();
  return Object.fromEntries(jobs.map((job) => [job.id, jobMatch(job, ratings, order)]));
}

export async function getJobFacets(options: { devSample?: boolean } = {}): Promise<JobFacets> {
  return impl().getJobFacets(options);
}

export async function getJobsAddedLast30Days(): Promise<number> {
  return impl().getJobsAddedLast30Days();
}
