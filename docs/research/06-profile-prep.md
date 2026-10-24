# 06 · Profile Prep: Resume, GitHub, LinkedIn, Interviews

<aside>
💡

GCCs hire **skills-first**: an online assessment filters first, then interviewers test whether you can own part of the India centre's product, not just deliver client tickets ([GCC Journal 2026](https://gccjournal.in/careers/freshers-get-jobs-in-global-capability-centers-gcc/)). The profile must show production work, ownership and the parent company's stack.

</aside>

## 📄 Resume (to pass ATS)

- One page up to ~7–8 yrs; single column; no tables/icons; text-selectable PDF; standard headings. Template: [Jake's Resume](https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs). Rules: [Tech Interview Handbook](https://www.techinterviewhandbook.org/resume/).
- **Parse test:** paste the PDF into plain text — if order breaks, the ATS breaks it too.
- Mirror exact JD words from 5–8 target JDs; write acronym and full form once.
- Skills by category: Languages · ML/DL · GenAI · MLOps · Cloud · Data.
- Bullets with Google's XYZ formula ([Simplify](https://simplify.jobs/blog/how-to-use-the-xyz-resume-format)); quote p95 latency, cost/1k requests, F1/AUC lift, recall@k, RAG faithfulness.
- **Switchers:** rewrite client delivery as engineering outcomes ([InterviewBit](https://www.interviewbit.com/blog/switch-from-service-based-to-product-based-company/)).

## 💼 LinkedIn

- **Headline = target title:** “ML Engineer | GenAI (RAG, evals) · PyTorch · MLOps on AWS | Built X serving Y users”.
- Fill up to 50 Skills with JD keywords; check Search appearances.
- Open to Work → “Recruiters only”, with target titles and cities ([LinkedIn Help](https://www.linkedin.com/help/linkedin/answer/a507508/)).
- Post each project, add it to Featured, engage with people at target GCCs, then ask for specific referrals.

## 🐙 GitHub

- **Profile README:** 3-line pitch, stack, demo links ([GitHub Docs](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)).
- **Pin 3–6 role-matched repos** ([GitHub Docs](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/pinning-items-to-your-profile)): RAG/agent app with evals; fine-tuned model with model card; MLOps pipeline; batch + streaming data pipeline; one from-scratch build.
- **Repo README:** problem, architecture diagram, one-command setup, live demo + GIF, results table, limitations.
- **Hygiene:** tests, GitHub Actions CI, pre-commit, pinned deps, no secrets.
- **GenAI differentiator = evals** ([Hamel Husain](https://hamel.dev/blog/posts/evals/)).
- **Copy from:** [Made-With-ML](https://github.com/GokuMohandas/Made-With-ML) · [LLM-Engineers-Handbook](https://github.com/PacktPublishing/LLM-Engineers-Handbook) · [llm-twin-course](https://github.com/decodingml/llm-twin-course) · [nanochat](https://github.com/karpathy/nanochat) · [llm-zoomcamp](https://github.com/DataTalksClub/llm-zoomcamp)

## 🎯 Interview preparation

Usual loop for GCC AI roles: online assessment → DSA → ML fundamentals or ML coding → ML/LLM system design → behavioural or hiring manager ([alirezadir/Machine-Learning-Interviews](https://github.com/alirezadir/Machine-Learning-Interviews)).

| Round | What to prepare | Best resources |
| --- | --- | --- |
| **DSA / OA** | Freshers: Striver A2Z, then SDE sheet. Switchers with ~3 months: NeetCode 150 | [NeetCode](https://neetcode.io/practice), [Striver SDE sheet](https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems), [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) |
| **ML fundamentals** | Bias/variance, metrics, regularisation; code logistic regression, k-means, attention and a training loop from scratch | [Chip Huyen ML Interviews Book](https://huyenchip.com/ml-interviews-book/), [StatQuest](https://www.youtube.com/c/joshstarmer) |
| **ML system design** | Goal & metric → data → features → model → offline/online eval → serving → monitoring | [ByteByteGo ML SD](https://bytebytego.com/courses/machine-learning-system-design-interview), [Evidently 800 case studies](https://www.evidentlyai.com/ml-system-design) |
| **LLM / GenAI design** | RAG vs fine-tune vs tools vs agents, chunking, permissions, layered evals, guardrails, latency and cost levers | [DataTalks LLM SD guide](https://datatalksclub.github.io/podwiki/wiki/llm-system-design-interview/), [Eugene Yan patterns](https://eugeneyan.com/writing/llm-patterns/), [Anthropic agents](https://www.anthropic.com/engineering/building-effective-agents) |
| **Behavioural** | 3–5 STAR stories with metrics, mapped to the parent's values; know what the India centre owns | [Tech Interview Handbook](https://www.techinterviewhandbook.org/behavioral-interview/), [Amazon LPs as template](https://www.amazon.jobs/content/en/our-workplace/leadership-principles) |