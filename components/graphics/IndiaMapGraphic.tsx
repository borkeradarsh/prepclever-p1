// A stylised map of India with the GCC hiring hotspots. The outline is a
// smoothed Catmull-Rom curve through real lon/lat points projected into a
// 320 x 368 box, so city positions and the coastline share one coordinate
// space; that box is then inset inside a wider viewBox to leave room for the
// label columns on either side.
//
// Labels sit in two tidy columns joined to their dot by a leader line, rather
// than floating next to the dot: Mumbai and Pune are nine units apart and would
// otherwise overlap. Decorative — the same figures are rendered as a real list
// beside the map, which is what assistive technology reads.

import type { MapHotspot } from "@/content/landing.config";

const INDIA_OUTLINE =
  "M100.7 31.7 C103.6 32.6 113.4 38.6 116.2 41.7 C119.0 44.8 124.9 55.7 125.5 59.5 C126.1 63.3 120.5 73.5 121.3 76.1 C122.1 78.7 130.4 81.4 132.7 82.8 C135.0 84.2 139.1 87.3 142 88.4 C144.9 89.5 155.1 90.8 158.5 92.8 C161.9 94.8 170.0 104.1 172.9 106.2 C175.8 108.3 181.9 110.7 184.2 111.7 C186.5 112.7 191.2 114.6 193.5 115.1 C195.8 115.6 202.3 116.1 204.8 116.2 C207.3 116.3 213.9 115.0 216.2 116.2 C218.5 117.4 222.9 126.1 225.5 127.3 C228.1 128.5 236.6 127.4 239.9 127.3 C243.2 127.2 252.3 126.8 255.4 126.2 C258.5 125.6 264.8 122.9 267.7 121.7 C270.6 120.5 277.7 116.5 281.1 115.1 C284.5 113.7 295.5 109.8 298.7 109.5 C301.9 109.2 309.8 111.2 310 112.8 C310.2 114.4 303.1 122.0 300.7 124 C298.3 126.0 290.5 128.4 288.4 130.6 C286.3 132.8 283.1 141.3 282.2 144 C281.3 146.7 281.0 153.2 280.1 155.1 C279.2 157.0 275.2 158.1 273.9 160.7 C272.6 163.3 270.2 175.9 268.8 178.4 C267.4 180.9 262.8 183.8 261.5 182.9 C260.2 182.0 258.0 173.2 257.4 170.7 C256.8 168.2 257.3 162.1 256.4 160.7 C255.5 159.3 251.0 160.0 249.2 158.4 C247.4 156.8 241.7 147.9 239.9 146.2 C238.1 144.5 234.8 143.9 232.7 142.9 C230.6 141.9 223.2 138.4 221.3 137.3 C219.4 136.2 216.0 132.4 215.2 132.9 C214.4 133.4 213.9 139.5 214.1 141.7 C214.3 143.9 216.5 150.8 217.2 152.9 C217.9 155.0 220.4 159.0 220.3 160.7 C220.2 162.4 216.3 166.4 216.2 168.4 C216.1 170.4 218.5 176.5 219.3 178.4 C220.1 180.3 224.5 184.2 223.4 185.1 C222.3 186.0 211.3 185.3 209 186.2 C206.7 187.1 203.6 191.3 202.8 192.9 C202.0 194.5 203.1 199.3 201.8 200.7 C200.5 202.1 193.5 204.1 191.4 205.1 C189.3 206.1 185.1 208.4 183.2 209.6 C181.3 210.8 175.6 214.7 173.9 216.2 C172.2 217.7 169.4 221.3 167.7 222.9 C166.0 224.5 160.2 229.1 158.5 230.7 C156.8 232.3 154.0 235.8 152.3 237.4 C150.6 239.0 145.0 243.7 143 245.2 C141.0 246.7 135.8 248.5 134.7 250.7 C133.6 252.9 132.8 261.9 132.7 265.2 C132.6 268.5 133.9 277.5 133.7 280.7 C133.5 283.9 131.1 291.5 130.6 294.1 C130.1 296.7 130.2 302.1 129.6 304.1 C129.0 306.1 126.5 309.7 125.5 311.9 C124.5 314.1 121.7 322.4 120.3 324.1 C118.9 325.8 114.4 326.3 113.1 327.4 C111.8 328.5 109.8 333.1 109 334.1 C108.2 335.1 106.9 336.5 105.9 336.3 C104.9 336.1 100.8 333.0 99.7 331.9 C98.6 330.8 96.5 328.4 95.6 326.3 C94.7 324.2 92.2 316.1 91.4 313 C90.6 309.9 89.4 301.1 88.4 298.5 C87.4 295.9 83.4 291.5 82.2 289.6 C81.0 287.7 79.0 284.3 78 281.8 C77.0 279.3 74.0 270.4 72.9 267.4 C71.8 264.4 68.8 258.2 67.7 255.2 C66.6 252.2 63.6 244.0 62.6 240.7 C61.6 237.4 59.0 227.8 58.5 225.1 C58.0 222.4 58.6 218.7 58.5 216.2 C58.4 213.7 57.7 205.5 57.4 202.9 C57.1 200.3 55.3 194.8 55.4 192.9 C55.5 191.0 58.7 186.4 58.5 186.2 C58.3 186.0 54.9 189.8 53.3 190.7 C51.7 191.6 46.3 193.5 44 194 C41.7 194.5 34.9 195.8 32.7 195.1 C30.5 194.4 26.0 189.2 24.4 187.3 C22.8 185.4 18.0 180.0 18.2 178.4 C18.4 176.8 26.4 173.8 26.5 172.9 C26.6 172.0 21.0 171.7 19.3 170.7 C17.6 169.7 12.0 165.6 11 164 C10.0 162.4 9.0 156.9 10 156.2 C11.0 155.5 18.2 157.3 20.3 157.3 C22.4 157.3 27.1 157.3 28.6 156.2 C30.1 155.1 32.8 149.0 33.7 147.3 C34.6 145.6 37.5 142.5 36.8 140.6 C36.1 138.7 28.3 133.2 27.5 130.6 C26.7 128.0 28.3 118.8 29.6 117.3 C30.9 115.8 36.8 117.4 38.9 117.3 C41.0 117.2 45.9 117.6 48.1 116.2 C50.3 114.8 56.8 107.6 58.5 105.1 C60.2 102.6 62.3 95.8 63.6 93.9 C64.9 92.0 68.4 89.8 69.8 88.4 C71.2 87.0 75.7 83.6 76 81.7 C76.3 79.8 73.6 73.6 72.9 71.7 C72.2 69.8 69.9 66.7 69.8 65 C69.7 63.3 71.7 58.0 71.9 56.1 C72.1 54.2 71.0 49.9 71.9 48.3 C72.8 46.7 78.0 43.3 80.1 41.7 C82.2 40.1 88.1 35.0 90.4 33.9 C92.7 32.8 97.8 30.8 100.7 31.7 Z";
const ISLANDS = [
  "M88 328 C86 330 85 334 87 337 C89 339 91 338 91 335 C91 332 90 329 88 328 Z",
  "M187 326 C185 331 186 338 188 343 C190 347 193 351 195 350 C197 348 196 341 195 337 C194 332 191 327 187 326 Z",
  "M198 354 C197 357 198 361 200 363 C202 364 203 361 202 358 C202 355 200 353 198 354 Z",
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
          <path d={INDIA_OUTLINE} transform={`translate(${MAP_X} ${MAP_Y})`} />
        </clipPath>
      </defs>

      <g clipPath="url(#map-clip)">
        <rect width="490" height="380" fill="var(--surface-muted)" />
        <rect width="490" height="380" fill="url(#map-grid)" />
      </g>
      <path
        d={INDIA_OUTLINE}
        transform={`translate(${MAP_X} ${MAP_Y})`}
        fill="none"
        stroke="var(--border-strong)"
        strokeOpacity="0.75"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {ISLANDS.map((island) => (
        <path
          d={island}
          key={island}
          transform={`translate(${MAP_X} ${MAP_Y})`}
          fill="var(--surface-muted)"
          stroke="var(--border-strong)"
          strokeOpacity="0.75"
          strokeWidth="1"
        />
      ))}

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
            <circle
              cx={cx}
              cy={cy}
              r={tier2 ? r + 2 : r + 5}
              fill="none"
              stroke="var(--accent-ink)"
              strokeOpacity={tier2 ? 0.42 : 0.16}
              strokeWidth={tier2 ? 1 : 3}
              strokeDasharray={tier2 ? "2.5 2.5" : undefined}
            />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={tier2 ? "var(--surface-card)" : "var(--accent-ink)"}
              fillOpacity={tier2 ? 1 : 0.95}
              stroke="var(--surface-card)"
              strokeOpacity="0.9"
              strokeWidth={tier2 ? 1 : 1.5}
            />
            {!tier2 ? <circle cx={cx - r * 0.28} cy={cy - r * 0.28} r={Math.max(1.1, r * 0.18)} fill="var(--surface-card)" fillOpacity="0.72" /> : null}
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
