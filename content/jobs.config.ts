// Copy for /jobs and /jobs/[id] (docs/jobs-spec.md section 7). A product person
// should be able to change any of this without opening a component.

import type { JobSeniority } from "@/types/domain";

// TODO(owner): replace with the real contact address (jobs-spec.md section 12).
// It is the "Report a problem" mailto, and later the pipeline's User-Agent contact.
export const JOBS_CONTACT_EMAIL = "jobs@prepclever.example";

export const seniorityLabels: Record<JobSeniority, string> = {
  fresher: "Entry level",
  switcher: "Career switch",
  mid: "Mid level",
  senior: "Senior",
};

export const jobsCopy = {
  title: "Jobs",
  subtext: "AI engineering roles at GCCs in India, linked to the original posting.",

  filters: {
    label: "Filter jobs",
    search: "Search",
    searchPlaceholder: "Title or company",
    searchButton: "Search",
    role: "Role",
    allRoles: "All roles",
    company: "Company",
    allCompanies: "All companies",
    city: "City",
    allCities: "All cities",
    seniority: "Seniority",
    anySeniority: "Any seniority",
    posted: "Posted",
    anyTime: "Any time",
    postedWithin: (days: number) => `Last ${days} days`,
    sort: "Sort",
    sortLabels: { newest: "Newest", best_match: "Best match" },
  },

  results: {
    heading: (total: number) => (total === 1 ? "1 job" : `${total} jobs`),
    range: (from: number, to: number, total: number, bestMatch: boolean) =>
      `Showing ${from}–${to} of ${total}, ${bestMatch ? "best match first" : "newest first"}`,
    sortNeedsAudit: "Best match needs your skill audit, so these are newest first.",
    examplesFreshness: (checked: string) =>
      `Example postings from our research, checked ${checked}. They may have closed.`,
    collectedFreshness: (updated: string) => `Updated ${updated} from company careers pages`,
    staleWarning: "These listings have not been refreshed in over 48 hours.",
  },

  card: {
    view: "View",
    viewLabel: (title: string, company: string) => `View ${title} at ${company}`,
    roleUnclassified: "Role not classified",
    cityMissing: "Location not listed",
    experienceMissing: "Experience not listed",
    posted: (date: string) => `Posted ${date}`,
    firstSeen: (date: string) => `First seen ${date}`,
    exampleNote: (checked: string) => `Example posting, may have closed. Checked ${checked}`,
    devSample: "DEV SAMPLE",
    example: "Example",
    roleSkills: "Core skills for this role",
    match: (percent: number) => `${percent}% match`,
    matchLabel: (percent: number) => `${percent}% match with your skill audit`,
  },

  /** Shown wherever a match would be, until the user has rated anything. */
  auditPrompt: "Take the skill audit to see your match",

  match: {
    heading: "Your match",
    summary: (confident: number, required: number) =>
      `You're confident in ${confident} of ${required} required ${required === 1 ? "skill" : "skills"}.`,
    gapsHeading: "Skills to close",
    gapsNote: "Each opens its concept page. The overview is free; lessons are Pro.",
    noGaps: "No gaps for your role in this posting.",
    noAuditBody: "Rate your skills once and every job shows how well you match.",
  },

  paging: {
    label: "Pages",
    previous: "Previous",
    next: "Next",
    status: (page: number, count: number) => `Page ${page} of ${count}`,
  },

  empty: {
    title: "No jobs match these filters",
    body: "Try fewer filters, or a different role or city.",
    action: "Clear filters",
  },

  firstRun: {
    title: "Jobs are being collected",
    body: "We list AI roles from GCC careers pages. Until the first listings arrive, see which companies are hiring.",
    action: "Explore companies",
    actionHref: "/companies",
  },

  error: {
    message: "Couldn't load jobs. Try again.",
    retry: "Try again",
  },

  detail: {
    back: "All jobs",
    notFoundTitle: "Job not found",
    summary: "Summary",
    summaryMissing:
      "We have no summary for this posting. It is an example from our research, so open the original listing for the details.",
    skills: "Skills",
    roleSkillsNote: (role: string) =>
      `The posting has not been read yet, so these are the core skills for ${role} from our concept map.`,
    facts: "Details",
    role: "Role",
    experience: "Experience",
    seniority: "Seniority",
    location: "Location",
    posted: "Posted",
    firstSeen: "First seen",
    lastChecked: "Last checked",
    notStated: "Not stated",
    exampleBanner: (checked: string) =>
      `Example posting from our research, checked ${checked}. It may have closed since.`,
    devSampleBanner: "DEV SAMPLE for layout testing. This is not a real job.",
    closedBanner: "This posting appears closed",
    applyCareers: (company: string) => `Apply on ${company} careers site`,
    applyBoard: (siteName: string) => `View the original posting on ${siteName}`,
    newTab: "(opens in a new tab)",
    note: "Listing collected from the company's careers page. Details may have changed; check the original posting.",
    exampleNote: "Example posting from our research. Details may have changed; check the original posting.",
    report: "Report a problem",
    reportSubject: (title: string, company: string) => `Problem with job: ${title} at ${company}`,
  },
};
