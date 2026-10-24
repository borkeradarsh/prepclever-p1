// Supabase implementation of the jobs contract (JOBS_SOURCE=supabase).
//
// TODO(jobs-j1): STUB. Not connected. The jobs tables, the migration and the
// pipeline that fills them are Session J1 (docs/jobs-spec.md sections 4 and 5).
// When they exist, each function reads `jobs` (status = 'active' for lists)
// with the server client, maps rows to Job, and reuses selectJobs or pushes the
// same filters into the query. Until then every read fails loudly, so choosing
// this source by mistake shows the error state rather than an empty list.

import type { Job, JobFacets, JobFilters, JobPage } from "@/types/domain";

function notConnected(): never {
  throw new Error("JOBS_SOURCE=supabase is not connected yet (Session J1). Use JOBS_SOURCE=mock.");
}

export async function getJobs(filters: JobFilters): Promise<JobPage> {
  void filters;
  return notConnected();
}

export async function getJob(id: string): Promise<Job | null> {
  void id;
  return notConnected();
}

export async function getJobFacets(options: { devSample?: boolean } = {}): Promise<JobFacets> {
  void options;
  return notConnected();
}

export async function getJobsAddedLast30Days(): Promise<number> {
  return notConnected();
}
