// One glyph per blueprint block. Line art on a 48 x 48 grid, drawn in
// currentColor with a single accent element, so the six read as one set.
// Decorative: every glyph sits next to its own heading.

import type { ReactNode } from "react";

type GlyphProps = { block: string };

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const accent = { fill: "var(--brand)", stroke: "none" };
const accentLine = { fill: "none", stroke: "var(--brand)", strokeWidth: 2, strokeLinecap: "round" as const };

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      className="block-glyph"
      viewBox="0 0 48 48"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Radar sweep: scanning the market for the right target. */
function MarketGlyph() {
  return (
    <Glyph>
      <circle cx="24" cy="24" r="19" {...common} />
      <circle cx="24" cy="24" r="12.5" {...common} strokeOpacity="0.55" />
      <circle cx="24" cy="24" r="6" {...common} strokeOpacity="0.35" />
      <path d="M24 24 L24 5 A19 19 0 0 1 40.5 33.5 Z" fill="var(--brand)" fillOpacity="0.28" stroke="none" />
      <path d="M24 24 L40.5 33.5" {...common} />
      <circle cx="33" cy="17" r="3" {...accent} />
    </Glyph>
  );
}

/** Two columns with the shortfall measured between them. */
function GapGlyph() {
  return (
    <Glyph>
      <rect x="6" y="28" width="11" height="15" {...common} />
      <rect x="31" y="9" width="11" height="34" {...common} />
      <rect x="31" y="9" width="11" height="17" {...accent} fillOpacity="0.35" />
      <path d="M6 28 L31 28" {...common} strokeDasharray="2 3" strokeOpacity="0.7" />
      <path d="M24 26 L24 11" {...common} />
      <path d="M21 14 L24 10.5 L27 14" {...common} />
      <circle cx="24" cy="28" r="2" {...accent} />
    </Glyph>
  );
}

/** Blocks assembling into a shipped artefact. */
function BuildGlyph() {
  return (
    <Glyph>
      <path d="M24 5 L41 14 L41 34 L24 43 L7 34 L7 14 Z" {...common} />
      <path d="M24 5 L24 24 L7 14" {...common} strokeOpacity="0.5" />
      <path d="M24 24 L41 14" {...common} strokeOpacity="0.5" />
      <path d="M24 24 L24 43" {...common} strokeOpacity="0.5" />
      <path d="M24 24 L41 14 L41 34 L24 43 Z" {...accent} fillOpacity="0.26" />
      <circle cx="24" cy="24" r="2.4" {...accent} />
    </Glyph>
  );
}

/** A profile under a spotlight: the same work, made legible. */
function PositioningGlyph() {
  return (
    <Glyph>
      <rect x="11" y="6" width="26" height="36" rx="2.5" {...common} />
      <path d="M16 15 L26 15" {...common} />
      <rect x="16" y="21" width="16" height="3.4" {...accent} />
      <path d="M16 30 L32 30" {...common} strokeOpacity="0.5" />
      <path d="M16 35 L28 35" {...common} strokeOpacity="0.5" />
      <path d="M37 6 L44 13" {...common} strokeOpacity="0.6" />
      <path d="M40 4 L44 4 L44 8" {...common} strokeOpacity="0.6" />
    </Glyph>
  );
}

/** A warm path through the network, instead of the cold portal. */
function ReferralGlyph() {
  return (
    <Glyph>
      <circle cx="9" cy="36" r="4" {...common} />
      <circle cx="24" cy="12" r="4" {...common} />
      <circle cx="39" cy="24" r="4" {...common} />
      <circle cx="24" cy="38" r="4" {...common} strokeOpacity="0.5" />
      <path d="M12.3 33.4 L21 15" {...accentLine} />
      <path d="M27.4 13.6 L36 21.4" {...accentLine} />
      <path d="M13 36.6 L20 37.6" {...common} strokeDasharray="2 3" strokeOpacity="0.5" />
      <path d="M27.6 36.3 L35.6 26.9" {...common} strokeDasharray="2 3" strokeOpacity="0.5" />
    </Glyph>
  );
}

/** Two sides of the table, and a round cleared. */
function InterviewGlyph() {
  return (
    <Glyph>
      <path d="M5 10 h22 a2 2 0 0 1 2 2 v13 a2 2 0 0 1 -2 2 h-13 l-6 5 v-5 h-3 a2 2 0 0 1 -2 -2 v-13 a2 2 0 0 1 2 -2 z" {...common} />
      <path d="M11 17 h10 M11 21.5 h6" {...common} strokeOpacity="0.6" />
      <path d="M43 20 h-11 a2 2 0 0 0 -2 2 v10 a2 2 0 0 0 2 2 h7 l5 4 v-4 a2 2 0 0 0 2 -2 v-10 a2 2 0 0 0 -2 -2 z" {...common} strokeOpacity="0.55" />
      <circle cx="37" cy="27" r="5.5" {...accent} />
      <path d="M34.6 27 L36.4 28.8 L39.6 25.2" fill="none" stroke="var(--surface-card)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Glyph>
  );
}

const glyphs: Record<string, () => ReactNode> = {
  "market-intelligence": MarketGlyph,
  "gap-analysis": GapGlyph,
  upskilling: BuildGlyph,
  positioning: PositioningGlyph,
  referrals: ReferralGlyph,
  interview: InterviewGlyph,
};

export function BlockGlyph({ block }: GlyphProps) {
  const Component = glyphs[block] ?? MarketGlyph;
  return <Component />;
}
