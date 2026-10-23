# Onboarding Flow: Build Spec (for GitHub Copilot)

Paste this whole file into Copilot Chat (or save it as `docs/onboarding-spec.md` and reference it with `#file`). Build **one screen at a time** in the order given in section 13.

---

## 0. How to work (read first)

You are implementing the post-login onboarding flow of an existing web app. Follow these rules throughout:

1. **Discover before writing.** Before creating anything, inspect the repo and report back in 10 lines or fewer: framework, router, UI/component library, styling approach (Tailwind, CSS modules, etc.), state management, auth provider, how the app currently talks to its backend, and where the **current onboarding page** lives (it currently collects name, role and experience).
2. **Reuse, do not reinvent.** Use existing components, design tokens, spacing, typography, colors, icons, and API helpers. Do not add a new UI library, new fonts, or new colors. If something needed is missing, ask me instead of inventing it.
3. **Match the existing look.** The new flow must look like it belongs to the same product as the current onboarding page and the rest of the app. See section 3.
4. **Stay in scope.** Do not refactor unrelated code. Do not change auth. Do not touch pages other than onboarding and the route guard in section 8.
5. **Small steps.** After each screen, stop and summarise what changed (files, new types, how to test). Wait for my go-ahead before the next screen.
6. **No hardcoded copy or data inside components.** Copy, role cards, situation options, defaults, and payoff content live in config files (section 11) so a non-engineer can edit them.
7. **If this spec is ambiguous or conflicts with existing code, ask a question rather than guessing.**

---

## 1. Product context

- The product is a platform that helps people grow their careers through courses and roadmaps.
- **Primary audience for this release:** college students and service-company engineers in India who want **AI engineering roles at Global Capability Centres (GCCs)**.
- **Target roles (scope):** GenAI/LLM, ML/MLOps, AI Platform, AI Data. Backend engineering is included only as a feeder into AI roles.
- Onboarding's job is to **place the user on a track** (current situation + target role) and show them a personalised path, so the dashboard can open with relevant content.

## 2. Goals and success metrics

| Goal | Metric | Target (initial) |
| --- | --- | --- |
| Fast | Median time to complete | under 30 seconds |
| Smooth | Completion rate of onboarding after login | 85%+ |
| Useful | Users who click the primary CTA on the payoff screen | 70%+ |
| Honest data | Share choosing "Not sure yet" | tracked; investigate if above 30% |

Structure: **2 questions + 1 payoff screen.** Nothing else is collected here.

---

## 3. Design rules (consistency and symmetry)

The existing onboarding page is the visual reference. Extract its tokens and layout, then apply these rules.

**Layout and symmetry**
- Single centered column, same max-width and horizontal padding as the current onboarding page. Reuse the same page container component if one exists.
- Content is **horizontally centered**, left-aligned text only inside cards. Headings and subtext are centered or left-aligned **exactly as the current page does it**; do not mix.
- All cards in a group are **identical in width and height**. Use a CSS grid with equal tracks, not flex with content-based widths.
  - Situation screen: 4 cards, 2×2 on desktop and tablet, 1 column on mobile.
  - Role screen: 6 cards, 3×2 on desktop, 2×3 on tablet, 1 column on mobile. "Not sure yet" is the 6th card in the grid, same size, with a visually secondary (dashed or muted) style.
- Equal gaps between cards, using an existing spacing token. Same vertical rhythm on every screen: progress indicator → heading → subtext → options → helper/footer.
- The Back button, progress indicator, and heading sit in the **same position on every screen** so nothing jumps when advancing.
- Card content structure (identical for every card): icon (optional, from the existing icon set) → title → one-line description. Truncate descriptions at 2 lines; do not let a long description change card height.

**Visual style**
- Use existing tokens only: colors, radius, shadow, border, font sizes, font weights.
- Selected state = same selected style used elsewhere in the app (border or ring plus subtle background). Hover, focus-visible, and pressed states required.
- Badge ("Popular for you") reuses the existing badge/chip component.
- Motion: subtle only (150 to 200 ms fade or slide between screens, card press feedback). Respect `prefers-reduced-motion` by disabling transitions.

**Accessibility and responsiveness**
- Option groups are `radiogroup` with each card a `radio` (native radio inputs visually styled are preferred). Full keyboard support: arrow keys move, Space/Enter selects.
- Visible focus ring, 4.5:1 text contrast, tap targets at least 44×44 px.
- Progress indicator exposes `aria-valuenow`/`aria-valuemax`.
- Screens usable at 320 px width; no horizontal scroll.
- Heading receives focus on each screen change (for screen readers).

---

## 4. Flow overview

```
Login → [guard: onboarding not complete?]
   → Screen 1: Situation  (+ year chips for working professionals)
   → Screen 2: Target role
   → Screen 3: Your path (payoff)
   → Dashboard (onboarding marked complete)
```

Progress indicator shows "1 of 2" and "2 of 2" on the two question screens. The payoff screen shows no progress indicator (it is the reward, not a step).

**Name** is not asked. It is taken from the auth profile and used in the greeting. Only if the auth profile has no name, show a single optional text field "What should we call you?" on Screen 1 above the options (not blocking).

---

## 5. Screen specs

### Screen 1: Situation

- Heading: `Welcome, {firstName}. Where are you right now?`
- Subtext: `We'll tailor your roadmap to your starting point.`
- Options (single-select cards, values are enums in section 6):

| Value | Title | Description |
| --- | --- | --- |
| `student` | Student / final year | In college or about to graduate |
| `it_services` | IT services company | Working at a services or consulting firm |
| `product_tech` | Product company or other tech role | Working in a product company or another tech job |
| `non_tech` | Switching from non-tech | Coming from a non-technical background |

- **Behaviour:**
  - `student` and `non_tech`: tapping a card saves and **auto-advances** to Screen 2.
  - `it_services` and `product_tech`: tapping a card **reveals a row of year chips directly below the grid** (same screen, animated expand) with the label `Years of experience`. Chips: `0–2`, `3–5`, `6–10`, `10+` (single-select). **Tapping a chip saves and auto-advances.** The chip row is required for these two options.
  - Changing the situation card after choosing resets the year chips.
- No Back button on Screen 1 (it is the first step).

### Screen 2: Target role

- Heading: `Which role are you aiming for?`
- Subtext: `You can change this anytime.`
- Options: the six role cards from `roles.config` (section 11.2). Tapping a card saves and **auto-advances** to Screen 3.
- One card carries a `Popular for you` badge, chosen by the highlight rule in section 7. The badge does not preselect it; the user must still tap.
- The "Not sure yet" card has the title `Not sure yet` and description `We'll start you on a good default.` Choosing it assigns the default role from section 7 and sets `roleIsDefault = true`.
- Back button returns to Screen 1 with the previous answers still selected.

### Screen 3: Your path (payoff)

- Content is generated from the saved answers using `paths.config` (section 11.3).
- Layout (centered, same container width):
  1. Eyebrow: `Your path`
  2. Title: `{situationLabel} → {roleTitle} at a GCC`
  3. A compact vertical list of the stages (stage number, name, one-line outcome). Max 4 stages.
  4. One proof line from the stats config (with a small source label beneath, e.g. `Source: foundit, H1 2026`).
  5. One line `GCCs hiring for this: {gccExamples}` (from `paths.config`, show at most 3 names with city).
  6. Primary button: `Start stage 1`. Secondary text link: `Change my role` (returns to Screen 2).
- If `roleIsDefault` is true, show a small note above the CTA: `We picked {roleTitle} as a starting point. Change it anytime.`
- On primary click: mark onboarding complete, then route to the first stage (or the dashboard if the stage route does not exist yet; leave a clearly marked TODO).

---

## 6. Data model

```ts
export type Situation = 'student' | 'it_services' | 'product_tech' | 'non_tech';
export type YearsBand = '0-2' | '3-5' | '6-10' | '10+';
export type RoleId =
  | 'genai_llm'
  | 'ml_mlops'
  | 'ai_platform'
  | 'ai_data'
  | 'backend_to_ai';

export interface OnboardingState {
  situation: Situation | null;
  yearsBand: YearsBand | null;   // required only for it_services and product_tech; otherwise null
  roleId: RoleId | null;         // never "not_sure"; resolved to a default
  roleIsDefault: boolean;        // true when user chose "Not sure yet"
  currentStep: 'situation' | 'role' | 'payoff' | 'done';
  completedAt: string | null;    // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

Rules:
- Validate on both client and server. Reject unknown enum values.
- `yearsBand` must be null for `student` and `non_tech`, and required for the other two.
- `currentStep` always reflects the **next screen to show**, so resume is a simple lookup.

---

## 7. Business rules (implement as a pure, unit-tested function)

**Highlight and default role by situation** (assumptions to validate with real data; keep in config):

| Situation | Highlighted ("Popular for you") and default if "Not sure yet" |
| --- | --- |
| `student` | `genai_llm` |
| `it_services` | `backend_to_ai` |
| `product_tech` | `ml_mlops` |
| `non_tech` | `genai_llm` |

Implement `getDefaultRole(situation): RoleId` and `resolveRole(choice: RoleId | 'not_sure', situation): { roleId: RoleId; roleIsDefault: boolean }`.

**Card ordering on Screen 2:** keep a fixed order (no reshuffling per user) so the grid stays symmetric and predictable. Only the badge moves. "Not sure yet" is always last.

---

## 8. Persistence, resume and routing

- **Save on every answer**, not at the end. On each tap, send a partial update; update local state optimistically, roll back and show a toast on failure.
- **API contract** (adapt to the existing backend conventions; if none exist, use this):
  - `GET /api/onboarding` returns `OnboardingState` (or defaults if none exists).
  - `PATCH /api/onboarding` accepts a partial `OnboardingState` (only `situation`, `yearsBand`, `roleId`, `roleIsDefault`, `currentStep`), returns the full updated state.
  - `POST /api/onboarding/complete` sets `completedAt` and `currentStep = 'done'`. Idempotent.
- **Route guard:** after login, if `currentStep !== 'done'`, redirect to the onboarding route and to the screen matching `currentStep`. If `done`, never show onboarding again (redirect away from onboarding routes to the dashboard).
- **Routes:** `/onboarding/situation`, `/onboarding/role`, `/onboarding/path`. Deep links to a later step the user has not reached redirect to the correct current step.
- **Refresh / return mid-flow:** restore saved answers and show the screen for `currentStep`.
- Browser Back works as expected between onboarding screens.

---

## 9. States and edge cases

| Case | Behaviour |
| --- | --- |
| Initial load | Skeleton in the same layout (no layout shift) while `GET /api/onboarding` resolves |
| Save fails | Toast `Couldn't save. Try again.`, selection reverts, user stays on the screen |
| Slow network | Auto-advance only after the save succeeds, with a brief selected state shown meanwhile; do not double-submit on repeated taps |
| Already completed | Redirect to dashboard |
| Auth profile has no name | Show the optional name field (section 4); greeting falls back to `Welcome` |
| User changes situation after choosing a role | Keep `roleId`; recompute only the badge. If the new situation conflicts with `yearsBand` rules, clear `yearsBand` |
| User returns via `Change my role` | Screen 2 opens with the current role preselected; choosing a new one updates the state and returns to Screen 3 |
| Empty or invalid config | Fail loudly in development; in production fall back to the default role config and log an error |

---

## 10. Analytics events

Use the existing analytics client if present; otherwise create a thin `track(event, props)` wrapper. Always include `userId` (or anonymous id) and `ts`.

| Event | When | Properties |
| --- | --- | --- |
| `onboarding_started` | Screen 1 first viewed | `source` |
| `onboarding_step_viewed` | Each screen viewed | `step` |
| `onboarding_situation_selected` | Situation chosen | `situation` |
| `onboarding_years_selected` | Year chip chosen | `yearsBand`, `situation` |
| `onboarding_role_selected` | Role chosen | `roleId`, `isHighlighted`, `isDefault` |
| `onboarding_not_sure_selected` | "Not sure yet" chosen | `situation`, `resolvedRoleId` |
| `onboarding_back_clicked` | Back used | `fromStep` |
| `onboarding_completed` | Primary CTA on payoff | `situation`, `yearsBand`, `roleId`, `roleIsDefault`, `durationMs` |
| `onboarding_save_failed` | Any save error | `step`, `errorCode` |
| `onboarding_role_changed_from_payoff` | `Change my role` clicked | `roleId` |

Drop-off is derived from the last `onboarding_step_viewed` for users without `onboarding_completed`.

---

## 11. Config files (all copy and data live here)

Create `onboarding/config/` with typed files. Components import from these; no strings hardcoded in JSX.

### 11.1 `situations.config`

The four options from section 5 (value, title, description, `needsYears: boolean`).

### 11.2 `roles.config`

| id | title | description |
| --- | --- | --- |
| `genai_llm` | GenAI / LLM Engineer | Build apps on top of LLMs: RAG, agents, evals |
| `ml_mlops` | ML / MLOps Engineer | Train, deploy and monitor models in production |
| `ai_platform` | AI Platform Engineer | Build the infrastructure other teams run AI on |
| `ai_data` | AI Data Engineer | Build the pipelines and data foundations for AI |
| `backend_to_ai` | Backend Engineer → AI | I write backend code today and want to move into AI work |
| `not_sure` | Not sure yet | We'll start you on a good default. |

Fixed display order as listed. Each role id also carries a longer `summary` (shown nowhere in onboarding yet, reserved for the dashboard and role pages):

| id | summary |
| --- | --- |
| `genai_llm` | Designs and ships features powered by large language models: retrieval-augmented generation (RAG), agents and tool use, prompt and evaluation pipelines, and guardrails. Works closely with product teams. |
| `ml_mlops` | Takes models from notebook to production: training pipelines, experiment tracking, packaging, deployment, monitoring for drift and quality. Owns reliability of ML systems. |
| `ai_platform` | Builds the shared cloud, container and serving infrastructure that AI teams build on: model serving, GPU and cost management, CI/CD, observability. |
| `ai_data` | Builds and maintains the data pipelines, quality checks and storage that feed AI systems: batch and streaming pipelines, embeddings and feature data, data governance. |
| `backend_to_ai` | A backend engineer adding AI skills: calling and serving models, building LLM features inside existing services, and learning data and deployment practices for AI. This is the bridge role for service-company engineers. |

### 11.3 `paths.config`

For each `RoleId`, define exactly 4 stages `{ order, name, outcome }` and a `gccExamples` list. Use the content below as-is.

**Content source note:** stage content is drafted from the standard skill progression for each role and scope of the research (AI platform, AI data, GenAI, MLOps, with backend as a feeder). `gccExamples` come from the GCC launches and expansions table in the research (stated tech focus per centre). Mapping a company to a role is an editorial judgement, and the trackers mix launched and announced centres, so confirm each centre before launch.

**`genai_llm` — GenAI / LLM Engineer**

| Stage | Name | Outcome |
| --- | --- | --- |
| 1 | Python and LLM foundations | Call LLM APIs, write reliable prompts, return structured outputs |
| 2 | RAG and data | Build a retrieval pipeline with embeddings and a vector store |
| 3 | Agents and evals | Ship a tool-using agent and measure its quality with evals |
| 4 | Ship it and interview prep | Deploy a portfolio project and practise GenAI interview questions |

`gccExamples`: Cohere Health (Hyderabad), Deepwatch (Bengaluru), Ferguson (Bengaluru)

**`ml_mlops` — ML / MLOps Engineer**

| Stage | Name | Outcome |
| --- | --- | --- |
| 1 | ML foundations | Python, data handling and core models you can explain end to end |
| 2 | Training and experiments | Reproducible training with experiment tracking and versioning |
| 3 | Deploy and serve | Package a model, expose an API, automate with CI/CD |
| 4 | Monitor and interview prep | Track drift and quality in production and prepare for MLOps interviews |

`gccExamples`: Southwest Airlines (Hyderabad), Eli Lilly (Hyderabad)

**`ai_platform` — AI Platform Engineer**

| Stage | Name | Outcome |
| --- | --- | --- |
| 1 | Cloud and containers | Run services on a major cloud using Docker and core networking |
| 2 | Orchestration and CI/CD | Deploy with Kubernetes and automated pipelines |
| 3 | Model serving infrastructure | Serve models at scale with GPU, latency and cost in mind |
| 4 | Reliability and interview prep | Observability, incident handling and platform interview practice |

`gccExamples`: Southwest Airlines (Hyderabad), Vanguard (Hyderabad), Best Buy (Bengaluru)

**`ai_data` — AI Data Engineer**

| Stage | Name | Outcome |
| --- | --- | --- |
| 1 | SQL and Python for data | Query, transform and validate data confidently |
| 2 | Pipelines and orchestration | Build scheduled batch pipelines and understand streaming basics |
| 3 | Data for AI | Prepare embeddings, features and quality checks for AI systems |
| 4 | Governance and interview prep | Data quality, lineage and data engineering interview practice |

`gccExamples`: ArcelorMittal (Pune, Hyderabad), Vanguard (Hyderabad), Medtronic (Pune)

**`backend_to_ai` — Backend Engineer → AI**

| Stage | Name | Outcome |
| --- | --- | --- |
| 1 | Bridge skills | Python for AI and LLM API basics, building on your backend strengths |
| 2 | Add AI to a service | Build an LLM-powered feature inside a backend service |
| 3 | Data and deployment for AI | Handle data, deployment and monitoring for AI features |
| 4 | Reposition and interview prep | Reframe your resume for AI roles and practise interviews |

`gccExamples`: Ferguson (Bengaluru), Eli Lilly (Hyderabad)

**Situation labels** (used in the payoff title):

| Situation | Label |
| --- | --- |
| `student` | Student |
| `it_services` | Service-company engineer |
| `product_tech` | Product-company engineer |
| `non_tech` | Career switcher |

### 11.4 `stats.config`

Proof lines shown on the payoff screen. Each entry: `text`, `sourceLabel`, `checkedOn`. Initial entries from internal research (**verify before launch**; the research notes flag these as approximate):

- `GCC hiring in AI, data science and analytics grew about 38% year on year in H1 2026.` Source: foundit via Business Today.
- `About 43% talent gap in AI, data and analytics roles across GCCs.` Source: Quess Q3 FY26.
- `Freshers (0–3 years) are about 30% of GCC hiring, the fastest-growing experience band.` Source: foundit via Business Today.

Pick one line per user (stable by `roleId` so it does not change on refresh). Add a `// TODO(verify)` marker on each.

---

## 12. Out of scope (do not build)

- Resume upload, free-text answers, skill assessment quiz
- Target city, weekly hours, timeline, current skills (to be collected later in the dashboard via progressive profiling)
- Payments or plan selection
- Changes to login or signup
- Real course catalogue integration (use the stages in `paths.config`)

---

## 13. Build order (stop after each step and summarise)

1. **Discovery report** (section 0, rule 1). No code changes.
2. **Types, config files, and business rules** (sections 6, 7, 11) with unit tests for `getDefaultRole` and `resolveRole`.
3. **Persistence layer:** API calls (or mocks if the backend is not ready), state hook/store, route guard (section 8).
4. **Screen 1: Situation**, including the year-chip reveal and auto-advance.
5. **Screen 2: Role**, including badge logic and "Not sure yet".
6. **Screen 3: Payoff.**
7. **Analytics events** (section 10).
8. **Polish pass:** states and edge cases (section 9), accessibility check, responsive check at 320 / 768 / 1280 px, reduced-motion check.

---

## 14. Acceptance criteria

**Global**
- [ ] Visual style, container width, spacing, typography and colors match the current onboarding page and use existing tokens only.
- [ ] Header, progress indicator and Back button occupy the same position on every screen; no layout shift between screens.
- [ ] All cards within a group are the same size at every breakpoint.
- [ ] Fully usable by keyboard and screen reader; focus is managed on screen change.
- [ ] No hardcoded copy or data in components.
- [ ] Refreshing at any point resumes at the correct screen with answers intact.

**Screen 1**
- [ ] Selecting `student` or `non_tech` saves and advances without extra taps.
- [ ] Selecting `it_services` or `product_tech` reveals year chips; selecting a chip saves and advances.
- [ ] Changing the card resets the chips.

**Screen 2**
- [ ] Six equal cards in fixed order; exactly one `Popular for you` badge matching section 7.
- [ ] "Not sure yet" assigns the default role and sets `roleIsDefault = true`.
- [ ] Back preserves previous answers.

**Screen 3**
- [ ] Title, stages and proof line reflect the saved answers.
- [ ] Default-role note appears only when `roleIsDefault` is true.
- [ ] `Start stage 1` marks onboarding complete and never shows onboarding again; `Change my role` returns to Screen 2.

**Quality**
- [ ] Unit tests pass for business rules; at least one test for the route guard.
- [ ] All events in section 10 fire once per action with the specified properties.
- [ ] Failed saves show the toast and revert the selection.

---

## 15. Open questions (ask me if blocking; otherwise use the stated assumption)

| Question | Assumption if unanswered |
| --- | --- |
| Which frontend framework, router and styling system? | Discover from the repo (step 1) |
| Existing API conventions and data store? | Use the contract in section 8, mocked if the backend is not ready |
| Existing analytics tool? | Create a thin `track()` wrapper |
| Final role names and stage names? | Use the drafted content in section 11; review against the full research before launch |
| Where does `Start stage 1` lead? | Dashboard, with a TODO |
