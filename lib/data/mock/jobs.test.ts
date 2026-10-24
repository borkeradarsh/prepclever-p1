// The placeholder jobs: examples only from the research base, labelled and
// dated; dev samples clearly fake and never in production.

import { afterEach, describe, expect, it, vi } from "vitest";
import { getConceptById } from "@/content/concepts";
import { roles } from "@/content/roles.config";
import { ROLE_IDS } from "@/components/auth/onboarding/types";
import { roleSkillTags } from "@/lib/jobs/skills";
import {
  buildDevSampleJobs,
  buildExampleJobs,
  DEV_SAMPLE_COUNT,
  devSamplesAllowed,
} from "./jobs.mock";

const ISO = /^\d{4}-\d{2}-\d{2}T/;

describe("example jobs", () => {
  const examples = buildExampleJobs();
  const postings = roles.flatMap((role) => role.examplePostings);

  it("are exactly the research's example postings, nothing added", () => {
    expect(examples).toHaveLength(postings.length);
    expect(examples.map((job) => job.applyUrl).sort()).toEqual(postings.map((posting) => posting.url).sort());
    for (const job of examples) {
      const posting = postings.find((item) => item.url === job.applyUrl)!;
      expect(job.title).toBe(posting.title);
      expect(job.company).toBe(posting.company);
    }
  });

  it("are labelled examples, dated with the check date, and link out over https", () => {
    for (const job of examples) {
      expect(job.kind).toBe("example");
      expect(job.applyUrl).toMatch(/^https:\/\//);
      expect(job.lastCheckedAt).toMatch(ISO);
      expect(job.postedAt).toBeNull();
      expect(job.summary).toBeNull();
      expect(job.expMin).toBeNull();
      expect(job.expMax).toBeNull();
      expect(job.skillsBasis).toBe("role");
    }
  });

  it("have unique ids", () => {
    expect(new Set(examples.map((job) => job.id)).size).toBe(examples.length);
  });
});

describe("roleSkillTags", () => {
  it("gives up to five real core concepts for every role", () => {
    for (const roleId of ROLE_IDS) {
      const tags = roleSkillTags(roleId);
      expect(tags.length, roleId).toBeGreaterThan(0);
      expect(tags.length, roleId).toBeLessThanOrEqual(5);
      for (const id of tags) expect(getConceptById(id)?.levels[roleId], `${roleId}:${id}`).toBe(2);
    }
  });
});

describe("dev samples", () => {
  const now = new Date("2026-10-24T12:00:00.000Z");
  const samples = buildDevSampleJobs(now);

  afterEach(() => vi.unstubAllEnvs());

  it("are labelled DEV SAMPLE in the title and company, and link to example.com", () => {
    expect(samples).toHaveLength(DEV_SAMPLE_COUNT);
    for (const job of samples) {
      expect(job.kind).toBe("dev_sample");
      expect(job.title).toContain("DEV SAMPLE");
      expect(job.company).toContain("DEV SAMPLE");
      expect(job.applyUrl.startsWith("https://example.com/")).toBe(true);
    }
  });

  it("are deterministic and fill more than two pages", () => {
    expect(buildDevSampleJobs(now)).toEqual(samples);
    expect(samples.filter((job) => job.status === "active").length).toBeGreaterThan(40);
  });

  it("are never allowed in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(devSamplesAllowed()).toBe(false);
    vi.stubEnv("NODE_ENV", "development");
    expect(devSamplesAllowed()).toBe(true);
  });
});
