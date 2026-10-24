// The /jobs filters: read from and written to the URL, so links are shareable
// and Back works, then applied to a list of jobs. Pure and dependency-free
// beyond types, so the filter bar (a client component) can import it too.

import type {
  Job,
  JobFilters,
  JobPage,
  JobPostedWithin,
  JobSeniority,
  RoleId,
} from "@/types/domain";
import { normalizeRoleId } from "./normalize-role";

export const JOBS_PAGE_SIZE = 20;
/** The URL value for "All roles". An absent role means the user's own. */
export const ALL_ROLES = "all";

export const SENIORITIES: JobSeniority[] = ["fresher", "switcher", "mid", "senior"];
export const POSTED_WITHIN: JobPostedWithin[] = [7, 30];

const DAY_MS = 24 * 60 * 60 * 1000;

type RawParams = URLSearchParams | Record<string, string | string[] | undefined>;

function toSearchParams(raw: RawParams): URLSearchParams {
  if (raw instanceof URLSearchParams) return raw;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    // Repeated keys: the first wins, as URLSearchParams.get does.
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) params.set(key, first);
  }
  return params;
}

const text = (value: string | null) => {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Reads filters from the URL. Unknown or malformed values fall back to their
 * default rather than erroring, so a hand-edited link still shows something.
 */
export function parseJobFilters(raw: RawParams, defaultRoleId: RoleId | null): JobFilters {
  const params = toSearchParams(raw);

  const role = params.get("role");
  const roleId = role === ALL_ROLES ? null : (normalizeRoleId(role) ?? defaultRoleId);

  const seniority = params.get("seniority");
  const posted = Number(params.get("posted"));
  const page = Number.parseInt(params.get("page") ?? "", 10);

  return {
    roleId,
    company: text(params.get("company")),
    city: text(params.get("city")),
    seniority: (SENIORITIES as string[]).includes(seniority ?? "") ? (seniority as JobSeniority) : null,
    postedWithinDays: (POSTED_WITHIN as number[]).includes(posted) ? (posted as JobPostedWithin) : null,
    q: text(params.get("q")) ?? "",
    sort: "newest",
    page: Number.isFinite(page) && page >= 1 ? page : 1,
    devSample: params.get("devSample") === "1",
  };
}

/**
 * The URL for a set of filters. Role is always written (an id or "all") so a
 * shared link shows the same list to whoever opens it; defaults are omitted.
 */
export function jobsHref(filters: JobFilters, base = "/jobs"): string {
  const params = new URLSearchParams();
  params.set("role", filters.roleId ?? ALL_ROLES);
  if (filters.company) params.set("company", filters.company);
  if (filters.city) params.set("city", filters.city);
  if (filters.seniority) params.set("seniority", filters.seniority);
  if (filters.postedWithinDays) params.set("posted", String(filters.postedWithinDays));
  if (filters.q) params.set("q", filters.q);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.devSample) params.set("devSample", "1");
  return `${base}?${params.toString()}`;
}

/** Every filter cleared, keeping only the dev sample switch. */
export function clearedFilters(filters: Pick<JobFilters, "devSample">): JobFilters {
  return {
    roleId: null,
    company: null,
    city: null,
    seniority: null,
    postedWithinDays: null,
    q: "",
    sort: "newest",
    page: 1,
    devSample: filters.devSample,
  };
}

/** The date a job is listed under: when it was posted, else when it was first seen. */
export function listedAt(job: Pick<Job, "postedAt" | "firstSeenAt">): string {
  return job.postedAt ?? job.firstSeenAt;
}

const sameText = (a: string, b: string) => a.localeCompare(b, "en", { sensitivity: "base" }) === 0;

export function matchesFilters(job: Job, filters: JobFilters, now: Date): boolean {
  if (filters.roleId && job.roleId !== filters.roleId) return false;
  if (filters.company && !sameText(job.company, filters.company)) return false;
  if (filters.city && (job.city === null || !sameText(job.city, filters.city))) return false;
  if (filters.seniority && job.seniority !== filters.seniority) return false;
  if (filters.postedWithinDays) {
    const age = now.getTime() - new Date(listedAt(job)).getTime();
    if (age > filters.postedWithinDays * DAY_MS) return false;
  }
  if (filters.q) {
    const needle = filters.q.toLowerCase();
    if (!`${job.title} ${job.company}`.toLowerCase().includes(needle)) return false;
  }
  return true;
}

/** Newest first; ties by title, then id, so the order is stable across pages. */
export function sortJobs(jobs: Job[]): Job[] {
  return [...jobs].sort(
    (a, b) =>
      listedAt(b).localeCompare(listedAt(a)) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id),
  );
}

/** A page of items. Out-of-range pages clamp to the nearest real one. */
export function paginate<T>(items: T[], page: number, pageSize = JOBS_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page)), pageCount);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, pageCount, pageSize };
}

/** Filter, sort and page in one go: what both job sources return. */
export function selectJobs(
  all: Job[],
  filters: JobFilters,
  now: Date,
): Pick<JobPage, "jobs" | "total" | "page" | "pageCount" | "pageSize" | "totalUnfiltered"> {
  const matching = sortJobs(all.filter((job) => matchesFilters(job, filters, now)));
  const { items, page, pageCount, pageSize } = paginate(matching, filters.page);
  return { jobs: items, total: matching.length, page, pageCount, pageSize, totalUnfiltered: all.length };
}

/** Distinct values for a filter, case-insensitively, sorted. */
export function facetValues(values: (string | null)[]): string[] {
  const seen = new Map<string, string>();
  for (const value of values) {
    if (value && !seen.has(value.toLowerCase())) seen.set(value.toLowerCase(), value);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
