// Every word on the marketing landing page. A product person changes copy here
// without opening a component. Graphics are chosen by the `graphic` key, which
// maps to a component in components/graphics/ — the config never imports React.
//
// Provenance rules for this file:
//   - Numbers under `growth` are sourced and the source is shown on the page.
//   - Items marked UNVERIFIED are marketing claims the product has not yet
//     backed with data. Confirm or remove them before launch.
//   - Items marked PLACEHOLDER are stand-ins and must be replaced with real,
//     consented content before launch.

export type MetricTicker = {
  value: string;
  label: string;
};

export type PillarGraphic = "ownership" | "ai-stack" | "rewards";

export type Pillar = {
  id: string;
  eyebrow: string;
  title: string;
  graphic: PillarGraphic;
  points: { term: string; detail: string }[];
};

export type GrowthStat = {
  value: string;
  unit?: string;
  label: string;
};

/**
 * A city on the India map. Position is given as real latitude and longitude:
 * the map component projects it with the same function that built the
 * coastline, so dots and outline cannot drift apart. Never store pixel
 * coordinates here.
 */
export type MapHotspot = {
  city: string;
  lat: number;
  lon: number;
  /**
   * Share of GCC hiring, H1 2026. Drives the dot area. Zero marks a tier-2
   * city: the research gives 15% for tier-2 cities combined, not per city.
   */
  share: number;
  /** Year-on-year growth, where the source reports it for that city. */
  growth: string;
};

export type BlueprintBlock = {
  id: string;
  index: string;
  title: string;
  summary: string;
  points: { term: string; detail: string }[];
};

export type Testimonial = {
  quote: string;
  name: string;
  journey: string;
  company: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const hero = {
  title: "The complete career roadmap for AI engineering at GCCs",
  description:
    "PrepClever turns the scattered advice about Global Capability Centres into one sequenced plan: what the roles actually need, where you stand against them, and the exact next step.",
  primaryAction: { label: "Get started free", href: "/signup" },
  secondaryAction: { label: "See the blueprint", href: "#blueprint" },
  note: "Free to start. No card. Two minutes to your first plan.",
};

/** UNVERIFIED — product claims, not measured. Confirm before launch. */
export const tickerMetrics: MetricTicker[] = [
  { value: "1,000+", label: "learners following this roadmap" },
  { value: "3,000+", label: "GCC jobs added in the past month" },
  { value: "1,000+", label: "pieces of curated content" },
  { value: "5,000+", label: "resumes audited" },
];

export const logoWall = {
  label: "Roles tracked at GCCs hiring AI talent in India",
  /** Wordmarks, not trademarks: swap in licensed SVG logos before launch. */
  companies: [
    "Walmart",
    "Target",
    "JPMorgan Chase",
    "Goldman Sachs",
    "Shell",
    "Lowe's",
    "Wells Fargo",
    "UBS",
    "Vanguard",
    "Costco",
    "Eli Lilly",
    "Medtronic",
    "Best Buy",
    "Ericsson",
    "Zeiss",
    "DAZN",
    "McDonald's",
    "Truist",
    "Southwest Airlines",
    "ArcelorMittal",
  ],
};

export const pillarsIntro = {
  eyebrow: "Why a GCC",
  title: "A different kind of engineering job",
  description:
    "Not an offshore delivery centre. A GCC is the global enterprise itself, operating from India — which changes what you own, what you build, and what you are paid.",
};

export const pillars: Pillar[] = [
  {
    id: "ownership",
    eyebrow: "01 — Ownership",
    title: "Global ownership and end-to-end impact",
    graphic: "ownership",
    points: [
      {
        term: "Direct product ownership",
        detail:
          "Shift from short-term client delivery or vendor execution to owning the full lifecycle of enterprise products used by millions worldwide.",
      },
      {
        term: "Core business integration",
        detail:
          "Work directly on high-priority strategic initiatives that sit at the centre of the global enterprise's core revenue and operating models.",
      },
      {
        term: "A seat at the global table",
        detail:
          "Collaborate daily with global executives, product architects and functional leads, without intermediate vendor layers.",
      },
    ],
  },
  {
    id: "engineering",
    eyebrow: "02 — Craft",
    title: "Cutting-edge AI engineering",
    graphic: "ai-stack",
    points: [
      {
        term: "Enterprise-grade data and infrastructure",
        detail:
          "Build, fine-tune and deploy AI/ML models on petabyte-scale real-world datasets using top-tier enterprise cloud and GPU clusters.",
      },
      {
        term: "Deep industry problems",
        detail:
          "Solve complex, high-stakes domain problems in healthcare AI, global supply chain optimisation, algorithmic trading and enterprise automation.",
      },
      {
        term: "Production-grade AI, end to end",
        detail:
          "Experience the complete lifecycle — research and prototyping through MLOps, LLMOps, model monitoring and governance at scale.",
      },
    ],
  },
  {
    id: "rewards",
    eyebrow: "03 — Rewards",
    title: "Top-tier total rewards and compensation growth",
    graphic: "rewards",
    points: [
      {
        term: "Competitive global-benchmark pay",
        detail:
          "Receive top-quartile base salaries that rival top product companies and global tech giants.",
      },
      {
        term: "Rewards beyond base",
        detail:
          "Total rewards are structured globally: performance bonuses, long-term incentives and benefits set against the parent company's bands rather than a local services grid.",
      },
      {
        term: "A ladder that keeps going",
        detail:
          "Progression is measured by the scope of what you own, so senior individual-contributor and global leadership tracks both stay open from India.",
      },
    ],
  },
];

export const growth = {
  eyebrow: "The growth story",
  title: "India is where the global enterprise builds its AI",
  description:
    "The GCC wave is not a forecast any more. It is the single largest concentration of enterprise AI hiring in the country.",
  stats: [
    { value: "2,117", label: "GCCs in India, running 3,728 centres" },
    { value: "2.36", unit: "M", label: "people employed across those centres" },
    { value: "5.1", unit: "lakh", label: "GCC hires projected in 2026" },
    { value: "64", unit: "%", label: "of new GCC roles need AI, data or automation skills" },
    { value: "+38", unit: "%", label: "year-on-year growth in AI and data hiring" },
    { value: "506", label: "Forbes Global 2000 firms with an India centre" },
  ] satisfies GrowthStat[],
  map: {
    title: "Where the hiring happens",
    description:
      "Six cities hold 92% of India's GCCs. Tier-2 cities are the fastest-growing band from a small base.",
    hotspots: [
      { city: "Bengaluru", lat: 12.97, lon: 77.59, share: 30, growth: "+10%" },
      { city: "Hyderabad", lat: 17.39, lon: 78.49, share: 15, growth: "+15%" },
      { city: "Pune", lat: 18.52, lon: 73.86, share: 12, growth: "+11%" },
      { city: "Mumbai", lat: 19.08, lon: 72.88, share: 11, growth: "+8%" },
      { city: "Chennai", lat: 13.08, lon: 80.27, share: 9, growth: "" },
      { city: "Delhi NCR", lat: 28.61, lon: 77.21, share: 8, growth: "" },
      { city: "Ahmedabad", lat: 23.03, lon: 72.58, share: 0, growth: "" },
      { city: "Indore", lat: 22.72, lon: 75.86, share: 0, growth: "" },
      { city: "Coimbatore", lat: 11.02, lon: 76.96, share: 0, growth: "" },
      { city: "Kochi", lat: 9.93, lon: 76.27, share: 0, growth: "" },
    ] satisfies MapHotspot[],
    legend: [
      { label: "Share of GCC hiring, H1 2026", kind: "share" as const },
      { label: "Tier-2 city — 15% combined, not per city", kind: "tier2" as const },
    ],
    caption:
      "Share of GCC hiring by city, H1 2026. Source: foundit Insights Tracker via Business Today. Map is illustrative and not to scale; boundary as depicted by the Survey of India.",
    /** Shown in the dot tooltips, where there is no room for the full caption. */
    tooltipSource: "foundit, H1 2026",
    alt: {
      title: "Share of GCC hiring across India, first half of 2026",
      description:
        "A map of India marking ten cities. Bengaluru leads with 30% of GCC hiring, then Hyderabad 15%, Pune 12%, Mumbai 11%, Chennai 9% and Delhi NCR 8%. Ahmedabad, Indore, Coimbatore and Kochi are marked as tier-2 cities, which together account for 15%.",
    },
  },
  source:
    "Sources: Nasscom–Zinnov India GCC Landscape 2026; foundit Insights Tracker, H1 2026.",
};

export const blueprint = {
  id: "blueprint",
  eyebrow: "The blueprint",
  title: "The complete blueprint to fast-track your next role",
  description:
    "Six blocks, in order. Each one has a clear output, so you always know what you are producing — not just what you are studying.",
  blocks: [
    {
      id: "market-intelligence",
      index: "01",
      title: "Market intelligence and role alignment",
      summary: "Know exactly what you are aiming at before you spend a week studying.",
      points: [
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
    },
    {
      id: "gap-analysis",
      index: "02",
      title: "Gap analysis and baseline assessment",
      summary: "An honest starting line, measured against real job requirements.",
      points: [
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
    },
    {
      id: "upskilling",
      index: "03",
      title: "Targeted upskilling and project building",
      summary: "High-yield study, and proof that you can ship.",
      points: [
        {
          term: "Curated learning",
          detail:
            "Study expert-curated resources focused strictly on high-value skills, rather than generic tutorials.",
        },
        {
          term: "Proof-of-work creation",
          detail:
            "Build one or two production-grade, end-to-end projects that mirror real enterprise problems.",
        },
      ],
    },
    {
      id: "positioning",
      index: "04",
      title: "Positioning and personal branding",
      summary: "Make the work you have done legible in six seconds.",
      points: [
        {
          term: "Resume tailoring",
          detail:
            "Optimise your resume with quantified achievements and ATS-friendly keyword alignment.",
        },
        {
          term: "Profile optimisation",
          detail:
            "Update LinkedIn, GitHub and your portfolio so they reflect the role you are targeting and the narrative behind it.",
        },
      ],
    },
    {
      id: "referrals",
      index: "05",
      title: "Tactical referral and application strategy",
      summary: "Reach a human before the portal reaches a filter.",
      points: [
        {
          term: "Direct outreach",
          detail:
            "Target internal recruiters, engineering managers and alumni for warm referrals instead of relying on cold portal applications.",
        },
        {
          term: "Strategic job hunt",
          detail:
            "Apply deliberately across premium job boards, executive search firms and company career portals.",
        },
      ],
    },
    {
      id: "interview",
      index: "06",
      title: "Interview preparation",
      summary: "Rehearse the rounds you will actually sit.",
      points: [
        {
          term: "Technical mastery",
          detail:
            "Work through real interview experiences and questions on data structures, domain coding, system design and architecture.",
        },
        {
          term: "Behavioural and leadership alignment",
          detail:
            "Prepare structured STAR stories on leadership, cross-functional collaboration and problem-solving.",
        },
      ],
    },
  ] satisfies BlueprintBlock[],
  cta: {
    eyebrow: "Step 1 of 3",
    title: "It starts with one question",
    description:
      "Tell us where you are today and the six blocks reorder themselves around your gaps. Pick your starting point to create your account.",
    /** Mirrors the first onboarding question, so the first click is never wasted. */
    options: [
      { label: "Student or final year", detail: "In college or about to graduate" },
      { label: "IT services company", detail: "At a services or consulting firm" },
      { label: "Product or tech role", detail: "At a product company or another tech job" },
      { label: "Switching careers", detail: "Coming from a non-technical background" },
    ],
    href: "/signup",
    footnote: "Already have an account?",
    footnoteAction: { label: "Log in", href: "/login" },
  },
};

export const testimonials = {
  eyebrow: "Outcomes",
  title: "From service delivery to global ownership",
  /** PLACEHOLDER — replace with real, consented quotes before launch. */
  items: [
    {
      quote:
        "I had five years of ticket work and no way to show it mattered. The gap analysis told me what was actually missing, and the project block gave me something to point at in every interview.",
      name: "Service-company engineer",
      journey: "Backend → GenAI engineer",
      company: "Retail GCC, Bengaluru",
    },
    {
      quote:
        "The hardest part was not learning MLOps. It was knowing which half of MLOps the job description meant. Having the role mapped to real postings saved me months.",
      name: "Final-year student",
      journey: "Student → ML engineer",
      company: "Healthcare GCC, Hyderabad",
    },
    {
      quote:
        "The resume audit was blunt in a way nobody at my company had been. Three rewrites later I was getting callbacks from the same companies that ignored me before.",
      name: "Services consultant",
      journey: "Consultant → AI data engineer",
      company: "Manufacturing GCC, Pune",
    },
    {
      quote:
        "The referral block changed my hit rate completely. I stopped applying into portals and started talking to the people who owned the team.",
      name: "Product-company engineer",
      journey: "Platform → AI platform engineer",
      company: "Financial services GCC, Hyderabad",
    },
    {
      quote:
        "I came from a non-technical background and expected to be told it was impossible. Instead I got a sequence, and the first block took an evening.",
      name: "Career switcher",
      journey: "Operations → AI data engineer",
      company: "Logistics GCC, Chennai",
    },
    {
      quote:
        "Knowing the compensation benchmark before the call meant I negotiated instead of accepting. That one conversation paid for everything.",
      name: "Service-company engineer",
      journey: "Data engineer → ML engineer",
      company: "Insurance GCC, Bengaluru",
    },
  ] satisfies Testimonial[],
};

export const faq: FaqItem[] = [
  {
    question: "What exactly is a GCC?",
    answer:
      "A Global Capability Centre is a global company's own engineering and operations arm in India — not a vendor or an outsourcing partner. You are employed by the enterprise itself, and you own products end to end rather than delivering a scoped contract.",
  },
  {
    question: "Who is PrepClever for?",
    answer:
      "Students and final-year engineers, service-company engineers who want product ownership, product-company engineers moving into AI, and career switchers with a technical bent. The roadmap adapts to which of those you are.",
  },
  {
    question: "Do I need an AI background to start?",
    answer:
      "No. The baseline assessment is built to place you honestly, including at zero. What changes is the length of block three, not whether you can start.",
  },
  {
    question: "How is this different from a course platform?",
    answer:
      "Courses teach a subject. The blueprint runs a job search: market research, gap analysis, curated study, positioning, referrals and interviews, in sequence, with an output at every block.",
  },
  {
    question: "How long does the roadmap take?",
    answer:
      "It depends on your starting point and the hours you can commit. The plan you get after onboarding shows the stages and what each one produces, so you can pace it against your own calendar.",
  },
  {
    question: "Is it free?",
    answer:
      "Getting started, your roadmap and the first lessons in every stage are free. A paid plan opens every lesson and the full detail inside each stage. Pricing has not been set yet.",
  },
  {
    question: "Where do your GCC numbers come from?",
    answer:
      "Published industry research — Nasscom–Zinnov's India GCC Landscape and the foundit Insights Tracker, among others. Every figure on this page is sourced, and we date the ones that move.",
  },
];

export const closingCta = {
  title: "Your next role is a sequence, not a scramble",
  description:
    "Answer three questions and PrepClever builds the roadmap around where you actually are. You can change any answer later.",
  primaryAction: { label: "Create your free account", href: "/signup" },
  secondaryAction: { label: "Log in", href: "/login" },
  aside: {
    title: "Not ready yet?",
    description:
      "Start with the companies list and see which GCCs are hiring for the role you want.",
    action: { label: "Browse companies", href: "/companies" },
  },
};
