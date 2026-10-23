# PrepClever dashboard — session 1: foundation, primitives and app shell

## Context

PrepClever has a marketing landing page and a working onboarding flow, but nothing after
onboarding: `/dashboard` does not exist and finishing onboarding drops the user back on `/`.
`docs/dashboard-structure-spec.md` specifies the whole post-onboarding app.

This session builds **everything underneath the dashboard** — tokens, domain types, pure
logic with tests, copy configs, the mock data layer, the missing UI primitives, the app
shell, the four minimal pages and the lesson placeholder — plus a **temporary `/dashboard`
page that renders the shell with placeholder content**, so the shell can be seen and
screenshotted. The five dashboard widgets, the dev toolbar, the route guard and the
redirect changes are deliberately deferred to the next session.

**Hard constraints for this session (user-set):**

- **No file under `components/auth/` or `components/auth/onboarding/` is edited.** Not
  `OnboardingFlow.tsx`, not the configs. The proof stat lives in `content/stats.config.ts`
  as a **literal**, with a test locking that literal, so a later session can do the
  extraction safely.
- **No `middleware.ts`, no `/start` route, no redirect changes.** `/dashboard` is therefore
  unguarded and unreachable from onboarding this session — reach it by typing the URL.
- No dashboard widgets, no `DevToolbar`, no server actions beyond the one the lesson
  placeholder needs.
- No new dependencies. pnpm only.
- Accepted as-is: the `Welcome back` greeting with no name (R1), and the lesson
  breadcrumb's course crumb being plain text rather than a link (R3).

**Step 0:** copy this plan to `docs/dashboard-plan.md` and commit it as the first commit,
so the deferred work is recorded in the repo.

---

## 1. Tokens — `app/globals.css` (modify, additive only)

The dashboard must match **onboarding's soft card language**, not the sharp-cornered
marketing pages — but onboarding hardcodes those values in styled-jsx
(`rgb(140 123 138 / 18%)`, `#8b5c71`, `0.65rem`). Add the missing tokens so new code is
token-pure per CLAUDE.md §5. **No existing value changes** — `--radius-card: 0.25rem` stays
for the marketing pages.

To `:root`:

```
--radius-soft-lg: 1.25rem;  --radius-soft-md: 0.65rem;  --radius-soft-sm: 0.45rem;
--border-soft: rgb(140 123 138 / 18%);  --border-soft-strong: rgb(140 123 138 / 32%);
--surface-card: rgb(253 252 251 / 98%);
--shadow-soft: 0 0.25rem 0.75rem rgb(49 38 59 / 4%);
--shadow-soft-hover: 0 0.5rem 1rem rgb(49 38 59 / 8%);
--shadow-soft-raised: 0 1.5rem 4rem rgb(49 38 59 / 8%);
--accent-ink: #8b5c71;  --accent-ink-strong: #6f5362;  --danger-ink: #b34545;
--focus-ring: rgb(162 103 131 / 30%);
--app-max-width: 1120px;  --reading-max-width: 720px;
--app-nav-height: 4rem;  --app-tabbar-height: 3.75rem;
--font-size-page-title: clamp(1.75rem, 4.5vw, 2.25rem);  --line-height-page-title: 1.12;
```

To `@theme inline`: `--font-heading: "Formula", ui-sans-serif, sans-serif` plus
`--color-border-soft`, `--color-surface-card`, `--color-accent-ink`,
`--color-accent-ink-strong`, `--color-danger-ink`, `--radius-soft-lg|md|sm`,
`--shadow-soft|-hover|-raised`.

**Font conflict resolved additively:** `--font-display` is Editorial but onboarding headings
use Formula, and `app/page.tsx` uses *both* deliberately. So `--font-display` is left
untouched and a new `--font-heading` → Formula is added. New code uses `font-heading`
instead of the `font-[Formula]` arbitrary-value escape. Zero regression; gives a real token
to migrate onboarding's raw `font-family` to later (`docs/onboarding-gaps.md` #13).

One base rule, for the mobile tab bar clearance:

```css
.app-body { padding-bottom: calc(var(--app-tabbar-height) + 1rem); }
@media (min-width: 768px) { .app-body { padding-bottom: 0; } }
```

New app-shell code uses **Tailwind utilities only, no styled-jsx** — styled-jsx stays
confined to the existing auth/marketing files it already lives in.

---

## 2. Domain types and pure logic (+ tests)

**`types/domain.ts`** (new root `types/` folder, per CLAUDE.md — *not* `lib/types`). Spec §4
verbatim, re-exporting `RoleId` / `Situation` from `components/auth/onboarding/types`
(import only — no edit). Plus the derived shapes the later widgets will need:
`StageState = 'done' | 'in_progress' | 'up_next' | 'locked'`, `StageProgress`,
`PathProgress`, `LessonRef = { course: Course; lesson: Lesson }`. No barrel file.

**`lib/access.ts`** — `ACCESS_RULES`, `canAccess(user, item)`, `canViewRoadmapDetail(user)`,
exactly spec §6, driven only by `ACCESS_RULES` and `item.access`. Pure, types-only imports.
**The only place this logic exists** — verified at the end with a grep for `=== 'pro'`
outside this file.

**`lib/progress.ts`** — all derivation, pure, no React:
`deriveStageProgress`, `findNextLesson` (first incomplete by stage → course → `lesson.order`;
`null` when complete), `isFirstRun`, `weeklyGoalState`, `readinessSummary`, `courseProgress`,
`orderedLessons`.

**`lib/routes.ts`** — the single source of URLs, dependency-free: `routes.{dashboard, path,
courses, profile, upgrade, onboarding}` and `routes.lesson(courseSlug, lessonSlug)`.

**`lib/dev-flags.ts`** — pure parse/serialize for a `prepclever-dev` cookie
(`scenario: 'first-run' | 'in-progress' | 'complete'`, `plan`, `fail`, `slow`), with a hard
production gate that always returns defaults. Built and tested now because the mock layer
reads it; **nothing writes it this session** (that was the middleware's job) — so scenarios
are switched by setting the cookie manually in devtools until the next session.

**`lib/analytics.ts`** — `track(event, props?)` typed to the 11 event names in spec §13;
`console.debug` in dev, no-op with `TODO(analytics)` in prod.

**Tests** (beside source, Vitest `environment: node`, in the style of
`components/auth/onboarding/config.test.ts`):
- `lib/access.test.ts` — the free/paid × free/pro matrix, and a **rule-flip test** that
  proves changing `ACCESS_RULES.roadmapDetail` changes behaviour (spec §15, as executable
  proof rather than a claim).
- `lib/progress.test.ts` — `findNextLesson` across the three seeds; `deriveStageProgress`
  state machine (exactly one `in_progress`, no `up_next` ahead of an incomplete stage);
  `weeklyGoalState` for `null` / partial / met / exceeded; `readinessSummary`.
- `lib/routes.test.ts`, `lib/dev-flags.test.ts` — including the production hard gate.

---

## 3. Content configs

- **`content/stats.config.ts`** — ~7 GCC stats from `docs/research/01-gcc-landscape-in-india.md`, typed
  `GccStat = PulseItem & { id: string }`, each with `sourceLabel`, ISO `checkedOn`,
  `verified`, and a `// TODO(verify)`. Includes `talent_gap` with `verified: false` so the
  later "Unverified" dev marker has something to show. Also `pulseStatIdsByRole`
  (3–4 per `RoleId`), `onboardingProofStatId = 'hiring_ai_growth'`, `getStat`,
  `getStatsForRole`.
  `hiring_ai_growth.text` is the **literal** string currently hardcoded in
  `OnboardingFlow.tsx:13` — byte-identical, so the future extraction is a no-op visually.
  `OnboardingFlow.tsx` is **not touched**.
- **`content/nav.config.ts`** — Home / My path / Courses / Profile with lucide icons
  (`House`, `Route`, `Library`, `User` — `lucide-react` is already a dependency).
- **`content/pages.config.ts`** — title, subtext and "coming next" copy for `/path`,
  `/courses`, `/profile`, `/upgrade`, and the lesson page's lock copy.
- **`content/dashboard.config.ts`** — the greeting and shared state copy the temporary page
  and the later widgets both need, including the repo's established error voice
  `"Couldn't load this. Try again."`. Widget-specific copy blocks are stubbed with their
  keys so next session fills values, not structure.

No user-facing string lives in a component.

---

## 4. Mock data layer

- **`lib/data/index.ts`** — *the contract*: the 11 functions of spec §5 with exactly those
  signatures, delegating to `./mock`. One comment: signatures are the contract (CLAUDE.md
  §4); swapping in a CMS module changes no caller.
- **`lib/data/mock/catalogue.mock.ts`** — the realistic content, generated from the
  **existing `paths` config** so stage names and outcomes can never diverge from onboarding,
  then 1–2 courses per stage with 4–6 lessons each, titled from the research (e.g. for
  `genai_llm` stage 1: "Python for AI engineers" / "Working with LLM APIs", lessons like
  "Your first chat completion call", "Structured outputs with JSON schema", "Checkpoint: a
  typed LLM wrapper"). File header banner: `// PLACEHOLDER CONTENT — research-derived mock
  data … Replace with CMS. TODO(cms).` Invariants in code: 4 stages per role, dense `order`,
  unique kebab-case slugs, `lessons[0].access === 'free'` and the rest
  `ACCESS_RULES.defaultLessonAccess`, durations 10–60 min.
- **`lib/data/mock/scenarios.ts`** — the four acceptance scenarios as `Progress` seeds.
  `in-progress` is tuned so that on a **free** plan the next lesson is paid (which is exactly
  the locked ContinueCard case next session needs) and on **pro** it is open.
- **`lib/data/mock/store.ts`** — `cookies()`-based reads: dev flags, and a
  `prepclever-progress` override merged over the scenario seed. `latency()` 200–500 ms
  (2000 ms when `slow`), `maybeFail(key)` for the error states. Progress is stored as a
  **delta only, never the seed**, with a `TODO(persistence)` noting the 4 KB cookie ceiling.
- **`lib/data/mock/user.mock.ts`** — `getUser()`: plan from dev flags, `firstName` from
  `lib/user/profile.ts`. Role and situation for `getPath()` come from the real
  `prepclever-onboarding` cookie (read-only), falling back to `highlightBySituation` then
  `genai_llm`.
- **`lib/data/mock/readiness.mock.ts`** — four items from the research doc's "06 · Profile
  Prep" segment: resume, GitHub, LinkedIn, target city.
- **`lib/user/profile.ts`** — `getFirstName(): Promise<string | null>`: Supabase server
  session `user_metadata.full_name` → `prepclever-name` cookie → `null`. Never throws.
  **Accepted limitation (R1):** no name is collected anywhere in the product today, and auth
  is disabled by default, so this returns `null` and the greeting reads `Welcome back`. Email
  local-part is deliberately *not* used as a name — it produces junk like "Sarvind1652".
  Fixing this properly needs a name step in onboarding, which is out of bounds this session.

**Tests:** `lib/data/mock/catalogue.test.ts` (all 5 roles: 4 stages matching the onboarding
config's names and outcomes, 4–6 lessons per course, exactly lesson 1 free, unique slugs,
`getLesson` resolves every generated pair) and `lib/data/mock/scenarios.test.ts` (each of the
four scenarios yields the intended shape — notably that `in-progress` + free produces a next
lesson that **fails** `canAccess`, and `complete` yields `findNextLesson === null`).
`content/stats.config.test.ts` locks the proof literal, id uniqueness, ISO dates, and that
`pulseStatIdsByRole` covers every role with only real ids.

---

## 5. UI primitives — `components/ui/`

New files matching the existing six exactly: named export, local
`type XProps = <DOMAttributes> & {…}`, `className = ""` destructured and appended last,
`...props` spread, token-based Tailwind, server-safe unless they own a handler.

| File | Purpose |
|---|---|
| `SoftCard.tsx` | The onboarding card, reusable: `--radius-soft-lg`, `--border-soft`, `--surface-card`, `--shadow-soft`. `tone="accent"` adds the rose top border for the later ContinueCard. **This is what makes the app read as the same product as onboarding.** `Card.tsx` is left untouched — it is the sharp marketing card and is currently imported by nothing. |
| `Chip.tsx` | Role chip and the later goal chips; `as="span" \| "button"`, `selected`, 44 px tap target, `aria-pressed` when a button. |
| `Progress.tsx` | `ProgressBar` (`role="progressbar"` + aria values, 0.25 rem track like `.onboarding-progress`) and `SegmentedProgress`. |
| `Skeleton.tsx` | `Skeleton` + `SkeletonText`; `bg-surface-muted` like the onboarding skeleton, pulse under `motion-safe:` only. |
| `EmptyState.tsx` | Used by all four minimal pages. |
| `ErrorState.tsx` | `"use client"` (owns a retry button); the repo's error voice; `--danger-ink`. |
| `LockPanel.tsx` | Lock icon + what unlocks it + one upgrade action. **Muted, never blurred, content always visible** (CLAUDE.md §5). Named `LockPanel` not `LockOverlay` because nothing overlays. |
| `Stat.tsx` | Value + text + source line; for the later GccPulse. |
| `Avatar.tsx` | Initial, degrading to a neutral glyph when the name is `null` — required by R1. |

**Not built: `Tabs`.** Spec §14 lists it but nothing in scope renders tabs, and CLAUDE.md
§5 says build a primitive once *and use it everywhere* — not build unused ones. Flagged in
the deferred list, not silently dropped.

**Shared feature components** (`features/shared/`): `LessonRow.tsx` (type icon, `{n} min`,
completion tick, lock icon — the row the lesson page's prev/next and next session's
PathOverview both use), `StageCard.tsx`, `StageStateBadge.tsx`.

---

## 6. App shell

`app/(app)/` route group, so the five app pages share one shell and the marketing and auth
pages are untouched. No root `page.tsx` in the group, so `app/page.tsx` keeps `/`.

- **`app/(app)/layout.tsx`** — server. `.app-body` wrapper + `AppTopBar` + `<main>` +
  `MobileTabBar`. Fetches `getUser()` **once** here for the plan badge and user menu, inside
  a try/catch that degrades to a nav without the badge — the shell must never 500.
- **`components/layout/app/AppTopBar.tsx`** — logo → `/dashboard`; nav links (hidden under
  768 px); right side plan `Badge` (`Free`/`Pro`), an `Upgrade` button only on Free, and the
  user menu. `border-b border-border-soft`, translucent surface + backdrop blur, reusing the
  existing `navbar-shell` idiom rather than inventing a second header language.
- **`components/layout/app/NavLink.tsx`** — `"use client"`, `usePathname()`; active link gets
  the rose accent underline and `aria-current="page"`.
- **`components/layout/app/MobileTabBar.tsx`** — `"use client"`, `fixed bottom-0 md:hidden`,
  four icon + label tabs, 44 px targets, safe-area inset padding, `aria-current`.
- **`components/layout/app/UserMenu.tsx`** — `"use client"`, `aria-expanded` +
  `aria-haspopup="menu"`, Escape and outside-click close, focus returns to the trigger.
  Sign out calls `supabase.auth.signOut()` when auth is enabled, else a `TODO(auth)` no-op
  routing to `/`.
- **`components/layout/app/AppContainer.tsx`** — `width="app" | "reading"` → 1120 px / 720 px,
  `px-4 md:px-8` (16 px mobile, 32 px desktop per CLAUDE.md §5). Distinct from the existing
  `Container`, which is 1200 px with marketing padding.
- **`components/layout/app/PageHeader.tsx`** — the one header pattern: `h1` in `font-heading`
  at `--font-size-page-title`, one line of muted subtext, optional right-hand action.
  **The only `h1` on each page.**

`app/layout.tsx` metadata is corrected from the stale `"Placeholder Analytics Platform"` to
PrepClever — one line, since this is the first real app surface.

---

## 7. Pages

- **`app/(app)/dashboard/page.tsx` — temporary.** `PageHeader` ("Welcome back" + subtext)
  and a placeholder two-column grid (`lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6`,
  single column under 1024 px) holding five `SoftCard`s labelled with the widget names and
  their reserved heights. This exists **to prove the shell, the container width, the grid
  and the mobile stacking order**, and is replaced wholesale next session. Marked with a
  `TODO(widgets)` banner comment so nobody mistakes it for finished work.
- **`/path`, `/courses`, `/profile`, `/upgrade`** — each `AppContainer` + `PageHeader` +
  `EmptyState` from `content/pages.config.ts`. `/upgrade` also carries the
  `TODO(payments)` marker.
- **`app/(app)/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx`** — reading width 720 px.
  `getLesson()` → `notFound()` when null; then the `canAccess` gate. Unlocked: breadcrumb
  (`Courses / {course.title} / {lesson.title}` — the **course crumb is plain text**, since
  `/courses/[courseSlug]` is out of scope; accepted as R3, and the lock panel's secondary
  action reads `Back to courses`), `h1`, meta row, one placeholder content block, a
  `Mark as complete` button, prev/next `LessonRow` links. Locked: title + meta +
  `LockPanel`, with the function **returning before any body field is touched** — the lesson
  body is never rendered *or* fetched for a user who fails `canAccess` (spec §10, §15).
  `Mark as complete` is the one server action this session
  (`features/lesson/actions.ts`, `markLessonCompleteAction` → `revalidatePath`).
- **`app/(app)/error.tsx`** — route-level boundary with a retry, so a thrown fetch shows a
  message rather than a crash while the per-widget boundaries do not yet exist.

---

## 8. Commits

One logical commit per step, with `pnpm typecheck && pnpm lint && pnpm test` green before
each:

1. `docs: add dashboard build plan`
2. `feat: add soft-surface design tokens and heading font token`
3. `feat: add domain types, access rules and progress logic with tests`
4. `feat: add dashboard content configs`
5. `feat: add mock data layer behind lib/data`
6. `feat: add dashboard UI primitives`
7. `feat: add app shell with mobile tab bar`
8. `feat: add minimal app pages and lesson placeholder`

---

## 9. What to check (hand-off)

Run:

```
pnpm typecheck && pnpm lint && pnpm test
pnpm dev
```

`/dashboard` is **not reachable from onboarding this session** (no guard, no redirect) — open
it directly at `http://localhost:3000/dashboard`.

**Screenshots at 375 / 768 / 1280 px**, which I will take and check before reporting:

| Width | What must be true |
|---|---|
| 375 | Top bar shows logo + user menu only; bottom tab bar visible with four icon+label tabs; placeholder cards single-column in the order Continue → Path → This week → Pulse → Readiness; content clears the tab bar; no horizontal scroll |
| 768 | Nav links appear in the top bar, tab bar gone; still single column (the 2-column break is 1024 px) |
| 1280 | Two columns at roughly 2:1 with a 24 px gap; container capped at 1120 px and centred; plan badge and Upgrade button present |

**Then please eyeball these yourself:**

1. **Does the shell look like onboarding?** Open `/onboarding/situation` and `/dashboard`
   side by side — same card softness, same rose accent, same heading font (Formula), same
   border weight. This is the main subjective call and the one I most want your eye on.
2. `/path`, `/courses`, `/profile`, `/upgrade` — header + "coming next" state, active nav
   link underlined correctly on each.
3. A lesson URL from the mock catalogue (printed in the hand-off) on `plan=free`: lesson 1
   opens, lesson 2 shows the lock panel, and `view-source` contains no lesson body.
4. Keyboard only: tab through top bar → page → tab bar; visible rose focus ring everywhere;
   `Escape` closes the user menu and returns focus to its trigger.
5. `prefers-reduced-motion: reduce` in devtools — no skeleton pulse, no transitions.

---

## 10. Deferred to the next session

- The five dashboard widgets with all five states each, `WidgetFrame` / `WidgetBoundary`
  per-widget Suspense + error isolation, and the greeting row's real data.
- `DevToolbar` and the middleware that captures `?scenario=&plan=&fail=&slow=` into the dev
  cookie. Until then, set `prepclever-dev` by hand in devtools.
- `middleware.ts` route guard, `/start`, and the four
  `window.location.assign("/")` → dashboard/first-lesson redirect fixes.
- Extracting the proof stat in `OnboardingFlow.tsx` to `content/stats.config.ts`
  (the literal and its lock test ship now, so this becomes a safe 3-line change).
- `Tabs` primitive, `content/plans.config.ts` + the real upgrade comparison, `/path`
  timeline, `/courses` grid, course detail.
- `docs/onboarding-gaps.md` items untouched: #1 (firstName), #3 (guard), #4 (the three real
  onboarding routes), #5 (completion routing), #13 (onboarding's raw hex — `--font-heading`
  now exists to migrate to).
