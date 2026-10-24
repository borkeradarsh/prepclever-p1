# Dashboard v2.1: Six Blocks, Seven Roles, Concept Map, Seamless Journey (for Claude Code)

Save as `docs/dashboard-v2-spec.md`, replacing the earlier v2 file. Read `CLAUDE.md` first. Work and commit on `master`; do not push.

This supersedes the course, stage and path model in `docs/dashboard-structure-spec.md` and `docs/dashboard-plan.md`. Keep what still applies: the `lib/data/*` contract, `canAccess`, per-widget Suspense and error boundaries, five states per data-driven widget, dev toggles, tokens, primitives, `pnpm screenshots`.

For this work only, the CLAUDE.md rule against editing onboarding and landing files is relaxed, **but only for the edits listed in section 3**.

## 0. Changes since the first v2 spec (apply to existing code if Session A already ran)

1. **Free/paid is decided:** Blocks 1 and 2 free, Blocks 3 to 6 paid (section 7).
2. **The concept map is the content spine** for Blocks 2 and 3 (section 4). It replaces the Parts I sketched earlier (Foundations, Cloud and so on). Data is in `content/concept-map.data.json` (provided).
3. **Pro plan content and a billing stub** (section 7).
4. **Journey and seams** (section 8): return-to links, situation carry-over from the landing page, no dead ends.
5. **Jobs** is a separate spec (`docs/jobs-spec.md`); only the nav entry and links are in this one.
6. New research docs 09 to 14 are in `docs/research/`.

## 1. Rules

1. **Do not invent content.** All content comes from `docs/research/` and `content/concept-map.data.json`. Anything missing is marked `coming_soon`, and you list it in your report.
2. **Every figure carries `sourceLabel`, `checkedOn`, `verified`.** Pay is labelled approximate. Example postings are labelled "example, may have closed".
3. **One source of truth** for roles (`content/roles.config.ts`), blocks (`content/blocks.config.ts`), concepts (`content/concepts.ts` over the JSON), plans (`content/plans.config.ts`). Landing, onboarding, sidebar and dashboard read them; none duplicates them.
4. **Lessons are the owner's own content.** Until a CMS exists, lesson bodies are placeholders in `lib/data/mock/` (`PLACEHOLDER CONTENT, TODO(cms)`), but lesson **titles come from each concept's real subtopics**.
5. No new dependencies. Persistence stays mock (cookies) behind `lib/data/*`.

## 2. Decisions locked

- Users pick one of **seven roles** in onboarding. The dashboard has no role picker; Explore shows all roles.
- Six blocks replace courses and stages. The sidebar expands and collapses.
- Block 3 topics in the sidebar are the user's role-relevant concepts from the concept map.
- Free: Blocks 1 and 2 plus previews. Pro: Blocks 3 to 6 plus the paid features in section 7.

## 3. Roles, tracks, fit, and edits outside the dashboard

**Roles** (ids used everywhere, including `concept-map.data.json`): `ml_engineer`, `genai_llm`, `ai_platform_mlops`, `ai_data_engineer`, `applied_scientist`, `ai_backend`, `ai_architect`. `roles.config.ts` fields: `id`, `title`, `shortDescription`, `titleVariants[]`, `yoeRange`, `typicalBackground`, `payBands` (sourced, approximate), `ladderNotes`, `examplePostings[]` (`{ title, company, url, checkedOn }`), `minYears` (0, 3, 4, 2, 0, 3, 10 in the order above). Take details from `docs/research/02-roles.md`; take the one-line descriptions from the concept map data.

**Onboarding card copy** (title at most 20 characters, description at most 60):

| id | Title | Description |
| --- | --- | --- |
| `ml_engineer` | ML Engineer | Build, train and ship ML models to production |
| `genai_llm` | GenAI / LLM Engineer | Build apps on LLMs: RAG, agents, evals |
| `ai_platform_mlops` | AI Platform / MLOps | Run the infrastructure that serves AI models |
| `ai_data_engineer` | AI Data Engineer | Build the data pipelines behind AI |
| `applied_scientist` | Applied Scientist | Experiments, stats and models for business problems |
| `ai_backend` | AI Backend Engineer | Backend services that integrate LLMs and models |
| `ai_architect` | AI Architect / Lead | Design AI platforms and lead teams (10+ years) |
| `not_sure` | Not sure yet | We'll start you on a good default |

**Tracks:** `fresher`, `switcher`, `mid`, `senior`.

```ts
deriveTrack(situation, yearsBand): Track
// student, non_tech         -> 'fresher' (non_tech is not covered by the research; flag it)
// it_services, product_tech -> '0-1' fresher, '2-5' switcher, '6-10' mid, '10+' senior
```

Year chips become `0-1, 2-5, 6-10, 10+`. Migrate saved cookies: `0-2` to `0-1`, `3-5` to `2-5`. Role id migration: `ml_mlops` to `ml_engineer`, `ai_platform` to `ai_platform_mlops`, `ai_data` to `ai_data_engineer`, `backend_to_ai` to `ai_backend`. Track label: `switcher` is "Service switcher" for `it_services`, "Early career" for `product_tech`.

**Defaults by track (assumption):** fresher `ml_engineer`, switcher `ai_backend`, mid `genai_llm`, senior `ai_architect`. Used for the "popular for you" badge and for "Not sure yet".

**Role fit** (pure): compare the track's lower bound (fresher 0, switcher 2, mid 6, senior 10) with `role.minYears`: `on_track` if years >= minYears, `stretch` if short by 2 or fewer, else `adjacent_first`. For `adjacent_first`, Block 1 shows `typicalBackground` as the realistic entry door.

**Allowed edits outside the dashboard**
1. **Onboarding:** 8 equal-size cards (2×4 grid); roles read from `roles.config`; new year chips and migrations; highlight by track; **situation carry-over**: if cookie `prepclever-intent` (set by the landing page, value one of the four situations, validated) exists, screen 1 opens with that card selected and a `Continue` button (chips shown if needed); clear the cookie when onboarding completes. Payoff screen shows the **six blocks** with Free or Pro chips; primary button `Start with Block 1` goes to `/roadmap/market/your-role`.
2. **Landing page:** the blueprint cards read title, summary, tier chip (Free or Pro) and status from `blocks.config`; the four situation options in the dark CTA panel set `prepclever-intent` before going to `/signup`; roles section and nav list seven roles; FAQ answer "Is it free?" becomes: `Blocks 1 and 2 of the roadmap are free. Pro unlocks Blocks 3 to 6 and the hands-on features as they launch.`; replace the claim "compensation that competes with product companies" with a sourced line (GCCs pay about 15 to 22% more than IT services; approximate, attributed to Zyoin per `02-roles.md` until verified); the 4 to 10 years statistic is worded "56% of GCC hiring is for 4 to 10 years of experience".
3. **`/start`:** onboarding incomplete goes to onboarding; complete with no item opened goes to `/roadmap/market/your-role`; otherwise `/dashboard`.

## 4. The concept map is the spine of Blocks 2 and 3

**Data:** `content/concept-map.data.json` (71 concepts, 8 domains, 7 roles), generated from `docs/research/14-ai-roles-concept-map.html`. Each concept: `id`, `title`, `domain`, `prerequisites[]`, `levels{roleId: 0|1|2}` (2 core, 1 good to know, 0 not needed), `description`, `topics[]` (4 subtopics), `practiceProject`. Write `content/concepts.ts` (typed loader, helpers) and tests: prerequisite ids exist, no cycles, every role has levels for every concept, core counts per role (ml_engineer 32, genai_llm 24, ai_platform_mlops 17, ai_data_engineer 17, applied_scientist 23, ai_backend 18, ai_architect 20).

**Role syllabus:** concepts where `levels[role] >= 1`. Parts are the 8 domains (Math and Stats, Programming and CS, Data, Classical ML, Deep Learning, LLMs and GenAI, MLOps and Infra, Systems and Leadership), showing only domains that contain at least one relevant concept. Each topic shows a `Core` or `Good to know` badge.

**Learning order** (pure, tested): Kahn's topological sort over the role's relevant concepts using `prerequisites` (ignore prerequisites that are level 0 for that role; show them as an "Optional prerequisite" hint). Among available concepts prefer core over good-to-know, then domain order, then file order.

**Concept (topic) page** `/roadmap/upskilling/[domain]/[concept]`:
- **Free preview (everyone):** title, badge, description, the four subtopics, practice project, prerequisites (linked), your audit rating.
- **Pro:** lessons. One lesson per subtopic (title from the subtopic, placeholder body) plus one project lesson from `practiceProject`. Each has type, duration (8 to 40 min), order.
- Free users see the lessons list with lock icons and a LockPanel; they never receive lesson bodies.

**Concept map page** `/roadmap/concept-map` (free; also under Explore): port the graph and role matrix from `docs/research/14-ai-roles-concept-map.html` into React with existing tokens, no new dependencies. Default to the user's role; clicking a concept opens its topic page. Keyboard accessible, with the matrix as the accessible alternative to the graph.

**Block 2 skill audit:** items are the role's relevant concepts. Rating: `not_started`, `learning`, `confident`. Points 0, 1, 2. Weights: core 2, good to know 1.

```
readiness = sum(weight * points) / sum(weight * 2)          // overall and per domain
gaps      = relevant concepts not rated 'confident', in learning order
```

Gap report (free): readiness %, per-domain bars, top five gaps (each links to its topic page), and the upgrade moment (section 8).

**Track plan item:** for `genai_llm`, use `docs/research/10-90-day-upskilling.md` (three phases, deliverables, interview pillars). For other roles use the track plans in `05-role-tracks.md`. Mark the role-specific timeline `coming_soon` for roles without one.

## 5. Information architecture

**Blocks** in `blocks.config.ts` (slug, title, summary, bullets from the owner's block list, `tier`, items): `market`, `gap-analysis`, `upskilling`, `positioning`, `referrals`, `interviews`.

| Block | Items (slug: kind, status) | Source |
| --- | --- | --- |
| 1 market (free) | `landscape`: guide, available; `your-role`: role page, available; `target-companies`: directory, available | 01, 02, 04, 05, 09 |
| 2 gap-analysis (free) | `skill-audit`: checklist, available; `gap-report`: report, available | concept map |
| 3 upskilling (Pro) | `concept-map`: map, available; concept topics by domain (section 4); `track-plan`: guide, available | concept map, 05, 10 |
| 4 positioning (Pro) | `resume`, `linkedin`, `github`: checklists, available; `resume-evaluate`: tool, coming soon | 06 |
| 5 referrals (Pro) | `where-to-apply`: directory, available (links to Jobs); `referral-outreach`: guide, coming soon; `application-tracker`: tool, coming soon | 04 |
| 6 interviews (Pro) | `interview-loop`, `prep-by-round`, `star-stories`: guides, available (STAR builder coming soon); the three pillars from `10-90-day-upskilling.md` | 04, 06, 10 |

Item: `{ slug, title, kind, status, access, estimatedMinutes }`. Every item page shows `Mark as done` (stored in `doneItems`) and Previous and Next links; the last item of a block links to the next block, the last block links to `/dashboard`.

**Page content (from research, rewritten into structured sections):**
- `landscape`: headline stats and city mix (01); an explainer "How GCC AI teams are organised" with the seven team functions from `09-ai-roles-in-gcc.md`, source label "Zinnov-Nasscom-Tiger Analytics GCC AI Maturity Playbook", plus the note that they are team functions, not a hiring checklist. Mark `verified: false` with `TODO(verify)`: the wording for Optimizer, Builder and Operator differs from the Zinnov source (zinnov.com/centers-of-excellence/7-roles-every-gcc-ai-team-needs-blog) and must be reconciled before launch.
- `your-role`: role summary, title variants, ladder, pay band (approximate, behind `showPay`, default true), example postings, your track's entry route (05), fit message, and a `See jobs for this role` link to `/jobs?role={id}`.
- `target-companies`: GCC launches table filterable by city and focus; unverified entries marked; each links to `/jobs?company=...`.
- `resume`, `linkedin`, `github`: checklist items taken from 06, each checkable, with progress.
- `where-to-apply`: job platforms, careers pages, enablers and staffing firms, campus programmes (04), with a prominent link to Jobs.
- `interview-loop`, `prep-by-round`: from 04 and 06.

**Routes (authenticated, under the app shell):**

| Route | Purpose |
| --- | --- |
| `/dashboard` | Home |
| `/roadmap` | The six blocks as a connected flow (cards joined by lines), each with tier chip, status and progress |
| `/roadmap/[block]` | Block overview with its items |
| `/roadmap/[block]/[item]` | Guide, checklist, tool, directory or report page |
| `/roadmap/concept-map` | Concept map |
| `/roadmap/upskilling/[domain]/[concept]` | Concept page |
| `/roadmap/upskilling/[domain]/[concept]/[lesson]` | Lesson page |
| `/explore`, `/explore/roles`, `/explore/roles/[roleId]`, `/explore/companies`, `/explore/hiring`, `/explore/resources`, `/explore/concept-map` | Explore (reuse components; concept map may redirect to the roadmap one) |
| `/jobs` | See `docs/jobs-spec.md` |
| `/profile`, `/upgrade` | As before, `/upgrade` per section 7 |

Redirect `/path` to `/roadmap`, `/courses` and `/courses/*` to `/roadmap/upskilling`. Public `/roles` and `/companies` stay public.

**Sidebar** (280 px expanded, 72 px collapsed, state in a cookie so the server renders it without a flash; toggle has `aria-expanded`; independent scroll; `aria-current="page"`):
- **Header:** logo, role chip with role and track label (links to Profile).
- **Home context:** Home; ROADMAP (six blocks with status icons and lock icons on Pro blocks for free users); Jobs; EXPLORE (Roles, Companies, Concept map, Resources); Profile; Upgrade (hidden for Pro).
- **Block context** (inside a block): `← Roadmap`; block title and progress; Overview; the block's items. **Block 3:** domains as collapsible groups containing concepts (Core and Good to know badges, completion ticks, lock icons for lessons), current domain expanded.
- Locked items stay clickable and open their lock page; nothing is hidden.
- **Top bar:** breadcrumb, plan badge, Upgrade (Free only), user menu. **Mobile:** sidebar becomes a drawer (focus trap, Escape closes); bottom tab bar with Home, Roadmap, Jobs, Explore; Profile is in the user menu; inside a block the top bar has a `Contents` button.
- Style: existing tokens only, card surface with a soft border, same rose accent and heading font as onboarding.

## 6. Home (`/dashboard`)

Two columns on desktop, single column below 1024 px; per-widget Suspense and error boundary; five states each.
1. **Greeting row:** name, role chip with track label, plan badge.
2. **Continue card:** the next recommended item. Order: unfinished Block 1 items; the skill audit; the gap report; then the first gap in learning order (locked variant for free users); then Blocks 4 to 6 in order. Locked variant: `Unlock Block 3 with Pro`, secondary `Review your gap report`.
3. **Journey:** the six blocks as cards with tier chip, status and progress; current block expanded with its next two items.
4. **This week**, **GCC pulse** (role stats from `stats.config`), **Profile readiness** (derived from Block 4 checklist progress; hidden when complete).
5. At most one upgrade prompt on any page besides the nav button.

## 7. Access, plans, billing stub

```ts
ACCESS_RULES = {
  blocks: { market:'free', 'gap-analysis':'free', upskilling:'paid', positioning:'paid', referrals:'paid', interviews:'paid' },
  freePreview: { itemTitleAndSummary: true, conceptOverview: true },   // concept description, subtopics, practice project
  jobs: 'free',
}
```

`canAccess(user, item)` stays the only check; per-item `access` can override the block default. Free users see every block, item and concept title with lock states and the concept previews; locked bodies are never rendered or sent to the client.

**Plans** (`content/plans.config.ts`, from `docs/research/11-free-paid-tier.md`); each feature `{ label, status: 'available' | 'coming_soon' }`:
- **Free:** the roadmap flow, Blocks 1 and 2, concept overviews, the concept map, jobs, resource library (available); basic progress tracking (available); community discussion (coming soon).
- **Pro** (everything in Free plus): Blocks 3 to 6 content (available); production-grade project specs and solutions (available where lessons of type project exist); interactive quizzes and checkpoints (available where lessons of type quiz exist); hands-on labs, AI learning assistant, verifiable certificates (coming soon).
- **Teams:** team management and analytics dashboard (coming soon), contact only.
- Price ranges from the doc (Pro $12 to $29 a month, Teams $19 to $49 per seat a month) go in config as `priceRange`, with `showPrices: false` until the owner sets final prices. Do not show "coming soon" features as purchasable benefits without the chip.

**Billing stub** `lib/billing.ts`: `startUpgrade({ source, returnTo })`. Development: sets the plan to `pro` (mock) and redirects to `returnTo`. Production: no payment exists yet, so show a "Pro is opening soon" state and fire `upgrade_interest`. `TODO(payments)`.

## 8. Journey and seams

| Step | Behaviour |
| --- | --- |
| Landing | Choosing a situation sets `prepclever-intent` then goes to `/signup` |
| Sign up or log in | Returns to `returnTo` if present and safe; otherwise to `/start` |
| Onboarding | Screen 1 preselects the carried situation with `Continue`; screen 2 role; payoff shows six blocks with Free or Pro chips; button `Start with Block 1` |
| Block 1 | Each item has Mark as done and Next; last item links to Block 2 |
| Block 2 | Audit autosaves; gap report is free and ends with the upgrade moment |
| Upgrade moment | Gap report shows the top five gaps and a card `Close these gaps with Pro` linking to `/upgrade?from=gap-report&returnTo=/roadmap/upskilling` |
| Upgrade | `/upgrade?from=...&returnTo=...` shows Free vs Pro; the action calls `startUpgrade`; success returns to `returnTo` |
| Block 3 to 6 | Pro users continue from the first gap; free users see lock pages |
| Returning | Login goes to `/dashboard`; Continue card resumes |

Rules:
1. **No dead ends.** Every page has a next action. Every locked page offers one upgrade action and one free alternative (for example `Back to your gap report`).
2. **`returnTo` is validated** by a pure function: must start with a single `/`, not `//`, no scheme, no backslash. Unsafe values fall back to `/dashboard`.
3. **Deep link to a locked item** shows its lock page; after upgrading the user returns to that item.
4. **Upgrade entry points** (all set `from`): locked page, sidebar lock, Continue card, gap report, nav button, profile plan card.
5. **Both auth modes work end to end:** with `NEXT_PUBLIC_AUTH_ENABLED` on and off.
6. **State survives** login, signup and refresh (cookie now, database later).
7. Pro users see no locks and no Upgrade button.

## 9. Data model and functions (extend `types/domain.ts`)

```ts
type BlockId = 'market'|'gap-analysis'|'upskilling'|'positioning'|'referrals'|'interviews';
type Track = 'fresher'|'switcher'|'mid'|'senior';
type ItemKind = 'guide'|'checklist'|'tool'|'directory'|'role-page'|'report'|'map';
type Rating = 'not_started'|'learning'|'confident';
interface Concept { id: string; title: string; domain: DomainId; prerequisites: string[]; levels: Record<RoleId, 0|1|2>; description: string; topics: string[]; practiceProject: string }
interface UserProfile { roleId: RoleId; track: Track; situation: Situation; yearsBand: YearsBand | null }
interface Progress { completedLessonIds: string[]; auditRatings: Record<string, Rating>; checklistDone: string[]; doneItems: string[]; lastItem: string | null; weeklyGoalSessions: number | null; sessionsThisWeek: number; streakDays: number }
```

Async, mock-backed: `getProfile`, `getBlocks`, `getBlock`, `getBlockItem`, `getRoleSyllabus` (domains and concepts in learning order), `getConcept`, `getGapReport`, `getNextRecommended`, `setRating`, `toggleChecklistItem`, `markItemDone`, `getRole(s)`, `getCompanies`, `getResources`. Keep `getUser`, `getPulse`, `getProgress`, `markLessonComplete`, `setWeeklyGoal`. Remove `getPath`, `getCourses`, `getCourse`.

**Persistence limit:** progress is a cookie. Encode compactly (ratings as a digit string in concept order, completions and done items as indexes) and test that the worst case stays under 3.5 KB. `TODO(persistence)`: moves to the database next.

## 10. Tests

`deriveTrack`; `roleFit`; cookie migrations; defaults by track; concept data integrity; learning order (prerequisites always precede, core preferred, every role); gap report scoring; `getNextRecommended` across states; access by block and preview rules; `returnTo` validator; intent cookie validation; config invariants (landing blueprint and onboarding cards derive from configs; every plan feature has a status; every figure has source and date; title and description lengths); cookie size.

## 11. Out of scope

Resume Evaluate, application tracker, STAR builder, outreach templates, labs, AI assistant, certificates, community, payments, real lesson content, persistence beyond cookies. Jobs are in `docs/jobs-spec.md`.

## 12. Build order (one session each; checkpoint = typecheck, lint, tests, `pnpm screenshots` reviewed)

**Session A, data and edits:** concept data and helpers, roles, tracks, migrations, `blocks.config`, `plans.config`, access rules, billing stub, `returnTo` and intent logic, all section 3 edits, new data layer, tests. The app must still build.

**Session B, shell and learning:** sidebar (both contexts, collapse, drawer, bottom tabs), routes and redirects, `/roadmap` flow, block pages, concept pages and lessons, concept map port, skill audit and gap report, lock pages, `/upgrade`.

**Session C, content, home and polish:** Block 1, 4, 5, 6 guides and Explore pages from research, `/start`, Home widgets on the new model, journey seams (Next links, Mark as done), keyboard, reduced-motion, contrast, final acceptance run.

## 13. Acceptance criteria

- [ ] Onboarding shows 8 equal-size cards; saved role is one of the seven; old cookies still work; the landing situation is preselected.
- [ ] Track derivation correct for every situation and band.
- [ ] Roles, blocks and plans have one definition each; landing, onboarding, sidebar and dashboard agree.
- [ ] Block 3 shows the role's concepts grouped by domain in valid prerequisite order, with Core and Good to know badges.
- [ ] Concept pages show the free preview; lessons are locked for free users and never sent to the client.
- [ ] Skill audit saves; the gap report is free, ends with the upgrade card; Continue recommends the first gap.
- [ ] Blocks 1 and 2 are fully open to free users; Blocks 3 to 6 lock pages show one upgrade action and one free alternative.
- [ ] Upgrade returns users to where they came from; unsafe `returnTo` values are rejected.
- [ ] No "coming soon" feature is presented as available.
- [ ] Every number has a source label; example postings labelled; pay labelled approximate.
- [ ] Works at 375, 768 and 1280 px, no horizontal scroll; drawer keyboard accessible; concept map keyboard accessible.
- [ ] Typecheck, lint and tests pass; no new dependencies.
