// The India GCC hiring map. See docs/india-map-spec.md.
//
// The outline is generated — see india-map.paths.ts for its source, licence and
// projection — and every mark is positioned by the same project() function, so
// dots and coastline cannot drift apart. All placement maths lives in
// india-map.layout.ts, which the tests exercise directly. Nothing in this file
// is hand-drawn, and nothing in it should be: section 2 of the spec requires
// the boundary to come from the documented source only.
//
// Two SVGs share one copy of the path data through <use>: a wide one with
// labelled columns, and a narrow one that drops the labels and numbers the dots
// instead, so the map can use the full card width on a phone. CSS shows exactly
// one of them, so only one is ever in the accessibility tree. The ranked list
// below is the text alternative at every width.

import type { growth } from "@/content/landing.config";
import { INDIA_LAND_PATH } from "./india-map.paths";
import { layoutCities, leaderPoints, NARROW, WIDE, type PlacedCity } from "./india-map.layout";

type MapData = typeof growth.map;

const LAND_ID = "india-land-path";

/**
 * The two layouts render the same 320-unit map box at very different sizes —
 * roughly 1100 px on a desktop card against 310 px on a phone — so a mark sized
 * in SVG units comes out twice as large on the desktop one. Everything drawn on
 * top of the land is therefore scaled per layout: dots and tooltips here, type
 * and stroke widths in the matching CSS.
 */
const WIDE_SCALE = 0.68;
const NARROW_SCALE = 1;

/**
 * Rough text width in SVG units, for sizing the tooltip box. Deliberately
 * generous: Cinetype plus an em dash runs wider than a naive average, and an
 * over-wide box is invisible where a too-narrow one clips the text.
 */
const textWidth = (text: string, size: number) => text.length * size * 0.6;

function Tooltip({ city, source, scale }: { city: PlacedCity; source: string; scale: number }) {
  const headline = city.tier2
    ? `${city.city} — tier 2`
    : `${city.city} — ${city.share}% of hiring`;
  const head = 9 * scale;
  const sub = 8 * scale;
  const width = Math.max(textWidth(headline, head), textWidth(source, sub)) + 20 * scale;
  const height = 30 * scale;
  // Clamped so a tooltip near the edge of the map does not fall outside it.
  const x = Math.min(Math.max(city.x - width / 2, 2), NARROW.width - width - 2);
  const y = city.y - city.r * scale - height - 6 * scale;

  return (
    <g className="map-tip" aria-hidden="true">
      <rect x={x} y={y} width={width} height={height} rx={3 * scale} />
      <text className="map-tip-head" x={x + 10 * scale} y={y + 13 * scale}>
        {headline}
      </text>
      <text className="map-tip-source" x={x + 10 * scale} y={y + 24 * scale}>
        {source}
      </text>
    </g>
  );
}

function Dot({ city, withRank, scale }: { city: PlacedCity; withRank: boolean; scale: number }) {
  return (
    <>
      <circle
        className={city.tier2 ? "map-dot map-dot-tier2" : "map-dot"}
        cx={city.x}
        cy={city.y}
        r={city.r * scale}
      />
      {withRank && city.rank !== null ? (
        <text className="map-dot-rank" x={city.x} y={city.y}>
          {city.rank}
        </text>
      ) : null}
    </>
  );
}

function cityLabel(city: PlacedCity) {
  return city.tier2
    ? `${city.city}, a tier-2 city. Tier-2 cities account for 15% of GCC hiring combined.`
    : `${city.city}, ${city.share}% of GCC hiring in the first half of 2026.`;
}

export function IndiaMapGraphic({ map }: { map: MapData }) {
  const cities = layoutCities(map.hotspots);
  // Painted north to south so a tooltip, which sits above its dot, is never
  // covered by a dot drawn later. SVG has no z-index.
  const northToSouth = [...cities].sort((a, b) => a.y - b.y);
  const ranked = [...cities]
    .filter((c) => !c.tier2)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const topShare = Math.max(...cities.map((c) => c.share));

  const cityGroups = (withRank: boolean, scale: number) =>
    northToSouth.map((city) => (
      <g className="map-city" key={city.city} tabIndex={0} role="img" aria-label={cityLabel(city)}>
        <Dot city={city} withRank={withRank} scale={scale} />
        <Tooltip city={city} source={map.tooltipSource} scale={scale} />
      </g>
    ));

  return (
    <div className="india-map-figure">
      {/* One copy of the path data, referenced by both layouts. */}
      <svg className="india-map-defs" aria-hidden="true" focusable="false">
        <defs>
          <path id={LAND_ID} d={INDIA_LAND_PATH} />
        </defs>
      </svg>

      {/* Wide: labelled columns either side of the map. */}
      <svg
        className="india-map india-map-wide"
        viewBox={`0 0 ${WIDE.width} ${WIDE.height}`}
        role="img"
        aria-labelledby="india-map-wide-title india-map-wide-desc"
      >
        <title id="india-map-wide-title">{map.alt.title}</title>
        <desc id="india-map-wide-desc">{map.alt.description}</desc>

        <g transform={`translate(${WIDE.mapX} ${WIDE.mapY})`}>
          <use href={`#${LAND_ID}`} className="map-land" />
        </g>

        {cities.map((city) => {
          const [x1, y1, x2, y2, x3, y3] = leaderPoints(city, WIDE_SCALE);
          const left = city.side === "left";
          const textX = left ? WIDE.leftText : WIDE.rightText;
          return (
            <g className="map-label" key={city.city}>
              <path className="map-leader" d={`M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}`} />
              <text
                className="map-city-name"
                x={textX}
                y={city.labelY}
                textAnchor={left ? "end" : "start"}
              >
                {city.city}
              </text>
              <text
                className="map-city-share"
                x={textX}
                y={city.labelY + 12}
                textAnchor={left ? "end" : "start"}
              >
                {city.tier2 ? "tier 2" : `${city.share}% of hiring`}
              </text>
            </g>
          );
        })}

        <g transform={`translate(${WIDE.mapX} ${WIDE.mapY})`}>{cityGroups(false, WIDE_SCALE)}</g>
      </svg>

      {/* Narrow: the map alone, dots numbered to match the list below. */}
      <svg
        className="india-map india-map-narrow"
        viewBox={`0 0 ${NARROW.width} ${NARROW.height}`}
        role="img"
        aria-labelledby="india-map-narrow-title india-map-narrow-desc"
      >
        <title id="india-map-narrow-title">{map.alt.title}</title>
        <desc id="india-map-narrow-desc">{map.alt.description}</desc>
        <use href={`#${LAND_ID}`} className="map-land" />
        {cityGroups(true, NARROW_SCALE)}
      </svg>

      {/* The text alternative: shown below the map at narrow widths, and kept
          for screen readers once the labelled columns carry the same figures. */}
      <ol className="map-rank-list">
        {ranked.map((city) => (
          <li key={city.city}>
            <span className="map-rank-number" aria-hidden="true">
              {city.rank}
            </span>
            <span className="map-rank-city">{city.city}</span>
            <span className="map-rank-bar" aria-hidden="true">
              <span style={{ width: `${(city.share / topShare) * 100}%` }} />
            </span>
            <span className="map-rank-share">
              {city.share}%{city.growth ? <em> {city.growth}</em> : null}
            </span>
          </li>
        ))}
        <li className="map-rank-tier2">
          <span className="map-rank-city">
            Tier 2 —{" "}
            {cities
              .filter((c) => c.tier2)
              .map((c) => c.city)
              .join(", ")}
          </span>
          <span className="map-rank-share">15% combined</span>
        </li>
      </ol>

      <p className="map-caption">{map.caption}</p>
    </div>
  );
}
