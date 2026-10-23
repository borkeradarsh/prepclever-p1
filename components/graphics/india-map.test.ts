// Section 4 of docs/india-map-spec.md: the boundary must be the official
// Survey of India depiction, and the marks on top of it must not collide.
//
// The point-in-polygon checks run against the generated path itself, not the
// source GeoJSON, so over-simplification is caught here rather than in review.
// If one fails, reduce the simplification tolerance in scripts/build-india-map.ts
// and rebuild — do not move the test point.

import { describe, expect, it } from "vitest";
import { INDIA_LAND_PATH, MAP_BOX, project } from "./india-map.paths";
import { layoutCities, leaderPoints, MIN_LABEL_GAP, WIDE } from "./india-map.layout";
import { growth } from "@/content/landing.config";

type Ring = [number, number][];

/** Parses the generated "M x yL x y...Z" subpaths back into rings. */
function parseRings(path: string): Ring[] {
  return path
    .split("M")
    .filter(Boolean)
    .map((chunk) =>
      chunk
        .replace(/Z$/, "")
        .split("L")
        .map((pair) => pair.trim().split(/\s+/).map(Number) as [number, number]),
    );
}

const RINGS = parseRings(INDIA_LAND_PATH);

function inRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const isOnLand = (lon: number, lat: number) => {
  const [x, y] = project(lon, lat);
  return RINGS.some((ring) => inRing(x, y, ring));
};

/** Do segments ab and cd properly cross? Shared endpoints do not count. */
function crosses(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
): boolean {
  const side = (p: [number, number], q: [number, number], r: [number, number]) =>
    Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  const d1 = side(a, b, c);
  const d2 = side(a, b, d);
  const d3 = side(c, d, a);
  const d4 = side(c, d, b);
  return d1 !== d2 && d3 !== d4 && d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0;
}

/** The leader line as its two straight segments. */
function leaderSegments(city: ReturnType<typeof layoutCities>[number]) {
  const [x1, y1, x2, y2, x3, y3] = leaderPoints(city);
  return [
    [[x1, y1], [x2, y2]],
    [[x2, y2], [x3, y3]],
  ] as [[number, number], [number, number]][];
}

describe("boundary (Survey of India depiction)", () => {
  // Section 4. Every one of these must be inside the outline.
  const points: [string, number, number][] = [
    ["Muzaffarabad (Pakistan-occupied Kashmir)", 34.37, 73.47],
    ["Gilgit (Gilgit-Baltistan)", 35.92, 74.31],
    ["Leh (Ladakh)", 34.15, 77.58],
    ["Aksai Chin (central)", 35.0, 79.5],
    ["Itanagar (Arunachal Pradesh)", 27.08, 93.61],
    ["Kanyakumari", 8.09, 77.55],
    ["Port Blair (Andaman)", 11.62, 92.73],
    ["Kavaratti (Lakshadweep)", 10.57, 72.64],
  ];

  for (const [name, lat, lon] of points) {
    it(`includes ${name}`, () => {
      expect(isOnLand(lon, lat)).toBe(true);
    });
  }

  it("keeps the path data under 60 KB", () => {
    expect(INDIA_LAND_PATH.length).toBeLessThan(60 * 1024);
  });

  it("stays inside the drawing box", () => {
    for (const ring of RINGS) {
      for (const [x, y] of ring) {
        expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
        expect(x).toBeGreaterThanOrEqual(-1);
        expect(y).toBeGreaterThanOrEqual(-1);
        expect(x).toBeLessThanOrEqual(MAP_BOX.width + 1);
        expect(y).toBeLessThanOrEqual(MAP_BOX.height + 1);
      }
    }
  });
});

describe("city dots", () => {
  const placed = layoutCities(growth.map.hotspots);

  it("places every dot on land", () => {
    for (const city of placed) {
      expect(isOnLand(city.lon, city.lat), city.city).toBe(true);
    }
  });

  it("never overlaps two dots", () => {
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i];
        const b = placed[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        expect(distance, `${a.city} and ${b.city}`).toBeGreaterThanOrEqual(a.r + b.r);
      }
    }
  });

  it("ranks the cities that have their own share, and only those", () => {
    const ranked = placed.filter((c) => !c.tier2).map((c) => c.rank);
    expect([...ranked].sort((a, b) => a! - b!)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(placed.filter((c) => c.tier2).every((c) => c.rank === null)).toBe(true);
    expect(placed.find((c) => c.rank === 1)?.city).toBe("Bengaluru");
  });

  it("sizes dots by share, with area proportional and a capped maximum", () => {
    const top = placed.find((c) => c.city === "Bengaluru")!;
    const mid = placed.find((c) => c.city === "Hyderabad")!;
    // Area ∝ share, so radius ∝ √share.
    expect(mid.r / top.r).toBeCloseTo(Math.sqrt(15 / 30), 5);
    expect(Math.max(...placed.map((c) => c.r))).toBeLessThanOrEqual(10);
  });
});

describe("labels", () => {
  const placed = layoutCities(growth.map.hotspots);

  it("uses both columns", () => {
    expect(placed.some((c) => c.side === "left")).toBe(true);
    expect(placed.some((c) => c.side === "right")).toBe(true);
  });

  it("keeps labels in a column at least the minimum gap apart", () => {
    for (const side of ["left", "right"] as const) {
      const ys = placed
        .filter((c) => c.side === side)
        .map((c) => c.labelY)
        .sort((a, b) => a - b);
      for (let i = 1; i < ys.length; i++) {
        expect(ys[i] - ys[i - 1], `${side} column`).toBeGreaterThanOrEqual(MIN_LABEL_GAP - 0.001);
      }
    }
  });

  it("orders each column by latitude, so leader lines cannot cross", () => {
    for (const side of ["left", "right"] as const) {
      const column = placed.filter((c) => c.side === side).sort((a, b) => a.labelY - b.labelY);
      for (let i = 1; i < column.length; i++) {
        expect(column[i].y, `${side} column`).toBeGreaterThanOrEqual(column[i - 1].y);
      }
    }
  });

  it("never crosses one leader line over another", () => {
    const segments = placed.flatMap(leaderSegments);
    for (let i = 0; i < segments.length; i++) {
      for (let j = i + 1; j < segments.length; j++) {
        const [a, b] = segments[i];
        const [c, d] = segments[j];
        expect(crosses(a, b, c, d), `segment ${i} and ${j}`).toBe(false);
      }
    }
  });

  it("keeps labels inside the viewBox", () => {
    for (const city of placed) {
      expect(city.labelY).toBeGreaterThanOrEqual(WIDE.labelTop);
      expect(city.labelY).toBeLessThanOrEqual(WIDE.labelBottom);
    }
  });
});

describe("caption", () => {
  it("names the source and the boundary depiction", () => {
    expect(growth.map.caption).toContain("foundit");
    expect(growth.map.caption).toContain("Survey of India");
    expect(growth.map.caption).toContain("not to scale");
  });

  it("says the tier-2 share is combined", () => {
    const tier2 = growth.map.legend.find((entry) => entry.kind === "tier2");
    expect(tier2?.label).toMatch(/combined/i);
  });
});
