// Block 4 checklists, rewritten as checkable items from
// docs/research/06-profile-prep.md. Ids are stored (by index) in the progress
// cookie: append new items, never reorder or delete, until progress moves to
// the database. TODO(persistence)

import type { Checklist } from "@/types/domain";

export const checklists: Checklist[] = [
  {
    id: "resume",
    title: "Resume (to pass ATS)",
    items: [
      {
        id: "resume-format",
        text: "One page up to about 7–8 years; single column; no tables or icons; standard headings.",
        source: { label: "Jake's Resume template", url: "https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs" },
      },
      {
        id: "resume-parse-test",
        text: "Export a text-selectable PDF and run the parse test: paste it into plain text and check the order holds.",
      },
      {
        id: "resume-keywords",
        text: "Mirror the exact words from 5–8 target job descriptions; write each acronym and its full form once.",
      },
      { id: "resume-skills", text: "Group skills by category: Languages · ML/DL · GenAI · MLOps · Cloud · Data." },
      {
        id: "resume-xyz",
        text: "Write bullets with Google's XYZ formula and quote numbers: p95 latency, cost per 1k requests, F1/AUC lift, recall@k, RAG faithfulness.",
        source: { label: "Simplify: the XYZ format", url: "https://simplify.jobs/blog/how-to-use-the-xyz-resume-format" },
      },
      {
        id: "resume-switcher",
        text: "Switchers: rewrite client delivery as engineering outcomes.",
        source: {
          label: "InterviewBit",
          url: "https://www.interviewbit.com/blog/switch-from-service-based-to-product-based-company/",
        },
      },
    ],
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    items: [
      {
        id: "linkedin-headline",
        text: "Make the headline your target title, e.g. “ML Engineer | GenAI (RAG, evals) · PyTorch · MLOps on AWS | Built X serving Y users”.",
      },
      { id: "linkedin-skills", text: "Fill up to 50 Skills with job-description keywords, then check Search appearances." },
      {
        id: "linkedin-open-to-work",
        text: "Set Open to Work to “Recruiters only”, with your target titles and cities.",
        source: { label: "LinkedIn Help", url: "https://www.linkedin.com/help/linkedin/answer/a507508/" },
      },
      {
        id: "linkedin-featured",
        text: "Post each project, add it to Featured, engage with people at target GCCs, then ask for specific referrals.",
      },
    ],
  },
  {
    id: "github",
    title: "GitHub",
    items: [
      {
        id: "github-profile-readme",
        text: "Add a profile README: a 3-line pitch, your stack and demo links.",
        source: {
          label: "GitHub Docs",
          url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme",
        },
      },
      {
        id: "github-pins",
        text: "Pin 3–6 role-matched repos: a RAG or agent app with evals, a fine-tuned model with a model card, an MLOps pipeline, a batch and streaming data pipeline, one from-scratch build.",
        source: {
          label: "GitHub Docs",
          url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/pinning-items-to-your-profile",
        },
      },
      {
        id: "github-repo-readme",
        text: "Give each repo a README: problem, architecture diagram, one-command setup, live demo and GIF, results table, limitations.",
      },
      { id: "github-hygiene", text: "Keep hygiene: tests, GitHub Actions CI, pre-commit, pinned dependencies, no secrets." },
      {
        id: "github-evals",
        text: "For GenAI work, show your evals: they are the differentiator.",
        source: { label: "Hamel Husain on evals", url: "https://hamel.dev/blog/posts/evals/" },
      },
    ],
  },
];

export const allChecklistItemIds: string[] = checklists.flatMap((list) => list.items.map((item) => item.id));
