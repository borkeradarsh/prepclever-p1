// Captures the app pages at the three breakpoints the design rules name, and
// reports layout problems a screenshot alone would not make obvious: horizontal
// scroll, and content sitting under the fixed mobile tab bar.
//
// Browsers live outside the repo on D: by default, because C: is nearly full.
// Override with PLAYWRIGHT_BROWSERS_PATH or BASE_URL.

import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

// Forward slashes: a lone backslash here would make the path drive-relative.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= "D:/playwright-browsers";

const { chromium } = await import("playwright");

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("screenshots");
const WIDTHS = [375, 768, 1280];

const PRO = { "prepclever-dev": "plan:pro" };

/**
 * Real users start from empty progress (the `live` scenario). Most captures
 * need something to show, so they use the in-progress demo seed unless they
 * name a scenario themselves; `scenario:live` captures what a new user sees.
 */
function withDemoScenario(cookies = {}) {
  const dev = cookies["prepclever-dev"] ?? "";
  if (/(^|\|)scenario:/.test(dev)) return cookies;
  return { ...cookies, "prepclever-dev": dev ? `scenario:in-progress|${dev}` : "scenario:in-progress" };
}
const COLLAPSED = { "prepclever-sidebar": "collapsed" };
// The sidebar only exists from 1024px, so its collapsed state is only worth a desktop capture.
const DESKTOP = [1280];
// The drawer replaces the sidebar below 1024px.
const MOBILE = [375, 768];
const DRAWER_BUTTON = "header button[aria-haspopup=dialog]";
// A Block 3 concept and one of its lessons (lessons are Pro, so free sees the lock).
const CONCEPT = "/roadmap/upskilling/math/linalg";
const LESSON = `${CONCEPT}/vectors-dot-products-and-norms`;

/** An onboarding cookie at a given step, as the route handlers write it. */
const onboarding = (patch) =>
  encodeURIComponent(
    JSON.stringify({
      situation: "it_services",
      yearsBand: "2-5",
      roleId: null,
      roleIsDefault: false,
      currentStep: "situation",
      completedAt: null,
      updatedAt: "2026-10-24T00:00:00.000Z",
      ...patch,
    }),
  );

const PAGES = [
  { name: "landing", url: "/" },
  { name: "companies", url: "/companies" },
  { name: "roles", url: "/roles" },
  { name: "resume-evaluate", url: "/tools/resume-evaluate" },
  // Screen 1 with the situation carried over from the landing page.
  { name: "onboarding-intent", url: "/onboarding/situation", cookies: { "prepclever-intent": "it_services" } },
  // The eight role cards, with the switcher track's "Popular for you" badge.
  { name: "onboarding-role", url: "/onboarding/role", cookies: { "prepclever-onboarding": onboarding({ currentStep: "role" }) } },
  {
    name: "onboarding-payoff",
    url: "/onboarding/payoff",
    cookies: { "prepclever-onboarding": onboarding({ currentStep: "payoff", roleId: "ai_backend" }) },
  },
  // Home: each scenario, both plans, each widget's error state, and mid-load.
  { name: "dashboard", url: "/dashboard" },
  { name: "dashboard-pro", url: "/dashboard", cookies: PRO },
  { name: "dashboard-first-run", url: "/dashboard", cookies: { "prepclever-dev": "scenario:first-run" } },
  // What a real new user sees: no seed, every bar at zero.
  { name: "dashboard-live", url: "/dashboard", cookies: { "prepclever-dev": "scenario:live" } },
  { name: "roadmap-live", url: "/roadmap", cookies: { "prepclever-dev": "scenario:live" } },
  { name: "dashboard-complete", url: "/dashboard", cookies: { "prepclever-dev": "scenario:complete|plan:pro" } },
  { name: "dashboard-errors", url: "/dashboard", cookies: { "prepclever-dev": "fail:home,roles" } },
  {
    name: "dashboard-loading",
    url: "/roadmap",
    cookies: { "prepclever-dev": "slow:1" },
    loading: true,
    navigateBy: 'a[href="/dashboard"]:visible',
  },
  { name: "profile", url: "/profile" },
  // The roadmap: free and Pro, first run, and mid-load.
  { name: "roadmap", url: "/roadmap" },
  { name: "roadmap-pro", url: "/roadmap", cookies: PRO },
  { name: "roadmap-first-run", url: "/roadmap", cookies: { "prepclever-dev": "scenario:first-run" } },
  // Reached by a client navigation, as a user would: the shell stays and only the page loads.
  {
    name: "roadmap-loading",
    url: "/dashboard",
    cookies: { "prepclever-dev": "slow:1" },
    loading: true,
    navigateBy: 'a[href="/roadmap"]:visible',
  },
  // Block overviews: open, locked for free, open for Pro.
  { name: "block-market", url: "/roadmap/market" },
  { name: "block-upskilling-locked", url: "/roadmap/upskilling" },
  { name: "block-upskilling-pro", url: "/roadmap/upskilling", cookies: PRO },
  // Item pages: open, locked, Pro, coming soon, and the very last item.
  { name: "item-your-role", url: "/roadmap/market/your-role" },
  { name: "item-track-plan-locked", url: "/roadmap/upskilling/track-plan" },
  { name: "item-track-plan-pro", url: "/roadmap/upskilling/track-plan", cookies: PRO },
  { name: "item-coming-soon-pro", url: "/roadmap/positioning/resume-evaluate", cookies: PRO },
  // Block 6: the owner's three interview pages, and one as free users see it.
  { name: "interview-process-pro", url: "/roadmap/interviews/interview-process", cookies: PRO },
  { name: "interview-companies-pro", url: "/roadmap/interviews/interview-companies", cookies: PRO },
  { name: "dos-and-donts-pro", url: "/roadmap/interviews/dos-and-donts", cookies: PRO },
  { name: "interview-process-locked", url: "/roadmap/interviews/interview-process" },
  // Block 3 concepts and lessons: the free preview with locked lessons, and Pro.
  { name: "concept-free", url: CONCEPT },
  { name: "concept-pro", url: CONCEPT, cookies: PRO },
  { name: "lesson-locked", url: LESSON },
  { name: "lesson-pro", url: LESSON, cookies: PRO },
  // The concept map: standalone, as Block 3's first item, and as the matrix.
  { name: "concept-map", url: "/roadmap/concept-map" },
  { name: "concept-map-matrix", url: "/roadmap/concept-map", press: 'button[aria-pressed]:has-text("Role matrix")' },
  { name: "concept-map-item-pro", url: "/roadmap/upskilling/concept-map", cookies: PRO },
  // Block 2: the audit and the gap report, before and after any answers.
  { name: "skill-audit", url: "/roadmap/gap-analysis/skill-audit" },
  { name: "skill-audit-first-run", url: "/roadmap/gap-analysis/skill-audit", cookies: { "prepclever-dev": "scenario:first-run" } },
  { name: "gap-report", url: "/roadmap/gap-analysis/gap-report" },
  { name: "gap-report-pro", url: "/roadmap/gap-analysis/gap-report", cookies: PRO },
  { name: "gap-report-first-run", url: "/roadmap/gap-analysis/gap-report", cookies: { "prepclever-dev": "scenario:first-run" } },
  { name: "jobs-best-match", url: "/jobs?role=all&sort=best_match" },
  { name: "upgrade", url: "/upgrade?from=locked-page&returnTo=%2Froadmap%2Fupskilling%2Ftrack-plan" },
  { name: "upgrade-pro", url: "/upgrade", cookies: PRO },
  { name: "explore", url: "/explore" },
  // The sidebar collapsed, in both contexts and both plans.
  { name: "roadmap-collapsed", url: "/roadmap", cookies: COLLAPSED, widths: DESKTOP },
  { name: "roadmap-pro-collapsed", url: "/roadmap", cookies: { ...PRO, ...COLLAPSED }, widths: DESKTOP },
  { name: "item-locked-collapsed", url: "/roadmap/upskilling/track-plan", cookies: COLLAPSED, widths: DESKTOP },
  { name: "item-pro-collapsed", url: "/roadmap/market/your-role", cookies: { ...PRO, ...COLLAPSED }, widths: DESKTOP },
  { name: "concept-collapsed", url: CONCEPT, cookies: COLLAPSED, widths: DESKTOP },
  // The mobile drawer, open, in the home and block contexts.
  { name: "drawer-home", url: "/dashboard", click: DRAWER_BUTTON, widths: MOBILE },
  { name: "drawer-block", url: "/roadmap/market/your-role", click: DRAWER_BUTTON, widths: MOBILE },
  { name: "drawer-block-pro", url: "/roadmap/upskilling/track-plan", cookies: PRO, click: DRAWER_BUTTON, widths: MOBILE },
  { name: "drawer-concept", url: CONCEPT, click: DRAWER_BUTTON, widths: MOBILE },
  // Jobs, in each of the list's five states. Example ids hash the posting URL.
  { name: "jobs", url: "/jobs?role=all" },
  { name: "jobs-own-role", url: "/jobs", cookies: { "prepclever-onboarding": onboarding({ currentStep: "done", roleId: "genai_llm" }) } },
  { name: "jobs-dev-sample", url: "/jobs?role=all&devSample=1" },
  { name: "jobs-dev-sample-page-3", url: "/jobs?role=all&devSample=1&page=3" },
  { name: "jobs-empty", url: "/jobs?role=all&q=no-such-job" },
  { name: "jobs-first-run", url: "/jobs", cookies: { "prepclever-dev": "scenario:first-run" } },
  { name: "jobs-error", url: "/jobs", cookies: { "prepclever-dev": "fail:jobs" } },
  // Captured mid-load, before the slow mock data arrives.
  { name: "jobs-loading", url: "/jobs?role=all", cookies: { "prepclever-dev": "slow:1" }, loading: true },
  { name: "job-careers-site", url: "/jobs/example-8as8v8" },
  { name: "job-linkedin", url: "/jobs/example-lfdvin" },
  { name: "job-dev-sample-closed", url: "/jobs/dev-sample-19" },
];

/** Runs in the page: the checks that need real layout, not markup. */
function auditPage() {
  const problems = [];
  const doc = document.documentElement;

  if (doc.scrollWidth > doc.clientWidth + 1) {
    problems.push(`horizontal scroll: scrollWidth ${doc.scrollWidth} > viewport ${doc.clientWidth}`);
  }

  // Anything clipped sideways out of its own container. Screen-reader-only text
  // is clipped to 1px on purpose, so it is skipped rather than reported.
  for (const el of document.querySelectorAll("h1, h2, p, span, a, button")) {
    const style = getComputedStyle(el);
    const srOnly = el.clientWidth <= 1 || el.clientHeight <= 1 || style.clipPath !== "none";
    if (srOnly || style.overflow === "visible") continue;
    if (el.scrollWidth > el.clientWidth + 1) {
      const text = (el.textContent ?? "").trim().slice(0, 40);
      problems.push(`clipped text in <${el.tagName.toLowerCase()}>: "${text}"`);
    }
  }

  // The fixed tab bar must never cover page content.
  const tabBar = document.querySelector("nav.fixed");
  if (tabBar && getComputedStyle(tabBar).display !== "none") {
    const barTop = tabBar.getBoundingClientRect().top;
    const main = document.querySelector("main");
    if (main) {
      const mainBottom = main.getBoundingClientRect().bottom;
      if (mainBottom > barTop + 1) {
        problems.push(
          `tab bar covers content: main bottom ${Math.round(mainBottom)} > bar top ${Math.round(barTop)}`,
        );
      }
    }
  }

  const h1s = document.querySelectorAll("h1").length;
  if (h1s !== 1) problems.push(`expected exactly one h1, found ${h1s}`);

  return problems;
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
let failures = 0;

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });

  for (const page of PAGES) {
    if (page.widths && !page.widths.includes(width)) continue;
    await context.clearCookies();
    await context.addCookies(
      Object.entries(withDemoScenario(page.cookies)).map(([name, value]) => ({ name, value, url: BASE_URL })),
    );
    const tab = await context.newPage();
    const response = await tab.goto(`${BASE_URL}${page.url}`, {
      waitUntil: page.loading && !page.navigateBy ? "commit" : "networkidle",
    });
    const status = response?.status() ?? 0;
    if (page.navigateBy) await tab.locator(page.navigateBy).first().click();
    // Loading captures: give the shell and the skeleton a moment to paint, no more.
    if (page.loading) await tab.waitForSelector("main [role=status]", { timeout: 5000 });

    let problems;
    if (page.click) {
      // An overlay (the drawer): audit the page underneath as usual, scrolled to
      // the bottom, then open it, check it took focus, and capture the viewport.
      await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await tab.waitForTimeout(150);
      problems = status === 200 ? await tab.evaluate(auditPage) : [`HTTP ${status}`];
      await tab.evaluate(() => window.scrollTo(0, 0));
      await tab.click(page.click);
      await tab.waitForSelector("dialog[open]", { timeout: 5000 });
      const focusInside = await tab.evaluate(() => Boolean(document.activeElement?.closest("dialog[open]")));
      if (!focusInside) problems.push("drawer opened without moving focus into it");
      await tab.screenshot({ path: path.join(OUT_DIR, `${page.name}-${width}.png`) });
      await tab.keyboard.press("Escape");
      const closed = await tab.waitForSelector("dialog[open]", { state: "detached", timeout: 2000 }).then(() => true, () => false);
      if (!closed) problems.push("Escape did not close the drawer");
    } else {
      // A control to press before capturing, such as a view toggle.
      if (page.press) {
        await tab.click(page.press);
        await tab.waitForTimeout(150);
      }
      // Scroll to the bottom first: that is where a fixed tab bar overlaps.
      await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await tab.waitForTimeout(150);

      problems = status === 200 ? await tab.evaluate(auditPage) : [`HTTP ${status}`];
      await tab.evaluate(() => window.scrollTo(0, 0));
      await tab.screenshot({
        path: path.join(OUT_DIR, `${page.name}-${width}.png`),
        fullPage: true,
      });
    }

    if (problems.length > 0) {
      failures += problems.length;
      console.log(`FAIL ${page.name} @ ${width}px`);
      for (const problem of problems) console.log(`     - ${problem}`);
    } else {
      console.log(`ok   ${page.name} @ ${width}px`);
    }

    await tab.close();
  }

  await context.close();
}

await browser.close();

console.log(`\n${failures === 0 ? "No layout problems found." : `${failures} layout problem(s) found.`}`);
console.log(`Screenshots in ${OUT_DIR}`);
process.exit(failures === 0 ? 0 : 1);
