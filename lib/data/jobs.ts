// The jobs half of the data contract (docs/jobs-spec.md section 6). Callers
// import these from lib/data; JOBS_SOURCE picks the implementation and changes
// no caller. Server only: it reads env and request cookies.

import type { Job, JobFacets, JobFilters, JobPage } from "@/types/domain";
import * as mock from "./mock/jobs";
import * as supabase from "./supabase/jobs";

export type JobsSource = "mock" | "supabase";

export function jobsSource(): JobsSource {
  return process.env.JOBS_SOURCE === "supabase" ? "supabase" : "mock";
}

const impl = () => (jobsSource() === "supabase" ? supabase : mock);

export async function getJobs(filters: JobFilters): Promise<JobPage> {
  return impl().getJobs(filters);
}

export async function getJob(id: string): Promise<Job | null> {
  return impl().getJob(id);
}

export async function getJobFacets(options: { devSample?: boolean } = {}): Promise<JobFacets> {
  return impl().getJobFacets(options);
}

export async function getJobsAddedLast30Days(): Promise<number> {
  return impl().getJobsAddedLast30Days();
}
