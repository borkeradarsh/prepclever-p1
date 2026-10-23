# CLAUDE.md

Project conventions for Claude Code. Read this fully at the start of every session. It is written to be reusable across our apps; the sections marked **(fill)** are specific to this app.

## 1. What this app is

**The product is called PrepClever.** The repo is named `hex-edtech-prototype` and the docs often say "a learning platform", but PrepClever is the name in the code — the onboarding cookie and storage key are both `prepclever-onboarding`. Use it in user-facing copy.

A learning platform that helps people grow their careers with courses and roadmaps. First audience: students and service-company engineers in India aiming at AI engineering roles at Global Capability Centres (GCCs). The product definition is still moving, so **structure, layout and components must stay independent of content**. Content lives behind a data layer (section 4) and will later move to a CMS.

## 2. Stack and commands

Verified against the repo. Every claim here is traceable to a file; correct it in place when the repo changes.

- **Package manager: pnpm** (`pnpm-lock.yaml`, lockfileVersion 9; `node_modules/.pnpm/` present; pinned via `packageManager` in `package.json`). The stale `package-lock.json` has been removed — do not reintroduce it, and never run `npm install` here.
- Framework: Next.js 16.1.6, App Router (`app/`), React 19.2.3, TypeScript 5 (`strict: true`). Path alias `@/*` maps to the repo root.
- Lint: ESLint 9, flat config in `eslint.config.mjs`, extending `eslint-config-next`.
- Styling: **Tailwind CSS v4** via the `@tailwindcss/postcss` plugin (`postcss.config.mjs`). There is no `tailwind.config.*` — v4 is CSS-first.
- **Design tokens live in `app/globals.css`**: raw custom properties on `:root`, re-exported to Tailwind through `@theme inline`. Names: `--brand`, `--brand-soft`, `--focus`, `--surface`, `--surface-muted`, `--section-alt`, `--text-primary`, `--text-muted`, `--text-subtle`, `--border`, `--border-strong`, `--space-xs|sm|md|lg|xl`, `--radius-card|button|pill`, `--shadow-card|elevated`, `--font-sans` (Cinetype), `--font-display` (Editorial). Self-hosted woff2 in `public/fonts/` (Cinetype, Formula, Editorial).
- Component CSS is **styled-jsx** (`<style jsx>`, built into Next) used alongside Tailwind utility classes. Both are in play; follow whichever the neighbouring file uses rather than converting existing code.
- Existing folders: `app/` routes, `components/` (`auth/`, `layout/`, `sections/`, `ui/`), `lib/` logic and data, `public/` assets, `docs/` specs.
- **Do not yet exist — create when first needed:** `types/`, `content/`, `features/`, `lib/data/`.
- UI primitives location: `components/ui/` — today only **Badge, Button, Card, Container, QuoteBlock, SectionHeading**. Everything else section 5 names (Chip, Progress, Stat, Skeleton, EmptyState, ErrorState, LockOverlay, Avatar, Tabs) still has to be built.
- Shared types location: create a root `types/` folder when the first cross-feature type appears (do not create `lib/types`). Onboarding types currently live in `components/auth/onboarding/types.ts` and are imported by the route handlers under `app/api/onboarding/`.
- Auth: **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`). Browser client in `lib/supabase/client.ts`; OAuth callback route handler at `app/auth/callback/route.ts`; email/password and Google sign-in wrapped in `lib/auth/actions.ts`. The whole flow is gated by `NEXT_PUBLIC_AUTH_ENABLED` (`lib/auth/config.ts`); when off, `AuthDisabledFlow` renders onboarding directly. Cloudflare Turnstile guards signup (`app/api/turnstile/verify/route.ts`). A Firebase client was removed during the migration — do not reintroduce it.
- Database / API: **no database yet.** Supabase Postgres is not used. Onboarding state is persisted in an **httpOnly cookie** named `prepclever-onboarding`, read and written by the route handlers in `app/api/onboarding/` (`GET`/`PATCH`) and `app/api/onboarding/complete/` (`POST`), with `localStorage` as an offline fallback in `lib/onboarding.ts`. Treat this as temporary — it predates any real persistence layer.
- Commands:
  - install: `pnpm install`
  - dev: `pnpm dev`
  - build: `pnpm build`
  - start: `pnpm start`
  - lint: `pnpm lint`
  - typecheck: `pnpm typecheck` (`tsc --noEmit`)
  - test: `pnpm test` (Vitest, `vitest run`). Config in `vitest.config.mts`, which re-declares the `@/*` alias because Vitest does not read `tsconfig.json` paths. Environment is `node` — add `jsdom` and `@testing-library/react` only when a component test actually needs them.
  - e2e: none yet. Say so rather than assuming a command exists.
- `.gitignore` covers `/node_modules`, `/.next/`, `*.tsbuildinfo` and `.env*`, with an explicit `!.env.example` exception so the example env file can be committed.

## 3. Working agreement (saves tokens, follow strictly)

1. **Plan once, then build.** For any task over about 3 files, write a short plan (files to touch, new components, assumptions) and proceed without waiting, unless a decision is blocked.
2. **Decide, don't ask.** If the spec or this file covers it, do it. If something is genuinely ambiguous, pick the most conventional option, and list it under "Assumptions" at the end of your reply.
3. **Batch the work.** Complete a whole slice (page, all its states, tests) in one go instead of stopping per component.
4. **Stay in scope.** No refactors of unrelated code, no new dependencies, no renaming, unless asked. If you think a dependency is needed, say why in one line and ask.
5. **Verify before reporting.** Run typecheck, lint, tests and the screenshot check. Report only what passed and what did not.
6. **Report briefly:** what changed (files), how to see it, assumptions, anything not done. No long summaries.

## 4. Architecture rules

- **Feature folders.** `features/<name>/` holds that feature's components, hooks and tests. Shared primitives live in the UI primitives folder only.
- **Data access only through `lib/data/*`.** Components never import mock data, call `fetch` to a content source, or read the CMS directly. They call typed functions such as `getDashboard()`, `getPath()`, `getCourse(slug)`, `getLesson(courseSlug, lessonSlug)`. Today these return mock data; later they will call the CMS and the API. The **return types are the contract**: do not change them casually.
- **One access rule.** Whether a user may open something is decided only by `canAccess(user, item)` in `lib/access.ts`, driven by an `ACCESS_RULES` config object and the item's `access` field. Never write inline "is paid" checks in components.
- **Copy and config out of components.** Strings that a product person might change (headings, card text, stat lines, plan names) live in `content/` config files, typed. Short UI labels like "Back" and error messages may stay inline.
- **Server-first.** Fetch data in server components or route handlers where the framework supports it; keep client components for interaction.
- **Route guard.** Users who have not completed onboarding are redirected to onboarding. Completed users never see onboarding again.

## 5. Design system rules

- **Tokens only.** Use existing design tokens for colour, radius, shadow, spacing, type. No raw hex values, no arbitrary pixel values outside the token scale. If a token is missing, add it to the token file, not inline.
- **Spacing:** 4 px scale. Page gutters 16 px mobile, 32 px desktop. Content max-widths: dashboard 1120 px, reading/lesson 720 px.
- **Reuse primitives:** Button, Card, Chip, Badge, Progress (bar and segmented), Stat, Skeleton, EmptyState, ErrorState, LockOverlay, Avatar, Tabs. Build a missing primitive once, in the primitives folder, and use it everywhere.
- **Cards in a group are identical in size**, content top-aligned. Equal gaps. Same pattern as the onboarding screens.
- **Locked content is shown, not hidden or blurred.** Lock icon, muted treatment, short line on what unlocks it, one upgrade action.
- **Every data-driven widget implements all five states:** loading (skeleton with the same dimensions as the final content, so nothing shifts), first-run (no activity yet), populated, empty (nothing to show), error (message plus retry). A widget is not done until all five exist.
- **Motion:** 150 to 200 ms, subtle, and disabled under `prefers-reduced-motion`.
- **Accessibility:** semantic HTML, visible focus ring, 4.5:1 text contrast, 44 px tap targets, keyboard-operable everything, headings in order, one `h1` per page.
- **Responsive:** design for 375, 768 and 1280 px. No horizontal scroll. Mobile uses a bottom tab bar instead of the top navigation links.

## 6. Quality bar (definition of done)

A task is done when:

- [ ] Typecheck, lint and tests pass.
- [ ] All five states exist for every new data-driven widget.
- [ ] Screenshots at 375, 768 and 1280 px were taken and checked: no overlap, no clipped text, no layout shift between loading and loaded.
- [ ] No hardcoded content or inline access checks in components.
- [ ] No new dependencies, or each one was justified.
- [ ] Unit tests cover pure logic (access rules, progress calculations, selectors).

## 7. Things never to do

- Do not commit secrets or put keys in client code.
- Do not fetch paid content in client components without going through the access check.
- Do not invent course or company data in components; mock data lives only in `lib/data/mock/` and is clearly named as placeholder.
- Do not change the onboarding flow or its data model while working on the dashboard.
