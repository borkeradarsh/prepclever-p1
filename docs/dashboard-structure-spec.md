# Post-Onboarding App Structure: Build Spec (for Claude Code)

Read `CLAUDE.md` first; its rules apply to everything here. Visual style continues the onboarding screens (see `onboarding-ui-fix-spec.md`): same tokens, same card and chip styling, same rose accent, same spacing logic. The dashboard must look like the same product as onboarding.

## 1. Scope

**Build now (structure only):**
- Route structure and route guard
- App shell: top navigation, user menu, mobile bottom tab bar
- Pages: Dashboard, My path, Courses, Course detail, Lesson (placeholder), Profile, Upgrade (stub)
- Dashboard widgets with all five states
- Typed domain model, a data layer returning mock data, and the access rule (`canAccess`)

**Not now:** CMS, real course or lesson content, video, payments, emails or notifications, search, community, interview prep, analytics dashboards. Anything content-shaped is mock data behind `lib/data/*`.

## 2. Routes

| Route | Purpose |
| --- | --- |
| `/dashboard` | Home after login |
| `/path` | Full roadmap for the user's role |
| `/courses` | Courses grouped by stage |
| `/courses/[courseSlug]` | Course overview with lesson list |
| `/courses/[courseSlug]/lessons/[lessonSlug]` | Lesson page (placeholder body) |
| `/profile` | Onboarding answers, readiness checklist, plan |
| `/upgrade` | Plan comparison stub, no payment |

**Guard:** if onboarding is not complete, redirect to onboarding. After onboarding completes, the payoff screen's primary button goes to the user's first lesson (`/courses/{firstCourse}/lessons/{firstLesson}`). If no course exists for the role in mock data, go to `/dashboard`.

## 3. App shell

- **Top bar (desktop and tablet):** logo left; links Home, My path, Courses, Profile; right side plan badge (`Free` or `Pro`), an `Upgrade` button when on Free, and a user menu (avatar, name, Profile, Sign out). Active link has the accent underline.
- **Mobile (under 768 px):** top bar shows only logo and user menu; a **bottom tab bar** carries the four links with icons and labels. Content has bottom padding so the tab bar never covers it.
- **Page container:** centered, max-width 1120 px (reading pages 720 px). Every page starts with the same header pattern: `h1`, one line of muted subtext, optional action on the right.
- The shell is rendered once in a layout; pages never re-implement navigation.

## 4. Domain model (TypeScript, in the existing `types/` folder)

```ts
export type Access = 'free' | 'paid';
export type Plan = 'free' | 'pro';
export type LessonType = 'video' | 'reading' | 'quiz' | 'project';

export interface Lesson {
  id: string; slug: string; title: string;
  type: LessonType; durationMin: number; order: number;
  access: Access;
}
export interface Course {
  id: string; slug: string; title: string; summary: string;
  stageId: string; lessons: Lesson[];
}
export interface Stage {
  id: string; order: number; name: string; outcome: string;
  courseIds: string[];
}
export interface Path {
  roleId: RoleId; situation: Situation;
  title: string;            // e.g. "Service-company engineer → GenAI Engineer at a GCC"
  stages: Stage[];
}
export interface Progress {
  completedLessonIds: string[];
  lastLessonId: string | null;
  weeklyGoalSessions: number | null;   // null until the user sets it
  sessionsThisWeek: number;
  streakDays: number;
}
export interface User { id: string; firstName: string | null; plan: Plan; }
export interface PulseItem { text: string; sourceLabel: string; checkedOn: string; verified: boolean; }
export interface ReadinessItem { id: string; label: string; done: boolean; }
```

`RoleId` and `Situation` come from the existing onboarding types.

## 5. Data layer (`lib/data/*`)

Async functions with fixed signatures. Mock implementations live in `lib/data/mock/` and simulate latency (200 to 500 ms) and an occasional failure behind a dev flag, so loading and error states can be seen.

```ts
getUser(): Promise<User>
getPath(): Promise<Path>
getCourses(): Promise<Course[]>
getCourse(slug: string): Promise<Course | null>
getLesson(courseSlug: string, lessonSlug: string): Promise<{ course: Course; lesson: Lesson } | null>
getProgress(): Promise<Progress>
getNextLesson(): Promise<{ course: Course; lesson: Lesson } | null>   // derived
getPulse(roleId: RoleId): Promise<PulseItem[]>
getReadiness(): Promise<ReadinessItem[]>
setWeeklyGoal(sessions: number): Promise<Progress>
markLessonComplete(lessonId: string): Promise<Progress>
```

**Mock content:** generate the stages for the user's role from the existing `paths.config` (4 stages per role). For each stage create one or two clearly labelled placeholder courses with 4 to 6 placeholder lessons ("Lesson title placeholder"). Pulse items come from the existing `stats.config`. Lesson 1 of every course has `access: 'free'`, all other lessons `'paid'`.

## 6. Access rule (`lib/access.ts`)

```ts
export const ACCESS_RULES = {
  roadmapDetail: 'paid' as Access,   // who can see courses and lessons inside each stage
  defaultLessonAccess: 'paid' as Access,
};

canAccess(user, item): boolean              // item has an `access` field
canViewRoadmapDetail(user): boolean         // uses ACCESS_RULES.roadmapDetail
```

- Lesson open: `lesson.access === 'free' || user.plan === 'pro'`.
- Roadmap: **all users see the four stages** (name, outcome, progress for stage 1). Free users see lock states and counts ("2 courses · 9 lessons") for stages beyond the free content; the course and lesson lists inside a stage are visible only if `canViewRoadmapDetail(user)`.
- These are the only places this logic exists. Unit-test both functions.
- A dev-only toggle (query string or env flag) switches the mock user between `free` and `pro` for testing.

## 7. Dashboard (`/dashboard`)

**Layout:** two columns on desktop (main column about two thirds, side column one third, 24 px gap), single column under 1024 px with this order: greeting, Continue, Path, This week, GCC pulse, Profile readiness.

**Greeting row:** `Welcome back, {firstName}` (h1), role chip showing the target role (`Aiming for: GenAI / LLM Engineer`, links to Profile to change), plan badge. No other content.

**Widgets**

| Widget | Column | Purpose | Data |
| --- | --- | --- | --- |
| ContinueCard | main | One dominant next action | `getNextLesson`, `getProgress` |
| PathOverview | main | The four stages and where the user is | `getPath`, `getProgress` |
| WeeklyGoal | side | Habit tracking | `getProgress` |
| GccPulse | side | Why this effort is worth it | `getPulse` |
| ProfileReadiness | side | Next profile step | `getReadiness` |

### ContinueCard
- Content: eyebrow (`Stage 1 · Course name`), lesson title, meta (type icon, `{n} min`), progress for the stage, primary button.
- First-run: eyebrow `Start here`, button `Start lesson 1`.
- Populated: button `Continue`.
- Locked next lesson (free user, next lesson is paid): show the lesson with a lock, primary button `Unlock with Pro` linking to `/upgrade`, secondary link `Review free lessons`.
- All stages complete: `You've finished your path` with link to Courses.
- This is the visually strongest element on the page: larger padding, accent border or tint, full-width button on mobile.

### PathOverview
- Four stage rows. Each row: stage number, name, outcome line, state (`Done`, `In progress`, `Up next`, `Locked`), small progress bar when in progress.
- Current stage is expanded by default with its next two lessons. Others collapsed.
- Locked stages show the lock icon and `Included in Pro`, no blur.
- Footer link `See full roadmap`.

### WeeklyGoal
- First-run: prompt `How many sessions a week?` with chips `2`, `3`, `5`; choosing one calls `setWeeklyGoal`.
- Populated: `{sessionsThisWeek} of {goal} sessions this week`, segmented progress, streak line (`{n}-day streak`, hidden when 0).
- Goal met: short positive message, no confetti.

### GccPulse
- One stat at a time from `getPulse(roleId)`, with its source label beneath. A small `Next` control cycles through items. Items with `verified: false` show a subtle `Unverified` marker in development builds only.
- Empty (no items): hide the widget entirely.

### ProfileReadiness
- Checklist of up to four items (for example resume, GitHub, LinkedIn, target city) with a progress count. Shows only the **next incomplete item** as a prominent row with an action; the rest are collapsed under `See all`.
- All done: hide the widget.

**Widget states table (applies to every widget)**

| State | Treatment |
| --- | --- |
| Loading | Skeleton matching final size |
| First-run | As described per widget |
| Populated | As described per widget |
| Empty | Widget-specific (hide or short message) |
| Error | Inline message `Couldn't load this. Try again.` with retry button; one widget failing never breaks the page |

## 8. My path (`/path`)

- Header with the path title and overall progress.
- Vertical timeline of the four stages. Each stage is a card: number, name, outcome, state, progress.
- **Pro users, or when `canViewRoadmapDetail`:** the card expands to list courses and lessons (title, type icon, duration, completion tick, lock icon on paid lessons for free users).
- **Free users:** the card shows counts and a lock with `Included in Pro`, plus one `Unlock with Pro` button per page (not per stage) fixed below the timeline.
- Lesson rows link to the lesson page.

## 9. Courses (`/courses`) and course detail

- Courses grouped under their stage heading. Course cards are identical in size (title, one-line summary, `{n} lessons`, progress bar, lock badge if everything beyond lesson 1 is locked for this user).
- Course detail: header, summary, lesson list with the same row component as the path page, primary button `Start` or `Continue`.

## 10. Lesson page (placeholder)

- Reading width 720 px. Breadcrumb (`Course name / Lesson title`), `h1`, meta row, a content area showing a placeholder block, `Mark as complete` button, previous and next links.
- **Locked** (free user, paid lesson): show the lesson title and meta, replace the content area with a lock panel (`This lesson is part of Pro`, one line on what is included, `Unlock with Pro`, secondary `Back to course`). Never render the lesson body for a user who fails `canAccess`.
- `Mark as complete` calls `markLessonComplete`, updates the dashboard data, and enables `Next`.

## 11. Profile (`/profile`)

- Card showing situation, years band (if any), target role, with `Edit` that reopens the matching onboarding screen and returns to Profile.
- Readiness checklist (full list).
- Plan card: current plan, `Upgrade` button on Free.

## 12. Upgrade stub (`/upgrade`)

- Static comparison of Free vs Pro using config text (`content/plans.config`): what is free (lesson 1 of each course, stage names and outcomes, weekly goal) and what Pro adds (all lessons, full roadmap detail). No prices, no payment, no form. A single `Notify me` or `Contact us` placeholder button that does nothing but fire an analytics event. Leave a clear `TODO(payments)` marker.

## 13. Analytics events (thin `track()` wrapper)

`dashboard_viewed`, `continue_clicked` (lessonId, isLocked), `stage_expanded` (stageId), `weekly_goal_set` (sessions), `pulse_next_clicked`, `readiness_action_clicked` (itemId), `lesson_opened` (lessonId, locked), `lesson_completed` (lessonId), `upgrade_clicked` (source: continue, path, lesson, profile, nav), `role_change_started`.

## 14. Build order (checkpoint after each; screenshots at 375, 768, 1280)

1. **Foundation:** types, `lib/data` interfaces with mock implementations, `lib/access.ts` with tests, `content/` configs, route guard.
2. **UI primitives** that are missing: Progress (bar and segmented), Stat, Skeleton, EmptyState, ErrorState, LockOverlay, Tabs, plus the shared `LessonRow` and `StageCard`.
3. **App shell:** top bar, user menu, mobile tab bar, page container and page header.
4. **Dashboard:** greeting row, then ContinueCard, PathOverview, WeeklyGoal, GccPulse, ProfileReadiness, each with all five states.
5. **My path** and **Courses** pages.
6. **Lesson page** with locked state and completion.
7. **Profile** and **Upgrade stub**.
8. **Polish and QA:** keyboard pass, reduced-motion pass, contrast check, dev toggle for free/pro, first-run vs returning data scenarios.

## 15. Acceptance criteria

- [ ] A new user lands on the first lesson after onboarding; a returning user lands on the dashboard.
- [ ] Dashboard renders correctly in four scenarios: first-run free, in-progress free, in-progress pro, all complete.
- [ ] Every widget shows loading, error and empty states correctly; one failing widget does not affect the others.
- [ ] A free user can open lesson 1 of every course and sees the lock panel on every other lesson, and the lesson body is never rendered or fetched for a locked lesson.
- [ ] Flipping `ACCESS_RULES` or a lesson's `access` value in mock data changes behaviour everywhere, with no component edits.
- [ ] No hardcoded content or inline access checks in components.
- [ ] Navigation, cards, spacing and typography match the onboarding screens; cards in a group are identical in size.
- [ ] Layouts work at 375, 768 and 1280 px with no horizontal scroll and no layout shift on load.
- [ ] Keyboard and screen-reader basics pass (focus order, labels, one `h1` per page).
- [ ] Typecheck, lint and unit tests pass.

## 16. Assumptions to confirm later (do not block on these)

| Question | Assumption |
| --- | --- |
| Is "first lesson free" per course or only the very first? | Lesson 1 of every course is free (a per-lesson `access` value, so either works) |
| Roadmap visibility for free users | Stage names and outcomes visible; detail inside stages is Pro |
| Weekly goal storage | Part of `Progress` in the mock layer |
| Pricing and payment provider | Not decided; stub only |
