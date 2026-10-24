import { describe, expect, it } from "vitest";
import type { Job, JobFilters } from "@/types/domain";
import {
  clearedFilters,
  facetValues,
  jobsHref,
  matchesFilters,
  paginate,
  parseJobFilters,
  selectJobs,
  sortJobs,
} from "./filters";

const NOW = new Date("2026-10-24T12:00:00.000Z");
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

const job = (patch: Partial<Job> & Pick<Job, "id">): Job => ({
  kind: "dev_sample",
  title: "ML Engineer",
  company: "Company A",
  city: "Bengaluru",
  roleId: "ml_engineer",
  seniority: "mid",
  expMin: 2,
  expMax: 5,
  conceptIds: [],
  skillsBasis: "posting",
  summary: null,
  applyUrl: "https://example.com/job",
  postedAt: daysAgo(1),
  firstSeenAt: daysAgo(1),
  lastCheckedAt: daysAgo(0),
  status: "active",
  ...patch,
});

const all = (patch: Partial<JobFilters> = {}): JobFilters => ({ ...clearedFilters({}), ...patch });

describe("parseJobFilters", () => {
  it("defaults the role to the user's and everything else to off", () => {
    expect(parseJobFilters({}, "genai_llm")).toEqual({
      roleId: "genai_llm",
      company: null,
      city: null,
      seniority: null,
      postedWithinDays: null,
      q: "",
      sort: "newest",
      page: 1,
      devSample: false,
    });
  });

  it("reads role=all as All roles, overriding the default", () => {
    expect(parseJobFilters({ role: "all" }, "genai_llm").roleId).toBeNull();
  });

  it("normalizes a legacy role id in the URL", () => {
    expect(parseJobFilters({ role: "backend_to_ai" }, null).roleId).toBe("ai_backend");
  });

  it("falls back to the default for an unknown role", () => {
    expect(parseJobFilters({ role: "astronaut" }, "ml_engineer").roleId).toBe("ml_engineer");
  });

  it("reads every filter from the URL", () => {
    const filters = parseJobFilters(
      new URLSearchParams("role=ai_architect&company=Nike&city=Pune&seniority=senior&posted=7&q=%20lead%20&page=3&devSample=1"),
      null,
    );
    expect(filters).toMatchObject({
      roleId: "ai_architect",
      company: "Nike",
      city: "Pune",
      seniority: "senior",
      postedWithinDays: 7,
      q: "lead",
      page: 3,
      devSample: true,
    });
  });

  it("ignores malformed values rather than erroring", () => {
    const filters = parseJobFilters({ seniority: "boss", posted: "14", page: "-2", company: "  ", q: ["a", "b"] }, null);
    expect(filters).toMatchObject({ seniority: null, postedWithinDays: null, page: 1, company: null, q: "a" });
    expect(parseJobFilters({ page: "abc" }, null).page).toBe(1);
  });

  it("round-trips through jobsHref", () => {
    const filters = all({ roleId: "ml_engineer", company: "Target", city: "Hyderabad", seniority: "senior", postedWithinDays: 30, q: "ai", page: 2, devSample: true });
    const href = jobsHref(filters);
    const parsed = parseJobFilters(new URLSearchParams(href.split("?")[1]), "genai_llm");
    expect(parsed).toEqual(filters);
  });
});

describe("jobsHref", () => {
  it("always writes the role, and omits defaults", () => {
    expect(jobsHref(all())).toBe("/jobs?role=all");
    expect(jobsHref(all({ roleId: "genai_llm" }))).toBe("/jobs?role=genai_llm");
  });

  it("clearing keeps only the dev sample switch", () => {
    expect(jobsHref(clearedFilters({ devSample: true }))).toBe("/jobs?role=all&devSample=1");
  });
});

describe("matchesFilters", () => {
  const base = job({ id: "a" });

  it("matches everything with no filters", () => {
    expect(matchesFilters(base, all(), NOW)).toBe(true);
  });

  it("filters by role, company and city, ignoring case", () => {
    expect(matchesFilters(base, all({ roleId: "ml_engineer" }), NOW)).toBe(true);
    expect(matchesFilters(base, all({ roleId: "genai_llm" }), NOW)).toBe(false);
    expect(matchesFilters(base, all({ company: "company a" }), NOW)).toBe(true);
    expect(matchesFilters(base, all({ company: "Company B" }), NOW)).toBe(false);
    expect(matchesFilters(base, all({ city: "BENGALURU" }), NOW)).toBe(true);
    expect(matchesFilters(job({ id: "b", city: null }), all({ city: "Bengaluru" }), NOW)).toBe(false);
  });

  it("shows unclassified jobs only under All roles", () => {
    const unclassified = job({ id: "c", roleId: null });
    expect(matchesFilters(unclassified, all(), NOW)).toBe(true);
    expect(matchesFilters(unclassified, all({ roleId: "ml_engineer" }), NOW)).toBe(false);
  });

  it("filters by seniority", () => {
    expect(matchesFilters(base, all({ seniority: "mid" }), NOW)).toBe(true);
    expect(matchesFilters(base, all({ seniority: "senior" }), NOW)).toBe(false);
    expect(matchesFilters(job({ id: "d", seniority: null }), all({ seniority: "mid" }), NOW)).toBe(false);
  });

  it("filters by posted within, falling back to first seen", () => {
    expect(matchesFilters(job({ id: "e", postedAt: daysAgo(6) }), all({ postedWithinDays: 7 }), NOW)).toBe(true);
    expect(matchesFilters(job({ id: "f", postedAt: daysAgo(8) }), all({ postedWithinDays: 7 }), NOW)).toBe(false);
    expect(matchesFilters(job({ id: "g", postedAt: daysAgo(29) }), all({ postedWithinDays: 30 }), NOW)).toBe(true);
    expect(matchesFilters(job({ id: "h", postedAt: daysAgo(31) }), all({ postedWithinDays: 30 }), NOW)).toBe(false);
    const unposted = job({ id: "i", postedAt: null, firstSeenAt: daysAgo(3) });
    expect(matchesFilters(unposted, all({ postedWithinDays: 7 }), NOW)).toBe(true);
  });

  it("searches title and company, ignoring case", () => {
    const target = job({ id: "j", title: "Lead Engineer – Gen AI", company: "Target" });
    expect(matchesFilters(target, all({ q: "gen ai" }), NOW)).toBe(true);
    expect(matchesFilters(target, all({ q: "TARGET" }), NOW)).toBe(true);
    expect(matchesFilters(target, all({ q: "walmart" }), NOW)).toBe(false);
  });
});

describe("sortJobs", () => {
  it("puts the newest first, using first seen when there is no posting date", () => {
    const jobs = [
      job({ id: "old", postedAt: daysAgo(10) }),
      job({ id: "unposted", postedAt: null, firstSeenAt: daysAgo(2) }),
      job({ id: "new", postedAt: daysAgo(1) }),
    ];
    expect(sortJobs(jobs).map((item) => item.id)).toEqual(["new", "unposted", "old"]);
  });

  it("breaks ties by title, then id, and does not mutate its input", () => {
    const same = daysAgo(1);
    const jobs = [
      job({ id: "z", title: "B", postedAt: same }),
      job({ id: "y", title: "A", postedAt: same }),
      job({ id: "x", title: "A", postedAt: same }),
    ];
    expect(sortJobs(jobs).map((item) => item.id)).toEqual(["x", "y", "z"]);
    expect(jobs.map((item) => item.id)).toEqual(["z", "y", "x"]);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 45 }, (_, index) => index);

  it("cuts pages of 20", () => {
    expect(paginate(items, 1)).toMatchObject({ page: 1, pageCount: 3, pageSize: 20 });
    expect(paginate(items, 1).items).toHaveLength(20);
    expect(paginate(items, 3).items).toEqual([40, 41, 42, 43, 44]);
  });

  it("clamps out-of-range pages", () => {
    expect(paginate(items, 9).page).toBe(3);
    expect(paginate(items, 0).page).toBe(1);
  });

  it("has one empty page when there is nothing", () => {
    expect(paginate([], 4)).toEqual({ items: [], page: 1, pageCount: 1, pageSize: 20 });
  });
});

describe("selectJobs", () => {
  it("filters, sorts and pages, and reports the unfiltered total", () => {
    const jobs = Array.from({ length: 30 }, (_, index) =>
      job({ id: `j${index}`, roleId: index % 2 === 0 ? "ml_engineer" : "genai_llm", postedAt: daysAgo(index) }),
    );
    const result = selectJobs(jobs, all({ roleId: "ml_engineer" }), NOW);
    expect(result).toMatchObject({ total: 15, page: 1, pageCount: 1, totalUnfiltered: 30 });
    expect(result.jobs[0].id).toBe("j0");

    const second = selectJobs(jobs, all({ page: 2 }), NOW);
    expect(second.jobs.map((item) => item.id)).toEqual(Array.from({ length: 10 }, (_, index) => `j${index + 20}`));
  });
});

describe("facetValues", () => {
  it("dedupes ignoring case, drops nulls, and sorts", () => {
    expect(facetValues(["Pune", null, "bengaluru", "pune", "Bengaluru"])).toEqual(["bengaluru", "Pune"]);
  });
});

describe("best match sort", () => {
  const jobs = [
    job({ id: "newest-low", postedAt: daysAgo(1) }),
    job({ id: "older-high", postedAt: daysAgo(5) }),
    job({ id: "no-skills", postedAt: daysAgo(0) }),
    job({ id: "mid", postedAt: daysAgo(3) }),
  ];
  const scores: Record<string, number | null> = { "newest-low": 20, "older-high": 90, "no-skills": null, mid: 50 };
  const score = (item: Job) => scores[item.id];

  it("reads sort from the URL and writes it back", () => {
    expect(parseJobFilters(new URLSearchParams("sort=best_match"), null).sort).toBe("best_match");
    expect(parseJobFilters(new URLSearchParams("sort=salary"), null).sort).toBe("newest");
    expect(jobsHref(all({ sort: "best_match" }))).toContain("sort=best_match");
    expect(jobsHref(all())).not.toContain("sort=");
  });

  it("ranks by score, with unscored jobs last and newest breaking ties", () => {
    const ids = selectJobs(jobs, all({ sort: "best_match" }), NOW, score).jobs.map((item) => item.id);
    expect(ids).toEqual(["older-high", "mid", "newest-low", "no-skills"]);
  });

  it("falls back to newest without a score, and ignores a score under the newest sort", () => {
    const newest = ["no-skills", "newest-low", "mid", "older-high"];
    expect(selectJobs(jobs, all({ sort: "best_match" }), NOW).jobs.map((item) => item.id)).toEqual(newest);
    expect(selectJobs(jobs, all(), NOW, score).jobs.map((item) => item.id)).toEqual(newest);
  });
});
