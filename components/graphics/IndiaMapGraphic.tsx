// A stylised map of India with the GCC hiring hotspots.
//
// The outline is a 173-point trace of the real boundary — the Ladakh salient,
// the Sikkim notch, the north-east arm, the Sundarbans, the Konkan and Kerala
// coasts, Saurashtra and Kutch — projected from lon/lat into a 320 x 368 box,
// so the coastline and the city dots share one coordinate space. It is drawn
// as a polyline rather than a smoothed curve: at this point density each
// segment is a couple of pixels long, and smoothing only rounded real features
// away. The island territories come from the same projection, which is the
// only way they land in the right place relative to the mainland. That box is
// then inset inside a wider viewBox to leave room for the label columns.
//
// Labels sit in two tidy columns joined to their dot by a leader line, rather
// than floating next to the dot: Mumbai and Pune are nine units apart and would
// otherwise overlap. Decorative — the same figures are rendered as a real list
// beside the map, which is what assistive technology reads.

import type { MapHotspot } from "@/content/landing.config";

const INDIA_OUTLINE =
  "M96.7 21.9 L107.3 21.9 L112.5 32.1 L118.9 35.5 L125.2 34.4 L129.4 45.8 L123.1 50.3 L121 57.2 L116.8 54.9 L116.8 62.8 L121 68.5 L129.4 74.2 L132.6 77.6 L131.5 84.5 L134.7 87.9 L135.7 94.7 L141 98.1 L150.5 102.7 L158.9 106.1 L166.3 108.3 L173.7 112.9 L179 115.2 L185.3 120.9 L193.8 123.1 L204.3 125.4 L214.8 125.4 L215.9 116.3 L221.2 106.1 L224.3 115.2 L226.5 120.9 L235.9 120.9 L246.5 120.9 L257 119.7 L258.1 118.6 L264.4 112.9 L272.9 100.4 L283.4 92.4 L292.9 95.8 L301.3 93.6 L306.6 101.5 L314 103.8 L308.7 110.6 L302.4 116.3 L291.8 122 L289.7 128.8 L284.5 136.8 L284.5 144.8 L281.3 151.6 L271.8 153.9 L271.8 164.1 L268.6 173.2 L266.5 176.6 L260.2 174.3 L250.7 164.1 L248.6 153.9 L252.8 151.6 L258.1 142.5 L246.5 139.1 L235.9 139.1 L233.8 137.9 L231.7 130 L225.4 127.7 L220.1 124.3 L217 126.5 L215.9 135.7 L220.1 139.1 L215.9 147 L222.2 150.4 L214.8 158.4 L222.2 161.8 L224.3 173.2 L213.8 178.9 L204.3 181.2 L200.1 194.8 L191.6 200.5 L185.3 202.8 L179 208.5 L172.7 217.6 L165.3 222.1 L161.1 226.7 L154.7 233.5 L151.6 236.9 L145.2 240.3 L141 246 L136.8 246 L131.5 252.8 L131.5 261.9 L132.6 271 L133.6 276.7 L129.4 287 L128.4 292.6 L128.4 297.2 L125.2 302.9 L123.1 308.6 L125.2 313.1 L121 317.7 L118.9 319.9 L113.6 321.1 L111.5 324.5 L108.3 329 L104.1 333.6 L99.9 331.3 L96.7 325.6 L93.5 319.9 L90.4 313.1 L87.2 302.9 L85.1 294.9 L81.9 290.4 L79.8 284.7 L75.6 279 L73.5 272.2 L71.4 264.2 L68.2 257.4 L66.1 250.6 L61.9 243.7 L59.8 236.9 L58.7 228.9 L55.6 221 L54.5 210.7 L53.5 203.9 L53.5 195.9 L55.6 188 L52.4 182.3 L55.6 177.7 L51.4 177.7 L48.2 184.6 L40.8 188 L34.5 189.1 L26 186.8 L20.8 181.2 L15.5 175.5 L13.4 170.9 L19.7 169.8 L27.1 166.4 L31.3 165.2 L26 161.8 L16.5 164.1 L10.2 159.5 L6 157.3 L6 152.7 L13.4 149.3 L20.8 149.3 L27.1 148.2 L31.3 149.3 L35.5 144.8 L34.5 139.1 L31.3 133.4 L26 130 L20.8 124.3 L25 118.6 L26 111.8 L31.3 109.5 L38.7 108.3 L45 108.3 L49.2 103.8 L55.6 98.1 L60.8 89 L66.1 83.3 L72.5 76.5 L73.5 71.9 L77.7 67.4 L73.5 62.8 L72.5 56 L70.3 52.6 L68.2 48.1 L66.1 42.4 L69.3 36.7 L66.1 32.1 L70.3 29.9 L77.7 32.1 L86.2 32.1 L91.4 25.3 L94.6 23 Z";

// The northern boundary continues west through the Kashmir region. It is
// layered over the older simplified segment so the territory reads as one
// continuous silhouette without changing the map's existing visual treatment.
const NORTHWEST_EXTENSION =
  "M96.7 22 L84 15 L70 14 L57 18 L47 25 L40 34 L42 43 L50 51 L61 57 L72 67 L77 78 L96 78 Z";
const NORTHWEST_EXTENSION_EDGE =
  "M96.7 22 L84 15 L70 14 L57 18 L47 25 L40 34 L42 43 L50 51 L61 57 L72 67 L77 78";

// The island groups, centred on the mainland's own projection. Traced true to
// shape they come out a pixel or two wide and read as specks of dirt, so each
// archipelago is drawn as one slim ellipse on its real centre instead.
const ISLANDS = [
  { cx: 266.5, cy: 276.5, rx: 2.8, ry: 5.5 }, // North and Middle Andaman
  { cx: 264.2, cy: 291, rx: 2.8, ry: 5.5 }, // South Andaman
  { cx: 274.8, cy: 341, rx: 2.4, ry: 4.6 }, // Nicobar
];

/** Lakshadweep, far off the Kerala coast: a scatter, not an outline. */
const LAKSHADWEEP = [
  [52.4, 305.2],
  [48.2, 297.2],
  [56.6, 309.7],
];

/** Where the map box sits inside the wider viewBox. */
const MAP_X = 92;
const MAP_Y = 6;
/** Where each label column starts, and where its leader line turns. */
const LEFT_TEXT = 80;
const RIGHT_TEXT = 424;
const ELBOW = 24;

/** Dot radius from share of hiring; tier-2 cities (share 0) get the floor. */
const radiusFor = (share: number) => (share === 0 ? 3.5 : 4 + Math.sqrt(share) * 1.15);

export function IndiaMapGraphic({ hotspots }: { hotspots: MapHotspot[] }) {
  const shift = `translate(${MAP_X} ${MAP_Y})`;

  return (
    <svg
      className="india-map"
      viewBox="0 0 490 380"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="map-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0 H0 V16" fill="none" stroke="var(--border)" strokeOpacity="0.5" strokeWidth="0.6" />
        </pattern>
        <clipPath id="map-clip">
          <path d={INDIA_OUTLINE} transform={shift} />
        </clipPath>
      </defs>

      <g clipPath="url(#map-clip)">
        <rect width="490" height="380" fill="var(--surface-muted)" />
        <rect width="490" height="380" fill="url(#map-grid)" />
      </g>
      <path d={NORTHWEST_EXTENSION} transform={shift} fill="var(--surface-muted)" />
      <path d={NORTHWEST_EXTENSION} transform={shift} fill="url(#map-grid)" />
      <path
        d={INDIA_OUTLINE}
        transform={shift}
        fill="none"
        stroke="var(--border-strong)"
        strokeOpacity="0.75"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d={NORTHWEST_EXTENSION_EDGE}
        transform={shift}
        fill="none"
        stroke="var(--border-strong)"
        strokeOpacity="0.75"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />

      <g transform={shift}>
        {ISLANDS.map((island) => (
          <ellipse
            cx={island.cx}
            cy={island.cy}
            rx={island.rx}
            ry={island.ry}
            key={`${island.cx}-${island.cy}`}
            fill="var(--surface-muted)"
            stroke="var(--border-strong)"
            strokeOpacity="0.75"
            strokeWidth="1"
          />
        ))}
        {LAKSHADWEEP.map(([x, y]) => (
          <circle cx={x} cy={y} r="1.8" fill="var(--border-strong)" fillOpacity="0.7" key={`${x}-${y}`} />
        ))}
      </g>

      {hotspots.map((spot) => {
        const cx = spot.x + MAP_X;
        const cy = spot.y + MAP_Y;
        const r = radiusFor(spot.share);
        const tier2 = spot.share === 0;
        const left = spot.side === "left";
        const textX = left ? LEFT_TEXT : RIGHT_TEXT;
        const turn = left ? textX + ELBOW : textX - ELBOW;
        const exit = left ? cx - r - 3 : cx + r + 3;

        return (
          <g key={spot.city}>
            <path
              d={`M${exit} ${cy} L${turn} ${spot.labelY} L${left ? textX - 2 : textX + 2} ${spot.labelY}`}
              fill="none"
              stroke="var(--border-strong)"
              strokeOpacity="0.55"
              strokeWidth="0.8"
            />
            {!tier2 ? (
              <circle cx={cx} cy={cy} r={r + 5} fill="var(--accent-ink)" fillOpacity="0.12" />
            ) : null}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={tier2 ? "var(--surface-card)" : "var(--accent-ink)"}
              fillOpacity={tier2 ? 1 : 0.9}
              stroke={tier2 ? "var(--accent-ink)" : "none"}
              strokeOpacity="0.75"
              strokeWidth="1"
              strokeDasharray={tier2 ? "2 2" : undefined}
            />
            <text x={textX} y={spot.labelY + 1} className="map-city" textAnchor={left ? "end" : "start"}>
              {spot.city}
            </text>
            <text x={textX} y={spot.labelY + 12} className="map-share" textAnchor={left ? "end" : "start"}>
              {spot.share > 0 ? `${spot.share}% of hiring` : "tier 2"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
