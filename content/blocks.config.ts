// The six roadmap blocks: the one definition the landing blueprint, onboarding
// payoff, sidebar and dashboard read (docs/dashboard-v2-spec.md section 5).
//
// Titles, summaries and bullets are the owner's block list (formerly in
// content/landing.config.ts). Items follow the spec's table. Concept topics in
// Block 3 are not listed here: they come from the concept map per role.
//
// An item's `access` is optional: without it the item takes its block's tier
// from ACCESS_RULES in lib/access.ts.

import type { Access, BlockId, ItemKind, ItemStatus } from "@/types/domain";

export type BlockItemConfig = {
  slug: string;
  title: string;
  kind: ItemKind;
  status: ItemStatus;
  access?: Access;
  /** TODO(owner): set estimates. Null renders no duration. */
  estimatedMinutes: number | null;
  extras?: { label: string; status: ItemStatus }[];
};

export type BlockConfig = {
  slug: BlockId;
  title: string;
  shortTitle: string;
  summary: string;
  bullets: { term: string; detail: string }[];
  items: BlockItemConfig[];
};

const item = (
  slug: string,
  title: string,
  kind: ItemKind,
  status: ItemStatus = "available",
  extras?: BlockItemConfig["extras"],
): BlockItemConfig => ({ slug, title, kind, status, estimatedMinutes: null, ...(extras ? { extras } : {}) });

export const blocks: BlockConfig[] = [
  {
    slug: "market",
    title: "Market intelligence and role alignment",
    shortTitle: "Market and role",
    summary: "Know exactly what you are aiming at before you spend a week studying.",
    bullets: [
      {
        term: "Understand the landscape",
        detail:
          "Research specific roles, compensation benchmarks, core technology stacks and domain expectations for your target industry.",
      },
      {
        term: "Target mapping",
        detail:
          "Identify target tiers, companies and exact job descriptions, so you know what hiring managers actually prioritise.",
      },
    ],
    items: [
      item("landscape", "The GCC landscape", "guide"),
      item("your-role", "Your target role", "role-page"),
      item("target-companies", "Target companies", "directory"),
    ],
  },
  {
    slug: "gap-analysis",
    title: "Gap analysis and baseline assessment",
    shortTitle: "Gap analysis",
    summary: "An honest starting line, measured against real job requirements.",
    bullets: [
      {
        term: "Skill audit",
        detail:
          "Benchmark your current technical skills, project portfolio and domain experience against real job requirements.",
      },
      {
        term: "Identify gaps",
        detail:
          "Pinpoint missing competencies across fundamental, intermediate and advanced requirements — system design, MLOps, domain knowledge.",
      },
    ],
    items: [item("skill-audit", "Skill audit", "checklist"), item("gap-report", "Gap report", "report")],
  },
  {
    slug: "upskilling",
    title: "Targeted upskilling and project building",
    shortTitle: "Upskilling",
    summary: "High-yield study, and proof that you can ship.",
    bullets: [
      {
        term: "Curated learning",
        detail: "Study expert-curated resources focused strictly on high-value skills, rather than generic tutorials.",
      },
      {
        term: "Proof-of-work creation",
        detail: "Build one or two production-grade, end-to-end projects that mirror real enterprise problems.",
      },
    ],
    // The concept map is free to everyone (ACCESS_RULES.freePreview), even
    // though it sits inside a Pro block.
    items: [{ ...item("concept-map", "Concept map", "map"), access: "free" }, item("track-plan", "Your track plan", "guide")],
  },
  {
    slug: "positioning",
    title: "Positioning and personal branding",
    shortTitle: "Positioning",
    summary: "Make the work you have done legible in six seconds.",
    bullets: [
      {
        term: "Resume tailoring",
        detail: "Optimise your resume with quantified achievements and ATS-friendly keyword alignment.",
      },
      {
        term: "Profile optimisation",
        detail:
          "Update LinkedIn, GitHub and your portfolio so they reflect the role you are targeting and the narrative behind it.",
      },
    ],
    items: [
      item("resume", "Resume", "checklist"),
      item("linkedin", "LinkedIn", "checklist"),
      item("github", "GitHub", "checklist"),
      item("resume-evaluate", "Resume Evaluate", "tool", "coming_soon"),
    ],
  },
  {
    slug: "referrals",
    title: "Tactical referral and application strategy",
    shortTitle: "Referrals",
    summary: "Reach a human before the portal reaches a filter.",
    bullets: [
      {
        term: "Direct outreach",
        detail:
          "Target internal recruiters, engineering managers and alumni for warm referrals instead of relying on cold portal applications.",
      },
      {
        term: "Strategic job hunt",
        detail: "Apply deliberately across premium job boards, executive search firms and company career portals.",
      },
    ],
    items: [
      item("where-to-apply", "Where to apply", "directory"),
      item("referral-outreach", "Referral outreach", "guide", "coming_soon"),
      item("application-tracker", "Application tracker", "tool", "coming_soon"),
    ],
  },
  {
    slug: "interviews",
    title: "Interview preparation",
    shortTitle: "Interviews",
    summary: "Rehearse the rounds you will actually sit.",
    bullets: [
      {
        term: "Technical mastery",
        detail:
          "Work through real interview experiences and questions on data structures, domain coding, system design and architecture.",
      },
      {
        term: "Behavioural and leadership alignment",
        detail: "Prepare structured STAR stories on leadership, cross-functional collaboration and problem-solving.",
      },
    ],
    items: [
      // The owner's Block 6 pages (content/interviews.config.ts). The earlier
      // interview-loop, prep-by-round, star-stories and interview-pillars items
      // were retired; their progress keys stay in RETIRED_ITEM_KEYS.
      item("interview-process", "Interview process (general)", "guide"),
      item("interview-companies", "Interview process (specific)", "guide"),
      item("dos-and-donts", "Do's and don'ts", "guide"),
    ],
  },
];

/** The chip each tier shows. */
export const tierLabels: Record<Access, string> = { free: "Free", paid: "Pro" };

export const statusLabels: Record<ItemStatus, string> = { available: "Available", coming_soon: "Coming soon" };

/** Onboarding's "Start with Block 1" and /start's first-time destination. */
export const firstItem = { block: "market" as BlockId, item: "your-role" };

export function getBlockConfig(slug: string): BlockConfig | null {
  return blocks.find((block) => block.slug === slug) ?? null;
}
