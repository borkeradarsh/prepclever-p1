// Navigation for the public marketing pages. Separate from content/nav.config.ts,
// which drives the signed-in app shell. One list feeds the desktop bar and the
// mobile sheet, so they cannot drift apart.

export type MarketingNavLink = {
  label: string;
  href: string;
  description?: string;
};

export type MarketingNavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; label: string; id: string; items: MarketingNavLink[] };

export const marketingNav: MarketingNavItem[] = [
  { kind: "link", label: "Companies", href: "/companies" },
  {
    kind: "menu",
    label: "Roles",
    id: "roles",
    items: [
      {
        label: "GenAI / LLM Engineer",
        href: "/roles#genai_llm",
        description: "RAG, agents and evals on top of language models",
      },
      {
        label: "ML / MLOps Engineer",
        href: "/roles#ml_mlops",
        description: "Train, deploy and monitor models in production",
      },
      {
        label: "AI Platform Engineer",
        href: "/roles#ai_platform",
        description: "The infrastructure AI teams build on",
      },
      {
        label: "AI Data Engineer",
        href: "/roles#ai_data",
        description: "Pipelines, embeddings and data quality for AI",
      },
      {
        label: "Backend → AI",
        href: "/roles#backend_to_ai",
        description: "A backend engineer's route into AI work",
      },
      { label: "Compare all roles", href: "/roles" },
    ],
  },
  { kind: "link", label: "Roadmap", href: "/#blueprint" },
  {
    kind: "menu",
    label: "Tools",
    id: "tools",
    items: [
      {
        label: "Resume Evaluate",
        href: "/tools/resume-evaluate",
        description: "Score your resume against a real GCC job description",
      },
    ],
  },
];

export const marketingNavCopy = {
  brand: "PREPCLEVER",
  brandAriaLabel: "PrepClever home",
  primaryNavLabel: "Main navigation",
  login: { label: "Log in", href: "/login" },
  getStarted: { label: "Get started", href: "/signup" },
  openMenu: "Open navigation menu",
  closeMenu: "Close navigation menu",
};

export const footerNav: { title: string; links: MarketingNavLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Companies", href: "/companies" },
      { label: "Roles", href: "/roles" },
      { label: "The blueprint", href: "/#blueprint" },
      { label: "The GCC growth story", href: "/#growth" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Resume Evaluate", href: "/tools/resume-evaluate" },
      { label: "Readiness check", href: "/signup" },
      { label: "Your roadmap", href: "/signup" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Get started", href: "/signup" },
      { label: "Log in", href: "/login" },
      { label: "Plans", href: "/upgrade" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#growth" },
      { label: "Contact", href: "mailto:hello@prepclever.com" },
    ],
  },
];

export const footerCopy = {
  tagline: "The end-to-end AI engineering career roadmap for GCCs in India.",
  legal: "Privacy · Terms · Accessibility",
  copyright: `© ${new Date().getFullYear()} PrepClever`,
};
