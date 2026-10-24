// Plans and what each one includes (docs/research/11-free-paid-tier.md,
// docs/dashboard-v2-spec.md section 7). Every feature carries a status; a
// `coming_soon` feature must never be shown as a purchasable benefit without
// its chip.

import type { FeatureFlag } from "@/types/domain";

export type PlanId = "free" | "pro" | "teams";

export type PlanConfig = {
  id: PlanId;
  name: string;
  /** Plan whose features this one includes as well. */
  includes: PlanId | null;
  features: FeatureFlag[];
  /** From the research; hidden until the owner sets final prices. */
  priceRange: { min: number; max: number; currency: "USD"; per: string } | null;
  contactOnly: boolean;
};

/** TODO(owner): flip once final prices are set. */
export const showPrices = false;

export const plans: PlanConfig[] = [
  {
    id: "free",
    name: "Free",
    includes: null,
    features: [
      { label: "The roadmap flow", status: "available" },
      { label: "Blocks 1 and 2", status: "available" },
      { label: "Concept overviews", status: "available" },
      { label: "The concept map", status: "available" },
      { label: "Jobs", status: "available" },
      { label: "Resource library", status: "available" },
      { label: "Basic progress tracking", status: "available" },
      { label: "Community discussion", status: "coming_soon" },
    ],
    priceRange: null,
    contactOnly: false,
  },
  {
    id: "pro",
    name: "Pro",
    includes: "free",
    features: [
      { label: "Blocks 3 to 6 content", status: "available" },
      // Available because every concept has a project lesson built from its
      // practiceProject (lib/data/mock/lessons.mock.ts).
      { label: "Production-grade project specs and solutions", status: "available" },
      // No quiz lessons exist yet, so this stays coming soon; a test enforces it.
      { label: "Interactive quizzes and checkpoints", status: "coming_soon" },
      { label: "Hands-on labs", status: "coming_soon" },
      { label: "AI learning assistant", status: "coming_soon" },
      { label: "Verifiable certificates", status: "coming_soon" },
    ],
    priceRange: { min: 12, max: 29, currency: "USD", per: "month" },
    contactOnly: false,
  },
  {
    id: "teams",
    name: "Teams",
    includes: "pro",
    features: [{ label: "Team management and analytics dashboard", status: "coming_soon" }],
    priceRange: { min: 19, max: 49, currency: "USD", per: "seat a month" },
    contactOnly: true,
  },
];

export const planCopy = {
  comingSoon: "Coming soon",
  contact: "Contact us",
  everythingIn: (name: string) => `Everything in ${name}, plus`,
};

export function getPlan(id: PlanId): PlanConfig {
  const plan = plans.find((item) => item.id === id);
  if (!plan) throw new Error(`Unknown plan ${id}`);
  return plan;
}
