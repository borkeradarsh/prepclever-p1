# Onboarding: gap audit

Audit of the implemented onboarding flow against [onboarding-build-spec.md](./onboarding-build-spec.md) and [onboarding-ui-fix-spec.md](./onboarding-ui-fix-spec.md), as of commit `7a8a24f` (2026-10-23).

This is a findings document. **Nothing here has been fixed.** It exists so the dashboard work in [dashboard-structure-spec.md](./dashboard-structure-spec.md) can start from an accurate picture, and so the remaining onboarding work can be picked up without re-deriving it.

Where the two specs conflict, the UI-fix spec wins (its section 9 lists the overrides).

---

## Summary

The flow is **built and works end to end**: all three screens, externalised config, pure business rules, server-side validation, save-on-every-answer with optimistic rollback, a loading skeleton, equal-height cards and reduced-motion support.

It is implemented as **one client component** ([components/auth/OnboardingFlow.tsx](../components/auth/OnboardingFlow.tsx), ~220 lines) rather than the three-route structure the specs describe. Most gaps below follow from that one decision.

Rough shape of what is left: 2 bugs that are visible to any user, 1 missing guard that blocks the dashboard work, 3 spec divergences, and 3 things never started (analytics, tests, page shell).

---

## What is implemented

| Piece | Where | Notes |
| --- | --- | --- |
| Types and state shape | [components/auth/onboarding/types.ts](../components/auth/onboarding/types.ts) | Matches build-spec §6 exactly, including `emptyOnboardingState()` |
| Config: situations, years, roles, paths, labels | [components/auth/onboarding/config.ts](../components/auth/onboarding/config.ts) | All copy externalised as both specs require. Uses the **shortened** UI-fix-spec §7 wording |
| Business rules | `config.ts` — `getDefaultRole`, `resolveRole`, `highlightBySituation` | Pure and correct per build-spec §7 |
| Screen 1: Situation | `OnboardingFlow.tsx` | 2×2 grid, auto-advance on tap |
| Years of experience | same | Four bands, `0-2` … `10+` |
| Screen 2: Role | same | 2×3 grid per UI-fix-spec §8; `Popular for you` badge absolutely positioned so it cannot change card height; dashed `Not sure yet` card |
| Screen 3: Payoff | same | Eyebrow, `{situationLabel} → {roleTitle} at a GCC`, 4 stages, proof line with source, GCC examples, default-role note, `Start stage 1`, `Change my role` |
| Persistence API | [app/api/onboarding/route.ts](../app/api/onboarding/route.ts) (GET, PATCH), [app/api/onboarding/complete/route.ts](../app/api/onboarding/complete/route.ts) (POST) | Enum validation and the conditional `yearsBand` rules are implemented properly, server-side. `POST /complete` is idempotent via `completedAt ?? now` |
| Client data layer | [lib/onboarding.ts](../lib/onboarding.ts) | Save on every answer, optimistic update, rollback on failure |
| Loading / error / saving states | `OnboardingFlow.tsx` | Skeleton, `role="alert"` error line, cards disabled while a save is in flight |
| Equal-height cards | styled-jsx, `grid-auto-rows: 1fr` | The specific fix UI-fix-spec §6 asks for |
| Reduced motion, focus ring, heading focus on step change | same | |

---

## Bugs

### 1. The greeting always reads "Welcome, User"

`OnboardingFlow` declares `nameRequired` and `initialName` in its props type but [destructures only `initialName`](../components/auth/OnboardingFlow.tsx#L22) — `nameRequired` is accepted and silently dropped. Separately, [app/onboarding/[step]/page.tsx](../app/onboarding/[step]/page.tsx#L6) never passes `initialName` at all, so it falls back to the literal `"User"`.

Build-spec §4 wants the name taken from the auth profile, with an optional field only when the profile has none. Right now there is no path by which a real name reaches the component from the `/onboarding` route.

### 2. Advance is not sequenced after the save

`update()` applies the optimistic state (including the step change) and only rolls back if the request throws. On a slow connection the user sees Screen 2 before the save lands, and a failure bounces them backwards.

Build-spec §9 and UI-fix-spec §6 both specify: show the selected state, hold ~180 ms, advance **after** the save succeeds.

---

## Blocking the dashboard

### 3. No route guard

There is no `middleware.ts` anywhere in the repo. Nothing redirects a user with incomplete onboarding into the flow, and nothing stops a completed user from reopening it.

Required by CLAUDE.md §4 ("Route guard"), build-spec §8, and dashboard-spec §2. The dashboard cannot be built correctly without it.

### 4. The three routes do not exist

Build-spec §8 asks for `/onboarding/situation`, `/onboarding/role` and `/onboarding/path`, with deep links to an unreached step redirecting to the current one.

What exists is a single catch-all, [app/onboarding/[step]/page.tsx](../app/onboarding/[step]/page.tsx), which **ignores its own `step` param** — the screen is chosen purely from client state. Consequences: deep links do not work, browser Back does not move between screens (contradicting build-spec §8's last line), and `currentStep` cannot be resumed from the URL.

### 5. Completion goes to `/`

All three call sites use `window.location.assign("/")`, which is the marketing landing page: [the onboarding route](../app/onboarding/[step]/page.tsx#L6), [AuthDisabledFlow](../components/auth/AuthDisabledFlow.tsx#L9), [SignupForm](../components/auth/SignupForm.tsx#L45).

Dashboard-spec §2 wants the user's first lesson, falling back to `/dashboard`. Neither route exists yet, so this needs revisiting when they do.

---

## Spec divergences

### 6. Years of experience is a whole extra screen

Both specs are explicit that the year chips appear **below the grid on the same screen**, as an animated expand: build-spec §5 ("reveals a row of year chips directly below the grid (same screen, animated expand)") and UI-fix-spec §8 ("the outer card grows smoothly and nothing above it moves").

The code instead sets an `experienceStep` flag and swaps the entire screen for four option cards with invented descriptions ("Early in your career", "10 or more years") that exist in no config file.

Knock-on effect: the progress denominator becomes dynamic — `totalSteps` is 3 for `it_services` / `product_tech` and 2 for `student` / `non_tech`. The specs fix it at `Step 1 of 2` for everyone.

### 7. Progress is a single fill bar, not two segments

UI-fix-spec §8 asks for a 2-segment bar specifically to stop it reading as "half done" on step 1 — that is diagnosis #7 in its own problem table. The implementation is a single `<span>` whose width is a percentage, which reproduces the exact problem the spec was written to fix.

The `Step n of n` label is also missing: there is an `sr-only` `role="progressbar"` element, so **sighted users see no step count at all**, only the words "Build your path".

### 8. `stats.config` does not exist

The payoff proof line and its source are a hardcoded string in the `copy` object at [OnboardingFlow.tsx:10-14](../components/auth/OnboardingFlow.tsx#L10-L14).

This violates CLAUDE.md §4 ("copy and config out of components") and build-spec §11.4, which specifies a config of `{ text, sourceLabel, checkedOn }` entries, one picked per user and **stable by `roleId`** so it does not change on refresh, each carrying a `// TODO(verify)` marker.

This one has downstream cost: dashboard-spec §5 has `getPulse(roleId)` read from `stats.config`, and its `PulseItem` type needs `sourceLabel`, `checkedOn` and `verified`. The GccPulse widget cannot be built until this config exists.

---

## Not started

### 9. No analytics

Not one of the ten events in build-spec §10 fires. No `track()` wrapper exists anywhere in the repo. Drop-off measurement — the point of the events — is therefore impossible, and the success metrics in build-spec §2 cannot be reported against.

### 10. Tests barely exist

A Vitest runner is now installed with one smoke test over `getDefaultRole` / `resolveRole`. Still outstanding:

- build-spec §13 step 2: full coverage of the business rules, all four situation mappings.
- UI-fix-spec §7: a test that **fails** if any option title exceeds 20 characters or any description exceeds 60. By inspection the current config would pass — the longest description is `"Train, deploy and monitor models in production"` at 46 characters — but nothing enforces it.
- build-spec §14: at least one test for the route guard, which does not exist yet.

### 11. Page shell items from UI-fix-spec §10 step 1

- [next.config.ts](../next.config.ts) is still the empty scaffold, so there is no `devIndicators` setting and the "N" dev badge is still visible (UI-fix-spec §3 and diagnosis #10).
- Onboarding renders inside the generic `auth-page` / `auth-content` shell rather than the anchored-top layout §3 specifies (`align-items: flex-start`, `padding-top: clamp(24px, 9vh, 80px)`). Anchoring is what stops the heading moving when the card height changes.
- The thin dark strip at the bottom edge (diagnosis #10) has not been investigated.
- Logo letter-spacing (diagnosis #8) has not been checked.

---

## Smaller issues

### 12. Keyboard support is incomplete

Cards are `role="radio"` on `<button>` elements inside a `role="radiogroup"`, but there is **no arrow-key handler and no roving `tabIndex`**. Both specs require arrow keys to move between options (build-spec §3, UI-fix-spec §6 and its §11 checklist). Tab currently steps through every card individually, which is not how a radio group should behave.

### 13. Hardcoded colours and fonts bypass the tokens

`#8b5c71`, `#6f5362`, `#b34545` and `"Formula", sans-serif` appear directly in the styled-jsx, against CLAUDE.md §5 ("Tokens only… no raw hex values").

Worth noting while fixing: the `--font-display` token is **Editorial**, but the onboarding headings use **Formula**. So either the token is wrong or the usage is. Resolve that before adding more token-based type.

### 14. Selected state after "Not sure yet"

The role grid marks a card selected only when `!state.roleIsDefault` ([line 98](../components/auth/OnboardingFlow.tsx#L98)). So returning via `Change my role` after choosing "Not sure yet" highlights the dashed card rather than the role that was actually resolved.

Defensible as a deliberate choice — it does show the user that they never picked explicitly — but build-spec §9 says Screen 2 should open "with the current role preselected". Worth a decision either way.

---

## Suggested order

Roughly cheapest-and-most-blocking first:

1. **Route guard + the three real routes** (#3, #4) — blocks the dashboard, and fixes browser Back for free.
2. **The name bug** (#1) — small, and currently visible to every single user.
3. **`stats.config`** (#8) — small, unblocks the dashboard's GccPulse widget.
4. **Progress bar and inline year chips** (#6, #7) — the two visible spec divergences; related enough to do together.
5. **Save sequencing** (#2) and **arrow keys** (#12).
6. **Tests** (#10) — the copy-length test is worth adding as soon as the config stops moving.
7. **Analytics** (#9), **page shell** (#11), **tokens** (#13), **selected-state decision** (#14).

Completion routing (#5) stays blocked until `/dashboard` exists.
