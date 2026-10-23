// One-off build step: turns the Survey of India boundary GeoJSON into
// precomputed SVG path data, so the runtime component carries no geo code and
// no geo dependencies.
//
//   node --experimental-strip-types scripts/build-india-map.ts
//   (or: pnpm build:map)
//
// Input   data/source/india-soi.geojson   (not committed; see docs/research/map-source.md)
// Output  components/graphics/india-map.paths.ts
//
// Nothing here runs in the browser. See docs/india-map-spec.md for the rules
// this follows, in particular section 2 on the boundary.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

type Point = [number, number];
type Ring = Point[];

const SOURCE = "data/source/india-soi.geojson";
const OUTPUT = "components/graphics/india-map.paths.ts";

/** Albers equal-area conic, centred on India. Section 3.2 of the spec. */
const LON_0 = 82;
const LAT_0 = 22;
const LAT_1 = 12;
const LAT_2 = 28;

/** The projected drawing box, in SVG units. */
const BOX_WIDTH = 320;
const BOX_HEIGHT = 368;

/**
 * Douglas-Peucker tolerance in SVG units. 0.22 keeps the northern boundary
 * visually identical (see the deviation report the script prints) while
 * bringing the path under the size budget.
 */
const SIMPLIFY_TOLERANCE = 0.22;

/** Polygons smaller than this are dropped, unless they are island territories. */
const MIN_AREA = 0.5;

/**
 * The two island groups, by lon/lat bounds. At true scale Lakshadweep is well
 * under a pixel across, so these are kept and given a floor size rather than
 * dropped — standard cartographic exaggeration, and the caption says the map
 * is not to scale. Keeping them in place (rather than as insets) means one
 * projection governs every mark on the map.
 */
const ISLAND_GROUPS = [
  // Ranked by true area, because Kavaratti's island is only the ninth largest
  // feature here — several of the larger ones are reef and atoll outlines.
  { name: "Lakshadweep", lon: [71.5, 74.5], lat: [8, 12.5], keep: 12, minSize: 2.4 },
  { name: "Andaman & Nicobar", lon: [92, 94.5], lat: [6, 14.5], keep: 10, minSize: 1.8 },
];

const rad = (deg: number) => (deg * Math.PI) / 180;

// --- Projection -------------------------------------------------------------

const n = (Math.sin(rad(LAT_1)) + Math.sin(rad(LAT_2))) / 2;
const C = Math.cos(rad(LAT_1)) ** 2 + 2 * n * Math.sin(rad(LAT_1));
const rho0 = Math.sqrt(C - 2 * n * Math.sin(rad(LAT_0))) / n;

/**
 * Raw Albers, before the fit to the drawing box. The y term is negated because
 * Albers puts north at increasing y while SVG puts it at decreasing y.
 */
function albers(lon: number, lat: number): Point {
  const theta = n * rad(lon - LON_0);
  const rho = Math.sqrt(C - 2 * n * Math.sin(rad(lat))) / n;
  return [rho * Math.sin(theta), rho * Math.cos(theta) - rho0];
}

// --- Geometry helpers -------------------------------------------------------

function signedArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return sum / 2;
}

const area = (ring: Ring) => Math.abs(signedArea(ring));

function bounds(ring: Ring) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function centroid(ring: Ring): Point {
  const b = bounds(ring);
  return [(b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2];
}

/** Perpendicular distance from p to the segment ab, squared. */
function segmentDistanceSq(p: Point, a: Point, b: Point): number {
  let [x, y] = a;
  let dx = b[0] - x;
  let dy = b[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      [x, y] = b;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p[0] - x;
  dy = p[1] - y;
  return dx * dx + dy * dy;
}

/** Douglas-Peucker. Returns the kept points and which original indices survived. */
function simplify(ring: Ring, tolerance: number): { ring: Ring; keep: Uint8Array } {
  if (ring.length <= 4) return { ring, keep: new Uint8Array(ring.length).fill(1) };
  const toleranceSq = tolerance * tolerance;
  const keep = new Uint8Array(ring.length);
  keep[0] = 1;
  keep[ring.length - 1] = 1;

  const stack: [number, number][] = [[0, ring.length - 1]];
  while (stack.length > 0) {
    const [first, last] = stack.pop()!;
    let index = -1;
    let furthest = 0;
    for (let i = first + 1; i < last; i++) {
      const d = segmentDistanceSq(ring[i], ring[first], ring[last]);
      if (d > furthest) {
        furthest = d;
        index = i;
      }
    }
    if (furthest > toleranceSq && index !== -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  const out: Ring = [];
  for (let i = 0; i < ring.length; i++) if (keep[i]) out.push(ring[i]);
  return { ring: out, keep };
}

/**
 * How far the simplified ring actually moved, measured only over the original
 * points above `minLat`. Section 2 forbids visibly changing the northern
 * boundary, and the mainland ring is where that boundary lives — so this has
 * to be measured per point, not per ring.
 */
function deviationAbove(original: Ring, lonLat: Ring, simplified: Ring, minLat: number): number {
  let worst = 0;
  for (let i = 0; i < original.length; i++) {
    if (lonLat[i][1] <= minLat) continue;
    let best = Infinity;
    for (let j = 1; j < simplified.length; j++) {
      const d = segmentDistanceSq(original[i], simplified[j - 1], simplified[j]);
      if (d < best) best = d;
    }
    if (best > worst) worst = best;
  }
  return Math.sqrt(worst);
}

/** Grows a ring about its own centre until it is at least `minSize` across. */
function inflate(ring: Ring, minSize: number): Ring {
  const b = bounds(ring);
  const extent = Math.max(b.width, b.height);
  if (extent >= minSize || extent === 0) return ring;
  const factor = minSize / extent;
  const [cx, cy] = centroid(ring);
  return ring.map(([x, y]) => [cx + (x - cx) * factor, cy + (y - cy) * factor] as Point);
}

const inBox = (lon: number, lat: number, g: (typeof ISLAND_GROUPS)[number]) =>
  lon >= g.lon[0] && lon <= g.lon[1] && lat >= g.lat[0] && lat <= g.lat[1];

// --- Build ------------------------------------------------------------------

const raw = readFileSync(SOURCE);
const sha256 = createHash("sha256").update(raw).digest("hex");
const geo = JSON.parse(raw.toString("utf8"));
const feature = geo.features[0];
const sourceName = feature.properties?.Source ?? "unknown";

if (feature.geometry.type !== "MultiPolygon") {
  throw new Error(`Expected a MultiPolygon, got ${feature.geometry.type}`);
}

// Each polygon in this dataset is a single ring; assert rather than assume.
const lonLatRings: Ring[] = feature.geometry.coordinates.map((polygon: Ring[]) => {
  if (polygon.length !== 1) {
    throw new Error(`Expected one ring per polygon, got ${polygon.length}`);
  }
  return polygon[0];
});

// Which island group, if any, each ring belongs to — decided in lon/lat, before
// projecting, so the test points and the rule speak the same language.
const groupOf = lonLatRings.map((ring) => {
  const [lon, lat] = centroid(ring);
  return ISLAND_GROUPS.findIndex((g) => inBox(lon, lat, g));
});

const projectedRings: Ring[] = lonLatRings.map((ring) =>
  ring.map(([lon, lat]) => albers(lon, lat)),
);

// Fit every projected ring into the drawing box, preserving aspect ratio.
let fit = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
for (const ring of projectedRings) {
  const b = bounds(ring);
  fit = {
    minX: Math.min(fit.minX, b.minX),
    minY: Math.min(fit.minY, b.minY),
    maxX: Math.max(fit.maxX, b.maxX),
    maxY: Math.max(fit.maxY, b.maxY),
  };
}
const scale = Math.min(BOX_WIDTH / (fit.maxX - fit.minX), BOX_HEIGHT / (fit.maxY - fit.minY));
const offsetX = (BOX_WIDTH - (fit.maxX - fit.minX) * scale) / 2 - fit.minX * scale;
const offsetY = (BOX_HEIGHT - (fit.maxY - fit.minY) * scale) / 2 - fit.minY * scale;

const toBox = (ring: Ring): Ring =>
  ring.map(([x, y]) => [x * scale + offsetX, y * scale + offsetY] as Point);

// Simplify the mainland and its coastal islands; leave the island territories
// alone. They are already far smaller than the tolerance, so simplifying them
// would both destroy their shape and scramble the area ranking below.
type Kept = { ring: Ring; group: number; area: number };
const candidates: Kept[] = [];
let worstError = 0;
let worstErrorNorth = 0;

projectedRings.forEach((ring, index) => {
  const boxed = toBox(ring);
  const group = groupOf[index];
  if (group !== -1) {
    candidates.push({ ring: boxed, group, area: area(boxed) });
    return;
  }
  const { ring: simplified } = simplify(boxed, SIMPLIFY_TOLERANCE);
  if (simplified.length < 4) return;
  const lonLat = lonLatRings[index];
  worstError = Math.max(worstError, deviationAbove(boxed, lonLat, simplified, -90));
  worstErrorNorth = Math.max(worstErrorNorth, deviationAbove(boxed, lonLat, simplified, 30));
  candidates.push({ ring: simplified, group: -1, area: area(simplified) });
});

const kept: Kept[] = [];
for (let g = 0; g < ISLAND_GROUPS.length; g++) {
  const group = ISLAND_GROUPS[g];
  const all = candidates.filter((c) => c.group === g).sort((a, b) => b.area - a.area);
  const members = all.slice(0, group.keep);
  for (const member of members) {
    // Each island is grown about its own centre to a visible floor size, then
    // reduced to a handful of points: at this scale the real outline is far
    // under a pixel, so its detail is noise.
    const floated = inflate(member.ring, group.minSize);
    const { ring: trimmed } = simplify(floated, group.minSize / 12);
    kept.push({ ...member, ring: trimmed.length >= 4 ? trimmed : floated });
  }
  console.log(`  ${group.name}: kept ${members.length} of ${all.length}`);
}
for (const c of candidates) if (c.group === -1 && c.area >= MIN_AREA) kept.push(c);

kept.sort((a, b) => b.area - a.area);

const toPath = (ring: Ring) =>
  `M${ring.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;

const landPath = kept.map((k) => toPath(k.ring)).join("");
const points = kept.reduce((sum, k) => sum + k.ring.length, 0);

const header = `// GENERATED FILE — do not edit by hand.
// Rebuild with: pnpm build:map  (scripts/build-india-map.ts)
//
// Boundary source : ${sourceName}
//                   DataMeet "maps" — Country/india-soi.geojson
//                   https://github.com/datameet/maps/blob/master/Country/india-soi.geojson
//                   Dissolved from Census of India 2011 district boundaries /
//                   Survey of India index maps, so the depiction follows the
//                   official Survey of India outline: the whole of Jammu and
//                   Kashmir including Gilgit-Baltistan, Ladakh including Aksai
//                   Chin, and Arunachal Pradesh.
// Licence         : CC-BY-SA 2.5 / ODbL (see docs/research/map-source.md)
// Downloaded      : 2026-10-23
// SHA-256         : ${sha256}
//
// Projection      : Albers equal-area conic, centre ${LAT_0}°N ${LON_0}°E,
//                   standard parallels ${LAT_1}°N and ${LAT_2}°N.
// Simplification  : Douglas-Peucker, tolerance ${SIMPLIFY_TOLERANCE} SVG units.
//                   Largest discarded deviation ${worstError.toFixed(3)} units
//                   overall, ${worstErrorNorth.toFixed(3)} north of 30°N.
// Rings / points  : ${kept.length} / ${points}
`;

const body = `
/** The drawing box the projection fits into, in SVG units. */
export const MAP_BOX = { width: ${BOX_WIDTH}, height: ${BOX_HEIGHT} } as const;

/** Projection constants, baked in at build time. */
const LON_0 = ${LON_0};
const N = ${n};
const C = ${C};
const RHO_0 = ${rho0};
const SCALE = ${scale};
const OFFSET_X = ${offsetX};
const OFFSET_Y = ${offsetY};

/**
 * Longitude and latitude to a point in MAP_BOX. The outline above was built
 * with this exact function, so dots placed with it can never drift off the
 * coastline.
 */
export function project(lon: number, lat: number): [number, number] {
  const theta = N * ((lon - LON_0) * Math.PI) / 180;
  const rho = Math.sqrt(C - 2 * N * Math.sin((lat * Math.PI) / 180)) / N;
  const x = rho * Math.sin(theta);
  const y = rho * Math.cos(theta) - RHO_0;
  return [x * SCALE + OFFSET_X, y * SCALE + OFFSET_Y];
}

/** India's land area: mainland, coastal islands and the island territories. */
export const INDIA_LAND_PATH =
  ${JSON.stringify(landPath)};
`;

writeFileSync(OUTPUT, `${header}${body}`);

const kb = (landPath.length / 1024).toFixed(1);
console.log(`\n  rings kept     ${kept.length}`);
console.log(`  points         ${points}`);
console.log(`  path data      ${kb} KB`);
console.log(`  max deviation  ${worstError.toFixed(3)} units (north of 30N: ${worstErrorNorth.toFixed(3)})`);
console.log(`  wrote          ${OUTPUT}`);
