import type { RoleId, Situation, YearsBand } from "./types";

export const situations: { id: Situation; title: string; description: string; needsYears: boolean }[] = [
  { id: "student", title: "Student / final year", description: "In college or about to graduate", needsYears: false },
  { id: "it_services", title: "IT services company", description: "Working at a services or consulting firm", needsYears: true },
  { id: "product_tech", title: "Product / tech role", description: "At a product company or another tech job", needsYears: true },
  { id: "non_tech", title: "Switching careers", description: "Coming from a non-technical background", needsYears: false },
];

export const yearsBands: { id: YearsBand; label: string }[] = [
  { id: "0-2", label: "0–2" }, { id: "3-5", label: "3–5" }, { id: "6-10", label: "6–10" }, { id: "10+", label: "10+" },
];

export const roles: { id: RoleId; title: string; description: string; summary: string }[] = [
  { id: "genai_llm", title: "GenAI / LLM Engineer", description: "Build apps on LLMs: RAG, agents, evals", summary: "Designs and ships features powered by large language models: retrieval-augmented generation (RAG), agents and tool use, prompt and evaluation pipelines, and guardrails. Works closely with product teams." },
  { id: "ml_mlops", title: "ML / MLOps Engineer", description: "Train, deploy and monitor models in production", summary: "Takes models from notebook to production: training pipelines, experiment tracking, packaging, deployment, monitoring for drift and quality. Owns reliability of ML systems." },
  { id: "ai_platform", title: "AI Platform Engineer", description: "Build the infrastructure AI teams run on", summary: "Builds the shared cloud, container and serving infrastructure that AI teams build on: model serving, GPU and cost management, CI/CD, observability." },
  { id: "ai_data", title: "AI Data Engineer", description: "Build the data pipelines behind AI", summary: "Builds and maintains the data pipelines, quality checks and storage that feed AI systems: batch and streaming pipelines, embeddings and feature data, data governance." },
  { id: "backend_to_ai", title: "Backend → AI", description: "Backend dev moving into AI work", summary: "A backend engineer adding AI skills: calling and serving models, building LLM features inside existing services, and learning data and deployment practices." },
];

export const paths: Record<RoleId, { stages: { order: number; name: string; outcome: string }[]; gccExamples: string[] }> = {
  genai_llm: { stages: [{ order: 1, name: "Python and LLM foundations", outcome: "Call LLM APIs, write reliable prompts, return structured outputs" }, { order: 2, name: "RAG and data", outcome: "Build a retrieval pipeline with embeddings and a vector store" }, { order: 3, name: "Agents and evals", outcome: "Ship a tool-using agent and measure its quality with evals" }, { order: 4, name: "Ship it and interview prep", outcome: "Deploy a portfolio project and practise GenAI interview questions" }], gccExamples: ["Cohere Health (Hyderabad)", "Deepwatch (Bengaluru)", "Ferguson (Bengaluru)"] },
  ml_mlops: { stages: [{ order: 1, name: "ML foundations", outcome: "Python, data handling and core models you can explain end to end" }, { order: 2, name: "Training and experiments", outcome: "Reproducible training with experiment tracking and versioning" }, { order: 3, name: "Deploy and serve", outcome: "Package a model, expose an API, automate with CI/CD" }, { order: 4, name: "Monitor and interview prep", outcome: "Track drift and quality in production and prepare for MLOps interviews" }], gccExamples: ["Southwest Airlines (Hyderabad)", "Eli Lilly (Hyderabad)"] },
  ai_platform: { stages: [{ order: 1, name: "Cloud and containers", outcome: "Run services on a major cloud using Docker and core networking" }, { order: 2, name: "Orchestration and CI/CD", outcome: "Deploy with Kubernetes and automated pipelines" }, { order: 3, name: "Model serving infrastructure", outcome: "Serve models at scale with GPU, latency and cost in mind" }, { order: 4, name: "Reliability and interview prep", outcome: "Observability, incident handling and platform interview practice" }], gccExamples: ["Southwest Airlines (Hyderabad)", "Vanguard (Hyderabad)", "Best Buy (Bengaluru)"] },
  ai_data: { stages: [{ order: 1, name: "SQL and Python for data", outcome: "Query, transform and validate data confidently" }, { order: 2, name: "Pipelines and orchestration", outcome: "Build scheduled batch pipelines and understand streaming basics" }, { order: 3, name: "Data for AI", outcome: "Prepare embeddings, features and quality checks for AI systems" }, { order: 4, name: "Governance and interview prep", outcome: "Data quality, lineage and data engineering interview practice" }], gccExamples: ["ArcelorMittal (Pune, Hyderabad)", "Vanguard (Hyderabad)", "Medtronic (Pune)"] },
  backend_to_ai: { stages: [{ order: 1, name: "Bridge skills", outcome: "Python for AI and LLM API basics, building on your backend strengths" }, { order: 2, name: "Add AI to a service", outcome: "Build an LLM-powered feature inside a backend service" }, { order: 3, name: "Data and deployment for AI", outcome: "Handle data, deployment and monitoring for AI features" }, { order: 4, name: "Reposition and interview prep", outcome: "Reframe your resume for AI roles and practise interviews" }], gccExamples: ["Ferguson (Bengaluru)", "Eli Lilly (Hyderabad)"] },
};

export const situationLabels: Record<Situation, string> = { student: "Student", it_services: "Service-company engineer", product_tech: "Product-company engineer", non_tech: "Career switcher" };
export const highlightBySituation: Record<Situation, RoleId> = { student: "genai_llm", it_services: "backend_to_ai", product_tech: "ml_mlops", non_tech: "genai_llm" };
export const getDefaultRole = (situation: Situation): RoleId => highlightBySituation[situation];
export function resolveRole(choice: RoleId | "not_sure", situation: Situation) {
  return choice === "not_sure" ? { roleId: getDefaultRole(situation), roleIsDefault: true } : { roleId: choice, roleIsDefault: false };
}
