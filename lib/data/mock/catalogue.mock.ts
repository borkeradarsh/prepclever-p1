// PLACEHOLDER CONTENT — research-derived mock data, not reviewed course material.
//
// Stage names and outcomes are read from components/auth/onboarding/config.ts so
// the dashboard can never show a different roadmap from the one the onboarding
// payoff screen promised. The courses and lessons below are written from the GCC
// research in docs/research/ to make the structure legible; they are placeholders
// for real content and will be replaced wholesale.
// TODO(cms): move this to the CMS and delete this file.

import { paths, roles, situationLabels } from "@/components/auth/onboarding/config";
import { ACCESS_RULES } from "@/lib/access";
import type { Course, Lesson, LessonType, Path, RoleId, Situation, Stage } from "@/types/domain";

/** [title, type, duration in minutes] */
type LessonSeed = [string, LessonType, number];
type CourseSeed = { title: string; summary: string; lessons: LessonSeed[] };

/** Courses per stage, indexed by stage order - 1. One or two courses per stage. */
type RoleSeed = CourseSeed[][];

const genaiLlm: RoleSeed = [
  [
    {
      title: "Python for AI engineers",
      summary: "The Python you actually need before touching a model.",
      lessons: [
        ["Typed Python and project setup", "reading", 18],
        ["Async code and HTTP clients", "video", 24],
        ["Validating data with Pydantic", "video", 22],
        ["Secrets, config and environments", "reading", 14],
        ["Checkpoint: a typed API client", "project", 45],
      ],
    },
    {
      title: "LLM APIs in practice",
      summary: "Call a model reliably and get structured output back.",
      lessons: [
        ["Your first chat completion call", "video", 20],
        ["Tokens, context windows and cost", "reading", 16],
        ["Structured outputs with JSON schema", "video", 26],
        ["Streaming responses", "video", 18],
        ["Prompt patterns that survive production", "reading", 22],
        ["Quiz: LLM API basics", "quiz", 10],
      ],
    },
  ],
  [
    {
      title: "Retrieval and embeddings",
      summary: "Build a retrieval pipeline you can explain end to end.",
      lessons: [
        ["What embeddings encode", "reading", 18],
        ["Chunking strategies that matter", "video", 24],
        ["Choosing a vector store", "reading", 20],
        ["Wiring retrieval into a prompt", "video", 26],
        ["Reranking and hybrid search", "video", 24],
        ["Checkpoint: a searchable document set", "project", 50],
      ],
    },
  ],
  [
    {
      title: "Tool-using agents",
      summary: "Move from one prompt to a loop that takes actions.",
      lessons: [
        ["From prompt to tool call", "video", 22],
        ["Designing tools an agent can use", "reading", 20],
        ["Multi-step loops and stopping conditions", "video", 26],
        ["Failure modes and retries", "reading", 18],
        ["Checkpoint: an agent with three tools", "project", 55],
      ],
    },
    {
      title: "Evals and guardrails",
      summary: "Measure quality before you add features.",
      lessons: [
        ["Why evals come first", "reading", 16],
        ["Building an eval set from real traffic", "video", 24],
        ["Using a model as a judge, carefully", "video", 22],
        ["Guardrails and input validation", "reading", 20],
        ["Quiz: evaluating an LLM feature", "quiz", 10],
      ],
    },
  ],
  [
    {
      title: "Ship it and interview prep",
      summary: "Deploy the project, then talk about it well.",
      lessons: [
        ["Packaging and deploying the app", "video", 26],
        ["Observability for LLM features", "video", 22],
        ["Cost and latency in production", "reading", 20],
        ["A README a reviewer will read", "reading", 16],
        ["Explaining your design out loud", "video", 24],
        ["Checkpoint: deployed and documented", "project", 60],
      ],
    },
  ],
];

const mlMlops: RoleSeed = [
  [
    {
      title: "ML foundations you can explain",
      summary: "Core models and the maths you will be asked about.",
      lessons: [
        ["Data handling with pandas", "video", 24],
        ["Train, validation and test splits", "reading", 18],
        ["Linear and tree models end to end", "video", 28],
        ["Metrics that match the problem", "reading", 20],
        ["Quiz: model fundamentals", "quiz", 12],
      ],
    },
    {
      title: "Feature engineering",
      summary: "Turn raw tables into features a model can use.",
      lessons: [
        ["Leakage and how to spot it", "reading", 20],
        ["Encoding categorical data", "video", 22],
        ["Scaling and imputation", "video", 18],
        ["Checkpoint: a reproducible feature set", "project", 45],
      ],
    },
  ],
  [
    {
      title: "Training and experiments",
      summary: "Make every run reproducible and comparable.",
      lessons: [
        ["Structuring a training pipeline", "video", 26],
        ["Experiment tracking", "video", 22],
        ["Versioning data and models", "reading", 20],
        ["Hyperparameter search without waste", "video", 24],
        ["Checkpoint: a tracked training run", "project", 50],
      ],
    },
  ],
  [
    {
      title: "Deploy and serve",
      summary: "Package a model and put an API in front of it.",
      lessons: [
        ["Packaging a model artifact", "video", 22],
        ["Serving with a REST API", "video", 26],
        ["Containers and reproducible builds", "reading", 20],
        ["CI/CD for model releases", "video", 24],
        ["Checkpoint: a deployed model endpoint", "project", 55],
      ],
    },
    {
      title: "Monitoring in production",
      summary: "Catch drift and quality loss before users do.",
      lessons: [
        ["What to log and what to alert on", "reading", 18],
        ["Detecting data and concept drift", "video", 26],
        ["Shadow deploys and rollbacks", "video", 22],
        ["Quiz: production failure modes", "quiz", 12],
      ],
    },
  ],
  [
    {
      title: "MLOps interview prep",
      summary: "The questions GCC panels actually ask.",
      lessons: [
        ["How GCCs structure ML interviews", "reading", 18],
        ["Designing an ML system on a whiteboard", "video", 28],
        ["Walking through a pipeline you built", "video", 22],
        ["Quiz: MLOps scenarios", "quiz", 12],
      ],
    },
  ],
];

const aiPlatform: RoleSeed = [
  [
    {
      title: "Cloud and networking basics",
      summary: "Run a service on a major cloud and understand the plumbing.",
      lessons: [
        ["Compute, storage and IAM", "reading", 22],
        ["Networking: VPCs, ports and DNS", "video", 26],
        ["Infrastructure as code", "video", 24],
        ["Cost basics and budgets", "reading", 16],
        ["Quiz: cloud fundamentals", "quiz", 12],
      ],
    },
    {
      title: "Containers",
      summary: "Build images that behave the same everywhere.",
      lessons: [
        ["Images, layers and caching", "video", 22],
        ["Writing a lean Dockerfile", "video", 20],
        ["Local development with Compose", "reading", 18],
        ["Checkpoint: a containerised service", "project", 45],
      ],
    },
  ],
  [
    {
      title: "Orchestration and CI/CD",
      summary: "Deploy with Kubernetes and automate the path to production.",
      lessons: [
        ["Pods, deployments and services", "video", 28],
        ["Config, secrets and health checks", "reading", 22],
        ["Autoscaling that behaves", "video", 24],
        ["Pipelines from commit to cluster", "video", 26],
        ["Checkpoint: an automated deployment", "project", 55],
      ],
    },
  ],
  [
    {
      title: "Model serving infrastructure",
      summary: "Serve models at scale with latency and cost in mind.",
      lessons: [
        ["Serving runtimes compared", "reading", 22],
        ["Batching and concurrency", "video", 26],
        ["GPU scheduling and sharing", "video", 28],
        ["Caching and cost control", "reading", 20],
        ["Checkpoint: a served model with SLOs", "project", 55],
      ],
    },
    {
      title: "Observability",
      summary: "Know what your platform is doing before someone asks.",
      lessons: [
        ["Metrics, logs and traces", "reading", 20],
        ["Dashboards people actually use", "video", 22],
        ["Alerting without fatigue", "video", 20],
        ["Quiz: observability design", "quiz", 12],
      ],
    },
  ],
  [
    {
      title: "Reliability and interview prep",
      summary: "Incident practice and platform interview questions.",
      lessons: [
        ["SLOs, error budgets and on-call", "reading", 22],
        ["Running an incident", "video", 24],
        ["Platform system design questions", "video", 28],
        ["Quiz: reliability scenarios", "quiz", 12],
      ],
    },
  ],
];

const aiData: RoleSeed = [
  [
    {
      title: "SQL for data engineers",
      summary: "Query and reshape data with confidence.",
      lessons: [
        ["Joins, windows and CTEs", "video", 28],
        ["Reading a query plan", "video", 24],
        ["Modelling tables for analytics", "reading", 22],
        ["Quiz: SQL under pressure", "quiz", 12],
      ],
    },
    {
      title: "Python for data work",
      summary: "Transform and validate data without surprises.",
      lessons: [
        ["Dataframes and vectorised thinking", "video", 24],
        ["Schema validation and contracts", "reading", 20],
        ["Working with files, formats and compression", "video", 22],
        ["Checkpoint: a validated transform", "project", 45],
      ],
    },
  ],
  [
    {
      title: "Pipelines and orchestration",
      summary: "Build scheduled pipelines that recover from failure.",
      lessons: [
        ["Batch pipeline anatomy", "reading", 20],
        ["Scheduling and dependencies", "video", 26],
        ["Idempotency and backfills", "video", 24],
        ["Streaming basics", "reading", 22],
        ["Checkpoint: a scheduled pipeline", "project", 55],
      ],
    },
  ],
  [
    {
      title: "Data for AI systems",
      summary: "Prepare the embeddings, features and checks AI depends on.",
      lessons: [
        ["Feature stores, plainly", "reading", 20],
        ["Building an embedding pipeline", "video", 28],
        ["Deduplication and near-duplicates", "video", 22],
        ["Data quality checks that catch real bugs", "reading", 20],
        ["Checkpoint: an embedding refresh job", "project", 50],
      ],
    },
    {
      title: "Governance and lineage",
      summary: "Know where data came from and who may use it.",
      lessons: [
        ["Lineage and cataloguing", "reading", 20],
        ["PII, masking and access control", "video", 24],
        ["Retention and audit trails", "reading", 18],
        ["Quiz: governance decisions", "quiz", 12],
      ],
    },
  ],
  [
    {
      title: "Data engineering interview prep",
      summary: "Pipeline design and SQL rounds.",
      lessons: [
        ["How GCCs run data interviews", "reading", 18],
        ["Designing a pipeline on a whiteboard", "video", 28],
        ["Live SQL practice", "video", 26],
        ["Quiz: data engineering scenarios", "quiz", 12],
      ],
    },
  ],
];

const backendToAi: RoleSeed = [
  [
    {
      title: "Bridge skills for backend engineers",
      summary: "What transfers from backend work, and what is new.",
      lessons: [
        ["What your backend experience already covers", "reading", 16],
        ["Python for engineers who know another language", "video", 24],
        ["Calling an LLM from a service", "video", 22],
        ["Tokens, cost and timeouts", "reading", 18],
        ["Quiz: LLM basics for backend engineers", "quiz", 10],
      ],
    },
    {
      title: "Prompting as an API contract",
      summary: "Treat prompts like interfaces, with tests.",
      lessons: [
        ["Structured outputs your code can trust", "video", 26],
        ["Versioning and testing prompts", "reading", 20],
        ["Handling partial and invalid responses", "video", 22],
        ["Checkpoint: a typed LLM wrapper", "project", 45],
      ],
    },
  ],
  [
    {
      title: "Add AI to an existing service",
      summary: "Ship an LLM feature inside a real codebase.",
      lessons: [
        ["Picking a first feature worth shipping", "reading", 18],
        ["Retrieval over your own data", "video", 28],
        ["Queues, timeouts and backpressure", "video", 24],
        ["Feature flags and safe rollout", "reading", 20],
        ["Checkpoint: an AI endpoint in your service", "project", 55],
      ],
    },
  ],
  [
    {
      title: "Data and deployment for AI features",
      summary: "The data and operational work the feature needs around it.",
      lessons: [
        ["Storing embeddings next to your data", "video", 26],
        ["Caching and cost control", "reading", 20],
        ["Evaluating the feature's output", "video", 24],
        ["Monitoring an AI endpoint", "video", 22],
        ["Checkpoint: evals and dashboards", "project", 50],
      ],
    },
    {
      title: "Repositioning your profile",
      summary: "Make the AI work you have done legible to a recruiter.",
      lessons: [
        ["Reframing a services resume for AI roles", "reading", 22],
        ["A GitHub project that reads as AI work", "video", 24],
        ["LinkedIn and the keywords GCCs filter on", "reading", 18],
        ["Quiz: profile review", "quiz", 10],
      ],
    },
  ],
  [
    {
      title: "Interview prep for the switch",
      summary: "Answer the \"why AI now\" question well.",
      lessons: [
        ["How GCCs interview switchers", "reading", 18],
        ["Explaining your AI feature end to end", "video", 26],
        ["System design with an LLM in it", "video", 28],
        ["Quiz: switcher interview questions", "quiz", 12],
      ],
    },
  ],
];

const catalogueSeed: Record<RoleId, RoleSeed> = {
  genai_llm: genaiLlm,
  ml_mlops: mlMlops,
  ai_platform: aiPlatform,
  ai_data: aiData,
  backend_to_ai: backendToAi,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildLesson(
  roleId: RoleId,
  stageOrder: number,
  courseIndex: number,
  [title, type, durationMin]: LessonSeed,
  index: number,
): Lesson {
  return {
    id: `${roleId}-s${stageOrder}-c${courseIndex + 1}-l${index + 1}`,
    slug: slugify(title),
    title,
    type,
    durationMin,
    order: index + 1,
    // Lesson 1 of every course is the free sample; the rest follow the rule.
    access: index === 0 ? "free" : ACCESS_RULES.defaultLessonAccess,
  };
}

/** The stages and courses for one role. Deterministic: same input, same output. */
export function buildCatalogue(roleId: RoleId): { stages: Stage[]; courses: Course[] } {
  const seed = catalogueSeed[roleId];
  const stages: Stage[] = [];
  const courses: Course[] = [];

  paths[roleId].stages.forEach((stage, stageIndex) => {
    const stageId = `${roleId}-s${stage.order}`;
    const courseSeeds = seed[stageIndex] ?? [];

    const stageCourses = courseSeeds.map((courseSeed, courseIndex) => ({
      id: `${stageId}-c${courseIndex + 1}`,
      slug: slugify(courseSeed.title),
      title: courseSeed.title,
      summary: courseSeed.summary,
      stageId,
      lessons: courseSeed.lessons.map((lessonSeed, lessonIndex) =>
        buildLesson(roleId, stage.order, courseIndex, lessonSeed, lessonIndex),
      ),
    }));

    stages.push({
      id: stageId,
      order: stage.order,
      name: stage.name,
      outcome: stage.outcome,
      courseIds: stageCourses.map((course) => course.id),
    });
    courses.push(...stageCourses);
  });

  return { stages, courses };
}

export function buildPath(roleId: RoleId, situation: Situation): Path {
  const role = roles.find((item) => item.id === roleId);
  return {
    roleId,
    situation,
    title: `${situationLabels[situation]} → ${role?.title ?? "AI Engineer"} at a GCC`,
    stages: buildCatalogue(roleId).stages,
  };
}
