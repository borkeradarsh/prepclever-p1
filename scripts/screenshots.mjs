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

// A concept lesson on the legacy URL (lessons are Pro, so free sees the lock).
const LESSON = "/courses/linalg/lessons/vectors-dot-products-and-norms";

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
  { name: "dashboard", url: "/dashboard" },
  { name: "path", url: "/path" },
  { name: "courses", url: "/courses" },
  { name: "profile", url: "/profile" },
  { name: "upgrade", url: "/upgrade" },
  { name: "lesson-locked", url: LESSON },
  { name: "lesson-pro", url: LESSON, cookies: { "prepclever-dev": "plan:pro" } },
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
    await context.clearCookies();
    if (page.cookies) {
      await context.addCookies(
        Object.entries(page.cookies).map(([name, value]) => ({ name, value, url: BASE_URL })),
      );
    }
    const tab = await context.newPage();
    const response = await tab.goto(`${BASE_URL}${page.url}`, { waitUntil: "networkidle" });
    const status = response?.status() ?? 0;

    // Scroll to the bottom first: that is where a fixed tab bar overlaps.
    await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await tab.waitForTimeout(150);

    const problems = status === 200 ? await tab.evaluate(auditPage) : [`HTTP ${status}`];
    await tab.evaluate(() => window.scrollTo(0, 0));
    await tab.screenshot({
      path: path.join(OUT_DIR, `${page.name}-${width}.png`),
      fullPage: true,
    });

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
