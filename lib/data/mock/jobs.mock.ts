// PLACEHOLDER job data until the careers-page pipeline (docs/jobs-spec.md,
// Session J1) has run. Two kinds, both labelled wherever they are shown:
//
// 1. Examples: the live example postings from docs/research/02-roles.md, read
//    from content/roles.config.ts (which already transcribes that table, with its
//    check date). Nothing is invented: the research gives title, company, link
//    and role only, so city, experience, posting date and summary stay null
//    unless the posting's own title or link states them. Skill tags are the
//    role's core concepts, marked skillsBasis "role".
// 2. DEV SAMPLE entries, generated for layout testing (paging, filters). They
//    exist only outside production; see devSamplesAllowed.

import { roles } from "@/content/roles.config";
import { roleSkillTags } from "@/lib/jobs/skills";
import type { ExamplePosting, Job, JobSeniority, RoleId } from "@/types/domain";

/**
 * Facts read off a posting's own title or URL, nothing more. Keyed by URL.
 * Seniority is set only where the title says Staff, Senior, Sr, Lead or
 * Principal; ladder titles like "Associate" or "Engineer III" are left null
 * because their level differs by company.
 */
const fromTitle: Record<string, { seniority?: JobSeniority; city?: string }> = {
  "https://in.linkedin.com/jobs/view/ind-staff-data-scientist-mle-at-walmart-global-tech-india-4475810680": {
    seniority: "senior",
  },
  "https://corporate.target.com/jobs/w09/18/sr-ai-engineer-item-science": { seniority: "senior" },
  // The listing title ends "Associate, Hyderabad".
  "https://in.linkedin.com/jobs/view/the-core-engineering-search-entity-model-eng-associate-hyderabad-at-goldman-sachs-4379689055":
    { city: "Hyderabad" },
  "https://in.linkedin.com/jobs/view/senior-machine-learning-engineer-at-eli-lilly-and-company-4472027234": {
    seniority: "senior",
  },
  "https://corporate.target.com/jobs/w09/43/lead-engineer-gen-ai": { seniority: "senior" },
  "https://careers.nike.com/en/principal-software-engineer-ai-itc/job/R-86382": { seniority: "senior" },
  "https://in.linkedin.com/jobs/view/pr-d-%E2%80%93-technical-lead-architect-%E2%80%93-semantic-layer-agentic-ai-at-eli-lilly-and-company-4457092892":
    { seniority: "senior" },
};

/** A stable, URL-safe id from the posting's link. */
export function exampleJobId(url: string): string {
  let hash = 0;
  for (const char of url) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `example-${hash.toString(36)}`;
}

function exampleJob(posting: ExamplePosting, roleId: RoleId): Job {
  const known = fromTitle[posting.url] ?? {};
  const checked = `${posting.checkedOn}T00:00:00.000Z`;
  return {
    id: exampleJobId(posting.url),
    kind: "example",
    title: posting.title,
    company: posting.company,
    city: known.city ?? null,
    roleId,
    seniority: known.seniority ?? null,
    expMin: null,
    expMax: null,
    conceptIds: roleSkillTags(roleId),
    skillsBasis: "role",
    summary: null,
    applyUrl: posting.url,
    postedAt: null,
    firstSeenAt: checked,
    lastCheckedAt: checked,
    status: "active",
  };
}

/** Every example posting in the research base, one job each. */
export function buildExampleJobs(): Job[] {
  return roles.flatMap((role) => role.examplePostings.map((posting) => exampleJob(posting, role.id)));
}

// DEV SAMPLE entries

export const DEV_SAMPLE_COUNT = 57;
export const DEV_SAMPLE_PREFIX = "dev-sample-";

/** Read at call time, so a production build can never produce samples. */
export function devSamplesAllowed(): boolean {
  return process.env.NODE_ENV !== "production";
}

const SAMPLE_COMPANIES = ["A", "B", "C", "D", "E", "F"].map((letter) => `DEV SAMPLE Company ${letter}`);
const SAMPLE_CITIES = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Gurugram", null];
const SAMPLE_SENIORITY: (JobSeniority | null)[] = ["fresher", "switcher", "mid", "senior", null];
const SAMPLE_EXPERIENCE: [number | null, number | null][] = [[0, 2], [2, 5], [3, 6], [5, 8], [8, null], [null, null]];
/** Every eighth sample has no role, as a low-confidence pipeline result would. */
const sampleRole = (index: number): RoleId | null => (index % 8 === 7 ? null : roles[index % roles.length].id);

/**
 * Deterministic, clearly fake jobs spread over 45 days, every role, city,
 * seniority and experience shape, so paging and every filter can be seen.
 */
export function buildDevSampleJobs(now: Date, count = DEV_SAMPLE_COUNT): Job[] {
  return Array.from({ length: count }, (_, index) => {
    const roleId = sampleRole(index);
    const role = roleId ? roles.find((item) => item.id === roleId) : undefined;
    const [expMin, expMax] = SAMPLE_EXPERIENCE[index % SAMPLE_EXPERIENCE.length];
    const posted = new Date(now.getTime() - ((index * 7) % 46) * 24 * 60 * 60 * 1000).toISOString();
    return {
      id: `${DEV_SAMPLE_PREFIX}${index + 1}`,
      kind: "dev_sample",
      title: `DEV SAMPLE ${index + 1}: ${role?.titleVariants[index % role.titleVariants.length] ?? "Unclassified AI role"}`,
      company: SAMPLE_COMPANIES[index % SAMPLE_COMPANIES.length],
      city: SAMPLE_CITIES[index % SAMPLE_CITIES.length],
      roleId,
      seniority: SAMPLE_SENIORITY[index % SAMPLE_SENIORITY.length],
      expMin,
      expMax,
      conceptIds: roleId ? roleSkillTags(roleId) : [],
      skillsBasis: "posting",
      summary: "DEV SAMPLE for layout testing only. This is not a real job and the link goes nowhere useful.",
      applyUrl: `https://example.com/dev-sample/${index + 1}`,
      postedAt: posted,
      firstSeenAt: posted,
      lastCheckedAt: now.toISOString(),
      status: index % 19 === 18 ? "closed" : "active",
    };
  });
}
