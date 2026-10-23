# Onboarding UI/UX Fix Spec (for GitHub Copilot)

Companion to `onboarding-build-spec.md`. That file defines the flow and logic. **This file overrides it wherever the two conflict on visuals, layout, copy length, and card behaviour** (overrides are listed in section 9).

Scope: visual design, spacing, typography, component structure, copy length, and interaction polish for the onboarding screens. **Do not change the flow, data model, API, routing, or analytics.**

---

## 0. How to work

1. Open the current onboarding screen and its components. Find the existing design tokens (colors, radii, spacing, fonts) and reuse them. All values below are approximate, sampled by eye from a screenshot. **Where a token already exists, use the token and ignore my number.**
2. Keep the concept the owner likes: one centered card on a faint grid background, left-aligned content, progress at the top, a 2-column option grid, a single dusty-rose accent. Fix the details, do not redesign.
3. Build one reusable `OptionCard` and one `OptionGrid`, and use them on every onboarding screen (situation, role, and the year chips). No screen gets its own card styling.
4. Work in the order in section 10. After each step, show before/after screenshots at 1440, 768 and 375 px widths.

---

## 1. Diagnosis: what is wrong today

| # | Problem | Evidence on the current screen | Why it hurts | Severity |
| --- | --- | --- | --- | --- |
| 1 | **Unequal option cards** | Row 1 cards are about 125 px tall, row 2 about 145 px. Text in the two row-2 cards starts at different heights (about 10 px apart) because content is vertically centered | Breaks the symmetry of the grid, looks unfinished | High |
| 2 | **Copy too long for the card width** | "Product company or other tech role" wraps to 2 lines, its description wraps to 3. "Switching from non-tech" breaks at the hyphen ("non-" / "tech") | Causes problem 1, and the awkward hyphen break looks like a bug | High |
| 3 | **Two competing headings** | "Welcome" is styled like a heading (large, dark, display font) and sits above a very large H1 | Reader does not know which is the title; "Welcome" with no name feels generic | High |
| 4 | **Broken vertical rhythm** | Gaps in the header: progress bar → "Welcome" about 25 px, "Welcome" → H1 about 50 px, H1 → subtext about 30 px | "Welcome" belongs with the H1 but is further from it than from the progress bar | High |
| 5 | **H1 is oversized and cramped** | About 50 px display type, line-height under 1, negative tracking, forced onto 2 lines though there is room for 1 | Dominates the options, which are the actual task; descenders nearly touch the next line | Medium |
| 6 | **Cards look static, not tappable** | Thin pale border, no icon, no radio or check, no visible hover or pressed state | Users hesitate on cards that do not look interactive; no confirmation after tapping | High |
| 7 | **Progress bar is ambiguous** | Bar is already 50% filled on step 1 of 2 | Reads as "half done" before the user has done anything | Low |
| 8 | **Logo tracking too tight** | Letters in the wordmark touch each other | Looks like a rendering bug; weakens brand | Medium |
| 9 | **Layout will jump between screens** | Card appears vertically centered; screen 2 (more cards) and the year-chips reveal change the card height | A centered card re-centers on every height change, so the heading moves | Medium |
| 10 | **Dev artefacts visible** | Round "N" button bottom-left; thin dark strip along the bottom edge | The N is the Next.js dev indicator (not shipped). The strip looks like an overflow or stray element and should be investigated | Low |

---

## 2. Target look (what "fixed" means)

```
┌───────────────────────────────────────────────┐
│  Build your path                    Step 1 of 2│
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬ ▬│  segmented, 2 parts
│                                               │
│  Welcome, Priya                               │  eyebrow, small, muted
│  Where are you right now?                     │  H1, one line, 32–36 px
│  We'll tailor your roadmap to your starting   │
│  point.                                       │
│                                               │
│  ┌─────────────────┐ ┌─────────────────┐      │
│  │ Student / final │ │ IT services     │      │  identical size,
│  │ year        ( ) │ │ company     ( ) │      │  text top-aligned,
│  │ In college or…  │ │ Working at a…   │      │  radio indicator
│  └─────────────────┘ └─────────────────┘      │  top-right
│  ┌─────────────────┐ ┌─────────────────┐      │
│  │ Product / tech  │ │ Switching       │      │
│  │ role        ( ) │ │ careers     ( ) │      │
│  │ At a product…   │ │ Coming from a…  │      │
│  └─────────────────┘ └─────────────────┘      │
└───────────────────────────────────────────────┘
```

Keep from today: the card, its radius and shadow character, the grid background, left alignment, the rose accent, the display font for headings.

---

## 3. Page and card layout

**Page**
- Header: logo left, vertically centered in a 72 px bar, 32 px left padding (16 px on mobile).
- Main: **anchor the card near the top instead of vertically centering it.** `align-items: flex-start`, `padding-top: clamp(24px, 9vh, 80px)`, `padding-bottom: 48px`. Reason: card height differs between screens and grows when year chips appear, and a centered card would shift the heading each time.
- `min-height: 100dvh` on the page, no extra margin on `body`, no unintended vertical scroll when content fits. Find and remove whatever causes the thin dark strip at the bottom edge.
- Hide the Next.js dev indicator in development (`devIndicators` setting in `next.config`); it is not part of the product.
- Background grid: keep, but lower its contrast by about 30% and fade it out near the card with a soft radial mask so the lines do not compete with the card edge. Optional but recommended.

**Card**
- `max-width: 600px`, `width: 100%`. Same width on all onboarding screens.
- Padding: 48 px desktop, 32 px tablet, 24 px mobile.
- Radius: about 28 px (keep the current radius if it is close). Inner option cards: 14 px.
- Shadow: keep it soft and slightly lighter, e.g. `0 1px 2px rgba(20,10,30,.04), 0 16px 48px rgba(20,10,30,.06)`.

---

## 4. Spacing system (fixes the rhythm)

Use a 4 px scale and these exact vertical gaps inside the card:

| Between | Gap |
| --- | --- |
| Card top padding → progress labels | padding only |
| Progress labels → progress bar | 10 px |
| Progress bar → eyebrow ("Welcome, name") | 32 px |
| Eyebrow → H1 | 8 px |
| H1 → subtext | 12 px |
| Subtext → option grid | 32 px |
| Option grid → year chips block (when shown) | 24 px |
| Option card ↔ option card (both axes) | 16 px |

Rule: **the eyebrow and H1 are one unit (8 px apart); everything else is separated by 12 to 32 px.** Never let an eyebrow sit closer to the element above it than to its own heading.

---

## 5. Typography

| Element | Font | Size / line-height | Weight | Notes |
| --- | --- | --- | --- | --- |
| Progress labels | body | 13 / 1.3 | 500 | Muted color; "Step 1 of 2" uses tabular numbers |
| Eyebrow | body | 15 / 1.4 | 500 | Muted text color. `Welcome, {firstName}`; fall back to `Welcome` |
| H1 | existing display font | `clamp(28px, 4.5vw, 36px)` / 1.12 | existing | Letter-spacing no tighter than `-0.02em`. `text-wrap: balance`. No max-width that forces a 2-line break at desktop; it should sit on one line at 600 px card width |
| Subtext | body | 16 / 1.5 | 400 | Muted, contrast at least 4.5:1 |
| Option title | body | 16 / 1.3 | 600 | One line (see copy limits) |
| Option description | body | 14 / 1.45 | 400 | Muted, clamp to 2 lines |
| Chip label | body | 14 / 1 | 500 | |

**Logo:** the wordmark's letters touch. Set `letter-spacing` to between `-0.01em` and `0.01em` for the wordmark, check kerning, or swap in the SVG logo. Do not use the heading's tight tracking for the logo.

---

## 6. Option card (the core component)

**Anatomy:** title (top-left), description under it, selection indicator top-right. **No icons for now.** Reason: icons add about 45 px of height per row, create more text-wrap pressure, and the titles already differentiate the options. Revisit when there is a consistent icon set.

**Structure and rules**
- `OptionGrid`: `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; grid-auto-rows: 1fr;` `grid-auto-rows: 1fr` makes **every row the same height**, which fixes problem 1.
- `OptionCard`: `display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 4px; padding: 16px 18px; min-height: 104px; text-align: left;` Content is **always top-aligned, never vertically centered**, so titles start at the same height in every card.
- Title gets `padding-right: 28px` so it never runs under the indicator.
- Description: `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;`
- Selection indicator: 18 px circle at `top: 14px; right: 14px`. Unselected: 1.5 px muted border, empty. Selected: filled accent with a white check.

**States**

| State | Treatment |
| --- | --- |
| Default | 1 px border at about 14% text-color opacity (slightly stronger than today), white surface |
| Hover | Border darkens to about 30% text-color opacity, `translateY(-1px)`, soft shadow; 150 ms ease-out |
| Pressed | `scale(0.99)`, no shadow |
| Focus-visible | 2 px accent ring with 2 px offset (never remove the outline without replacing it) |
| Selected | 1.5 px accent border, background tinted with the accent at about 8%, filled check indicator |
| Disabled / saving | Selected state stays visible, other cards at 60% opacity and non-interactive until the save resolves |

**Selection feedback and advance:** on tap, show the selected state immediately, wait about 180 ms so the user sees it, then advance (after the save succeeds, as in the build spec). Respect `prefers-reduced-motion`: no translate, no scale, no slide; use instant state changes.

**Semantics:** `OptionGrid` is `role="radiogroup"` with an accessible name from the H1; each card is a native `<input type="radio">` visually hidden inside a `<label>`, or a `role="radio"` element with `aria-checked`. Arrow keys move between options.

---

## 7. Copy (shorter, with hard limits)

**Limits, enforced by a unit test over the config files:** option title at most **20 characters**, option description at most **60 characters**.

**Situations (update `situations.config`)**

| value | Title | Description |
| --- | --- | --- |
| `student` | Student / final year | In college or about to graduate |
| `it_services` | IT services company | Working at a services or consulting firm |
| `product_tech` | Product / tech role | At a product company or another tech job |
| `non_tech` | Switching careers | Coming from a non-technical background |

**Roles (update `roles.config`)**

| id | Title | Description |
| --- | --- | --- |
| `genai_llm` | GenAI / LLM Engineer | Build apps on LLMs: RAG, agents, evals |
| `ml_mlops` | ML / MLOps Engineer | Train, deploy and monitor models in production |
| `ai_platform` | AI Platform Engineer | Build the infrastructure AI teams run on |
| `ai_data` | AI Data Engineer | Build the data pipelines behind AI |
| `backend_to_ai` | Backend → AI | Backend dev moving into AI work |
| `not_sure` | Not sure yet | We'll start you on a good default |

The longer role `summary` text in `roles.config` stays; it is not shown in onboarding. The payoff screen's `situationLabel` values stay as they are.

---

## 8. Progress, year chips and screens 2 and 3

**Progress**
- Replace the single bar with a **2-segment bar**: two equal segments, 4 px high, 6 px gap, fully rounded. The current step's segment is filled with the accent, upcoming segments use the subtle track color. This reads as "you are on step 1" instead of "half done".
- Animate the fill (300 ms) when moving to step 2. Labels: left `Build your path`, right `Step 1 of 2`.

**Year chips (screen 1, for IT services and product/tech)**
- Revealed below the grid with a 200 ms height-and-fade animation; the outer card grows smoothly and nothing above it moves (see anchor-top layout).
- Label `Years of experience` (13 px, 600, muted), 12 px above the chips.
- Four chips in a **4-column equal grid** so they align with the 2×2 grid above (same gap of 8 px between chips). On widths under 480 px: 2×2. Chip height 44 px, fully rounded, same default/hover/selected treatments as the cards.
- On mobile, scroll the chip block into view after it appears.

**Screen 2 (role): use a 2×3 grid, not 3×2.** At the 600 px card width, three columns would be about 157 px each, too narrow for titles. Two columns keeps the exact card width and grid from screen 1, so advancing causes no layout re-flow and the screens stay symmetric. "Not sure yet" is the sixth card, same size, with a dashed border in the default state as the only difference. The "Popular for you" badge is a small pill positioned absolutely on the card's top border (`top: -10px; left: 16px`), so it never changes the card's height or the alignment of its text. Reuse the existing badge component.

**Screen 3 (payoff):** same card width and padding; stage list uses 16 px row gaps and 1 px hairline dividers; primary button full width inside the card, 48 px high, using the existing primary button component.

---

## 9. Overrides to the build spec

| Build spec says | This spec says |
| --- | --- |
| Screen 1 heading `Welcome, {firstName}. Where are you right now?` as one heading | Split into eyebrow `Welcome, {firstName}` and H1 `Where are you right now?` |
| Cards have an optional icon | No icons for now |
| Role grid 3×2 desktop, 2×3 tablet | 2×3 on all desktop and tablet widths, 1 column under 480 px |
| Progress indicator "1 of 2" | Two-segment bar with `Step 1 of 2` |
| Situation and role titles as written | Shorter titles and descriptions in section 7 |
| Card vertically centered on the page (implied) | Card anchored near the top |

---

## 10. Order of work

1. **Page shell:** anchor-top layout, remove the bottom strip, hide the dev indicator, soften the background grid, fix the logo tracking.
2. **Type and spacing:** apply sections 4 and 5 to the header block (eyebrow, H1, subtext).
3. **Progress:** two-segment bar.
4. **`OptionCard` and `OptionGrid`:** structure, states, equal rows, semantics (section 6).
5. **Copy:** update the two config files and add the length-limit unit test (section 7).
6. **Year chips:** reveal animation, 4-column grid.
7. **Screen 2 and Screen 3:** apply the same components (section 8).
8. **QA pass:** section 11.

---

## 11. Acceptance checklist

**Visual**
- [ ] All option cards on a screen are identical in width and height at 1440, 768 and 375 px.
- [ ] Titles in a row start at the same vertical position in every card.
- [ ] Every title fits on one line at desktop width; no title breaks at a hyphen.
- [ ] The eyebrow sits 8 px above the H1, with larger gaps elsewhere per section 4.
- [ ] H1 fits on one line at desktop, wraps cleanly (balanced) on mobile, and is visibly smaller than today.
- [ ] Logo letters no longer touch.
- [ ] No "N" dev button and no dark strip at the bottom of the page.

**Interaction**
- [ ] Hover, pressed, focus-visible and selected states are visible and consistent across cards and chips.
- [ ] Selected state is visible for about 180 ms before advancing.
- [ ] Heading and progress bar do not move between screens or when the year chips appear.
- [ ] With `prefers-reduced-motion`, no movement animations run.

**Accessibility**
- [ ] Options are a radio group, fully operable by keyboard with arrow keys.
- [ ] Muted text has at least 4.5:1 contrast; the selected border and the unselected border are both distinguishable from the surface.
- [ ] Tap targets are at least 44 px.

**Quality**
- [ ] A unit test fails if any option title exceeds 20 characters or any description exceeds 60.
- [ ] Before/after screenshots at the three widths are attached to the pull request.
