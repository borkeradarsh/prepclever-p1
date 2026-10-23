// Where every mark on the India map goes. Pure geometry, no React, so the
// component and the tests place dots and labels from exactly one source.
//
// Dots come from project() in india-map.paths.ts — the same function that built
// the outline — so a dot can never drift off its coastline.

import { MAP_BOX, project } from "./india-map.paths";

export type MapCity = {
  city: string;
  lat: number;
  lon: number;
  /** Share of GCC hiring, H1 2026. 0 marks a tier-2 city, which has no own share. */
  share: number;
  /** Year-on-year growth, where the source reports it for that city. */
  growth: string;
};

export type PlacedCity = MapCity & {
  /** Dot centre, in map-box units. */
  x: number;
  y: number;
  r: number;
  tier2: boolean;
  /** Rank by share, 1-based. Null for tier-2 cities. */
  rank: number | null;
  side: "left" | "right";
  /** Label baseline in the wide layout, in wide-viewBox units. */
  labelY: number;
};

/** Wide layout: map box inset inside a viewBox with a label column each side. */
export const WIDE = {
  width: 500,
  height: 392,
  mapX: 86,
  mapY: 12,
  leftText: 76,
  rightText: 418,
  /** How far from the text the leader line turns to horizontal. */
  elbow: 22,
  labelTop: 24,
  labelBottom: 368,
} as const;

/** Narrow layout: the map box alone, numerals beside the dots. */
export const NARROW = {
  width: MAP_BOX.width,
  height: MAP_BOX.height,
  mapX: 0,
  mapY: 0,
} as const;

/** Biggest dot, in map-box units. Area is proportional to share. */
export const MAX_RADIUS = 10;
/** Tier-2 cities get one fixed small hollow dot; their 15% is a combined share. */
export const TIER2_RADIUS = 4;
/** Minimum vertical distance between two labels in the same column. */
export const MIN_LABEL_GAP = 34;

const radiusFor = (share: number, maxShare: number) =>
  share === 0 ? TIER2_RADIUS : MAX_RADIUS * Math.sqrt(share / maxShare);

/**
 * Spreads labels down a column so none is closer than MIN_LABEL_GAP, while
 * keeping them in the same order as their dots. Order preservation is what
 * guarantees leader lines in a column never cross.
 */
function spread(desired: number[], top: number, bottom: number): number[] {
  const out = desired.slice();
  for (let i = 1; i < out.length; i++) {
    out[i] = Math.max(out[i], out[i - 1] + MIN_LABEL_GAP);
  }
  // If the column overflowed the bottom, push back up from the end.
  if (out.length > 0 && out[out.length - 1] > bottom) {
    out[out.length - 1] = bottom;
    for (let i = out.length - 2; i >= 0; i--) {
      out[i] = Math.min(out[i], out[i + 1] - MIN_LABEL_GAP);
    }
  }
  if (out.length > 0 && out[0] < top) {
    out[0] = top;
    for (let i = 1; i < out.length; i++) {
      out[i] = Math.max(out[i], out[i - 1] + MIN_LABEL_GAP);
    }
  }
  return out;
}

export function layoutCities(cities: MapCity[]): PlacedCity[] {
  const maxShare = Math.max(...cities.map((c) => c.share));
  // West half of the city list goes to the west column. Splitting on the median
  // longitude keeps the two columns balanced and, because the cities cluster in
  // the west of the country, gives much shorter leader lines than splitting on
  // the middle of the map would.
  const medianLon = [...cities].map((c) => c.lon).sort((a, b) => a - b)[
    Math.floor(cities.length / 2)
  ];

  const projected = cities.map((city) => {
    const [x, y] = project(city.lon, city.lat);
    return {
      ...city,
      x,
      y,
      r: radiusFor(city.share, maxShare),
      tier2: city.share === 0,
      rank: null as number | null,
      side: "left" as "left" | "right",
      labelY: y,
    };
  });

  // Rank by share, highest first. Tier-2 cities are not ranked.
  [...projected]
    .filter((c) => !c.tier2)
    .sort((a, b) => b.share - a.share)
    .forEach((c, index) => {
      c.rank = index + 1;
    });

  for (const c of projected) c.side = c.lon <= medianLon ? "left" : "right";

  for (const side of ["left", "right"] as const) {
    const column = projected
      .filter((c) => c.side === side)
      .sort((a, b) => a.y - b.y);
    const placed = spread(
      column.map((c) => c.y + WIDE.mapY),
      WIDE.labelTop,
      WIDE.labelBottom,
    );
    column.forEach((c, index) => {
      c.labelY = placed[index];
    });
  }

  return projected;
}

/**
 * The leader line from a dot to its label, as [x1, y1, x2, y2, x3, y3].
 * `radiusScale` must match the scale the dot is drawn at, so the line starts at
 * the dot's edge rather than inside or short of it.
 */
export function leaderPoints(
  city: PlacedCity,
  radiusScale = 1,
): [number, number, number, number, number, number] {
  const cx = city.x + WIDE.mapX;
  const cy = city.y + WIDE.mapY;
  const left = city.side === "left";
  const textX = left ? WIDE.leftText : WIDE.rightText;
  const turn = left ? textX + WIDE.elbow : textX - WIDE.elbow;
  const gap = city.r * radiusScale + 3;
  const exit = left ? cx - gap : cx + gap;
  const end = left ? textX - 2 : textX + 2;
  return [exit, cy, turn, city.labelY, end, city.labelY];
}
