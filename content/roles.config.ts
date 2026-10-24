// The seven target roles: the one definition landing, onboarding, the sidebar
// and the dashboard all read (docs/dashboard-v2-spec.md section 3).
//
// Sources: docs/research/02-roles.md for title variants, years, background, pay
// and postings; content/concept-map.data.json for the one-line descriptions
// (copied, not imported, so client components do not ship the whole concept
// map; content/roles.config.test.ts fails if they drift);
// the onboarding card copy is the spec's table. Research as of 2026-10-20.
//
// TODO(verify): every pay band is staffing-firm survey, vendor or self-reported
// data. They stay `verified: false` and are always shown as approximate.

import type { ExamplePosting, PayBand, Role, RoleId } from "@/types/domain";

const CHECKED_ON = "2026-10-20";

const teamLease = (label: string): PayBand => ({
  label,
  sourceLabel: "Source: TeamLease Digital, FY2025 (survey averages)",
  sourceUrl:
    "https://cxotoday.com/media-coverage/gccs-offering-upto-20-higher-salaries-than-it-services-significant-investments-in-ai-ml-cybersecurity-and-data-management-in-fy2025-reveals-teamlease-digitals-latest-report/",
  checkedOn: CHECKED_ON,
  verified: false,
  approximate: true,
});

const levelsFyi = (label: string): PayBand => ({
  label,
  sourceLabel: "Source: Levels.fyi (self-reported total comp)",
  sourceUrl: "https://www.levels.fyi/t/software-engineer/focus/ml-ai/locations/india.md",
  checkedOn: CHECKED_ON,
  verified: false,
  approximate: true,
});

const zyoin = (label: string): PayBand => ({
  label,
  sourceLabel: "Source: Zyoin (vendor data)",
  sourceUrl: "https://www.cxodigitalpulse.com/the-salary-race-in-indias-gccs-is-over-the-skills-chase-has-begun/",
  checkedOn: CHECKED_ON,
  verified: false,
  approximate: true,
});

/** For figures the research lists without naming where they came from. */
const unattributed = (label: string): PayBand => ({
  label,
  sourceLabel: "Source not stated in the research base",
  checkedOn: CHECKED_ON,
  verified: false,
  approximate: true,
});

const posting = (title: string, company: string, url: string): ExamplePosting => ({
  title,
  company,
  url,
  checkedOn: CHECKED_ON,
});

/** Seniority ladders differ by parent company, not by role (02-roles.md). */
export const seniorityLadders: string[] = [
  "Walmart: SWE II (P2) → SWE III (P3) → Senior → Staff → Principal → Distinguished",
  "Banks (JPMorgan, Goldman Sachs): Analyst → Associate → Senior Associate → VP → Director",
  "Target, Lowe's: L3/L4 → L5 Senior → L6 Lead",
];

export const roles: Role[] = [
  {
    id: "ml_engineer",
    title: "ML Engineer",
    cardDescription: "Build, train and ship ML models to production",
    shortDescription: "Builds, trains and ships models into production systems.",
    titleVariants: ["ML Engineer", "Sr AI Engineer", "Staff Data Scientist (MLE)", "Applied AI ML Associate"],
    yoeRange: "0–2 entry, 4–8 senior, 9+ staff",
    typicalBackground: "BTech/MTech CS; SWE or DS moving into production ML",
    payBands: [teamLease("About 8 LPA at entry, about 43 LPA at 8+ years"), levelsFyi("India median about 28 LPA")],
    ladderNotes: seniorityLadders,
    examplePostings: [
      posting(
        "Staff Data Scientist (MLE)",
        "Walmart",
        "https://in.linkedin.com/jobs/view/ind-staff-data-scientist-mle-at-walmart-global-tech-india-4475810680",
      ),
      posting("Sr AI Engineer", "Target", "https://corporate.target.com/jobs/w09/18/sr-ai-engineer-item-science"),
    ],
    minYears: 0,
  },
  {
    id: "genai_llm",
    title: "GenAI / LLM Engineer",
    cardDescription: "Build apps on LLMs: RAG, agents, evals",
    shortDescription: "Builds products on foundation models: prompting, RAG, agents, fine-tuning and evals.",
    titleVariants: ["GenAI Engineer", "SWE III – Python LLM Engineer", "Lead AI Engineer", "Forward Deployed AI Engineer"],
    yoeRange: "3–8",
    typicalBackground: "Python/backend SWE plus LLM projects; NLP converts",
    payBands: [teamLease("11 LPA at 0–2 years, 35 LPA at 6–8 years; senior 58–60 LPA")],
    ladderNotes: seniorityLadders,
    examplePostings: [
      posting(
        "Software Engineer III – Python LLM Engineer",
        "JPMorganChase",
        "https://in.linkedin.com/jobs/view/software-engineer-iii-python-llm-engineer-at-jpmorganchase-4473993908",
      ),
      posting(
        "Associate",
        "Goldman Sachs",
        "https://in.linkedin.com/jobs/view/the-core-engineering-search-entity-model-eng-associate-hyderabad-at-goldman-sachs-4379689055",
      ),
    ],
    minYears: 3,
  },
  {
    id: "ai_platform_mlops",
    title: "AI Platform / MLOps",
    cardDescription: "Run the infrastructure that serves AI models",
    shortDescription: "Runs the infrastructure that trains, deploys and monitors models reliably.",
    titleVariants: ["MLOps Engineer", "ML Platform Engineer", "SWE 2 – MLOps"],
    yoeRange: "4–8",
    typicalBackground: "DevOps, SRE, cloud or data engineers",
    payBands: [teamLease("Senior 58–60 LPA; ML Platform Architect about 95 LPA at 15 years")],
    ladderNotes: seniorityLadders,
    examplePostings: [
      posting(
        "Software Engineer 2 – MLOps",
        "Costco IT",
        "https://in.linkedin.com/jobs/view/software-engineer-2-mlops-t500-30086-at-costco-it-4478789304",
      ),
      posting(
        "Senior Machine Learning Engineer",
        "Eli Lilly",
        "https://in.linkedin.com/jobs/view/senior-machine-learning-engineer-at-eli-lilly-and-company-4472027234",
      ),
    ],
    minYears: 4,
  },
  {
    id: "ai_data_engineer",
    title: "AI Data Engineer",
    cardDescription: "Build the data pipelines behind AI",
    shortDescription: "Builds the pipelines and datasets that models learn from and serve on.",
    titleVariants: ["AI Data Engineer II", "Data Engineer III – Databricks", "Senior Data Engineer"],
    yoeRange: "2–5, senior 5+",
    typicalBackground: "ETL, BI, big-data engineers (common from TCS/Infosys)",
    payBands: [teamLease("9 → 30 LPA, senior up to 42 LPA")],
    ladderNotes: seniorityLadders,
    examplePostings: [
      posting("AI Data Engineer II", "UKG", "https://in.linkedin.com/jobs/view/ai-data-engineer-ii-at-ukg-4472556878"),
      posting(
        "Data Engineer III – Databricks",
        "The Standard",
        "https://in.linkedin.com/jobs/view/data-engineer-iii-databricks-at-the-standard-india-4462946419",
      ),
    ],
    minYears: 2,
  },
  {
    id: "applied_scientist",
    title: "Applied Scientist",
    cardDescription: "Experiments, stats and models for business problems",
    shortDescription: "Turns data into decisions and models through statistics, experiments and research.",
    titleVariants: [
      "Data Scientist (Senior, Staff, Principal)",
      "Applied AI ML Senior Associate",
      "Analyst – Data Science",
    ],
    yoeRange: "0–3 entry; Staff = BS+4 or MS+2",
    typicalBackground: "MTech/MS/PhD in CS, stats, econ",
    payBands: [levelsFyi("India median about 30 LPA (data scientist)"), unattributed("Amex campus offer 23 LPA")],
    ladderNotes: seniorityLadders,
    examplePostings: [
      posting(
        "Applied AI ML Senior Associate",
        "JPMorganChase",
        "https://in.linkedin.com/jobs/view/applied-ai-ml-senior-associate-at-jpmorganchase-4474521680",
      ),
    ],
    minYears: 0,
  },
  {
    id: "ai_backend",
    title: "AI Backend Engineer",
    cardDescription: "Backend services that integrate LLMs and models",
    shortDescription: "Integrates AI into product backends: APIs, LLM calls, retrieval and reliability.",
    titleVariants: ["Lead Engineer – Gen AI", "Lead SE – Python and AI", "Java Full Stack GenAI"],
    yoeRange: "3–10",
    typicalBackground: "Java/Spring or Python microservices + LLM integration",
    payBands: [levelsFyi("India SWE median 30 LPA; Amex SE III 34 LPA; Lowe's L5 36 LPA")],
    ladderNotes: seniorityLadders,
    examplePostings: [
      posting("Lead Engineer – Gen AI", "Target", "https://corporate.target.com/jobs/w09/43/lead-engineer-gen-ai"),
    ],
    minYears: 3,
  },
  {
    id: "ai_architect",
    title: "AI Architect / Lead",
    cardDescription: "Design AI platforms and lead teams (10+ years)",
    shortDescription: "Designs end-to-end AI systems and guides teams on cost, risk and strategy.",
    titleVariants: ["Principal SWE – AIML", "Technical Lead Architect – Agentic AI", "Applied AI ML Director"],
    yoeRange: "10–15+",
    typicalBackground: "Senior MLEs/architects with platform and governance experience",
    payBands: [
      zyoin("40–60+ LPA"),
      teamLease("About 95 LPA at 15 years"),
      unattributed("Walmart Principal 126 LPA"),
    ],
    ladderNotes: seniorityLadders,
    examplePostings: [
      posting(
        "Principal Software Engineer – AIML",
        "Nike",
        "https://careers.nike.com/en/principal-software-engineer-ai-itc/job/R-86382",
      ),
      posting(
        "Technical Lead Architect – Semantic Layer, Agentic AI",
        "Eli Lilly",
        "https://in.linkedin.com/jobs/view/pr-d-%E2%80%93-technical-lead-architect-%E2%80%93-semantic-layer-agentic-ai-at-eli-lilly-and-company-4457092892",
      ),
    ],
    minYears: 10,
  },
];

/** The eighth onboarding card. Resolves to the track default (lib/tracks.ts). */
export const notSureCard = {
  id: "not_sure" as const,
  title: "Not sure yet",
  description: "We'll start you on a good default",
};

export const roleCopy = {
  payApproximate: "Approximate",
  postingLabel: "Example, may have closed",
};

export function getRoleById(id: RoleId): Role {
  const role = roles.find((item) => item.id === id);
  if (!role) throw new Error(`Unknown role ${id}`);
  return role;
}
