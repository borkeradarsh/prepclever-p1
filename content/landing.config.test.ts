// Invariants that keep the landing page honest when someone edits the copy.
// Content itself is not asserted — only the things a component silently
// depends on: block ids matching glyphs, map coordinates inside the viewBox,
// and every nav link pointing at a route that exists.

import { describe, expect, it } from "vitest";
import { blueprint, growth, logoWall, pillars, testimonials } from "./landing.config";
import { footerNav, marketingNav } from "./marketing-nav.config";

/** Keys BlockGlyph knows how to draw. Keep in step with components/graphics/BlockGlyph.tsx. */
const GLYPH_KEYS = [
  "market-intelligence",
  "gap-analysis",
  "upskilling",
  "positioning",
  "referrals",
  "interview",
];

/** Routes that exist under app/. A nav link outside this set 404s. */
const KNOWN_ROUTES = [
  "/",
  "/companies",
  "/roles",
  "/tools/resume-evaluate",
  "/login",
  "/signup",
  "/upgrade",
];

const isKnown = (href: string) => {
  if (href.startsWith("mailto:")) return true;
  const [path] = href.split("#");
  return KNOWN_ROUTES.includes(path === "" ? "/" : path);
};

describe("blueprint", () => {
  it("has the six blocks the section promises", () => {
    expect(blueprint.blocks).toHaveLength(6);
  });

  it("numbers the blocks 01 to 06 in order", () => {
    expect(blueprint.blocks.map((block) => block.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);
  });

  it("gives every block a glyph that exists", () => {
    for (const block of blueprint.blocks) {
      expect(GLYPH_KEYS).toContain(block.id);
    }
  });

  it("mirrors the four onboarding starting points in the call to action", () => {
    expect(blueprint.cta.options).toHaveLength(4);
    expect(blueprint.cta.href).toBe("/signup");
  });
});

describe("growth story", () => {
  // Positions are real coordinates; the map projects them. Pixel placement and
  // the boundary itself are covered by components/graphics/india-map.test.ts.
  it("gives every hotspot plausible Indian coordinates", () => {
    for (const spot of growth.map.hotspots) {
      expect(spot.lat, spot.city).toBeGreaterThan(6);
      expect(spot.lat, spot.city).toBeLessThan(38);
      expect(spot.lon, spot.city).toBeGreaterThan(68);
      expect(spot.lon, spot.city).toBeLessThan(98);
    }
  });

  it("never claims a city share above 100%", () => {
    const total = growth.map.hotspots.reduce((sum, spot) => sum + spot.share, 0);
    expect(total).toBeLessThanOrEqual(100);
  });

  it("cites its sources", () => {
    expect(growth.source).toMatch(/Nasscom|foundit/);
  });
});

describe("sections", () => {
  it("renders three pillars, each with a distinct graphic", () => {
    const graphics = pillars.map((pillar) => pillar.graphic);
    expect(pillars).toHaveLength(3);
    expect(new Set(graphics).size).toBe(3);
  });

  it("lists twenty companies on the logo wall, with no duplicates", () => {
    expect(logoWall.companies).toHaveLength(20);
    expect(new Set(logoWall.companies).size).toBe(20);
  });

  it("has enough testimonials for the scroller to be worth scrolling", () => {
    expect(testimonials.items.length).toBeGreaterThanOrEqual(4);
  });
});

describe("navigation", () => {
  it("points every nav link at a route that exists", () => {
    for (const item of marketingNav) {
      if (item.kind === "link") {
        expect(isKnown(item.href), item.href).toBe(true);
        continue;
      }
      for (const entry of item.items) expect(isKnown(entry.href), entry.href).toBe(true);
    }
  });

  it("points every footer link at a route that exists", () => {
    for (const column of footerNav) {
      for (const link of column.links) expect(isKnown(link.href), link.href).toBe(true);
    }
  });

  it("gives each dropdown a unique id", () => {
    const ids = marketingNav.filter((item) => item.kind === "menu").map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
