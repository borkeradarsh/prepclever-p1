// Mock implementation of the jobs contract (JOBS_SOURCE=mock, the default).
// Same dev flags as the rest of the mock layer: `slow` for the loading state,
// `fail:jobs` for the error state, and `scenario:first-run` for the state where
// nothing has been collected yet.

import { facetValues, selectJobs } from "@/lib/jobs/filters";
import type { Job, JobFacets, JobFilters, JobPage } from "@/types/domain";
import {
  buildDevSampleJobs,
  buildExampleJobs,
  DEV_SAMPLE_PREFIX,
  devSamplesAllowed,
} from "./jobs.mock";
import { latency, maybeFail, readDevFlags } from "./store";

const examples = buildExampleJobs();

async function loadJobs(devSample: boolean | undefined): Promise<Job[]> {
  const flags = await readDevFlags();
  await latency(flags);
  maybeFail(flags, "jobs");
  if (flags.scenario === "first-run") return [];
  const samples = devSample && devSamplesAllowed() ? buildDevSampleJobs(new Date()) : [];
  return [...examples, ...samples];
}

/** The newest research check date, for the freshness line. */
const examplesCheckedOn = examples.reduce<string | null>(
  (latest, job) => (latest === null || job.lastCheckedAt > latest ? job.lastCheckedAt : latest),
  null,
);

export async function getJobs(filters: JobFilters): Promise<JobPage> {
  const active = (await loadJobs(filters.devSample)).filter((job) => job.status === "active");
  return {
    ...selectJobs(active, filters, new Date()),
    source: "examples",
    updatedAt: active.length > 0 ? examplesCheckedOn : null,
  };
}

/** Any job by id, closed ones included: an old link still opens, with a banner. */
export async function getJob(id: string): Promise<Job | null> {
  const all = await loadJobs(id.startsWith(DEV_SAMPLE_PREFIX));
  return all.find((job) => job.id === id) ?? null;
}

export async function getJobFacets(options: { devSample?: boolean } = {}): Promise<JobFacets> {
  const active = (await loadJobs(options.devSample)).filter((job) => job.status === "active");
  return {
    companies: facetValues(active.map((job) => job.company)),
    cities: facetValues(active.map((job) => job.city)),
  };
}

/** Examples were not "added": only collected jobs count, so the mock is always zero. */
export async function getJobsAddedLast30Days(): Promise<number> {
  return 0;
}
