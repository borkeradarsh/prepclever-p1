// Relative total-reward bands. Deliberately unnumbered: we have no salary
// survey to cite, so the graphic shows shape, not figures. Decorative.

const bands = [
  { label: "Services grade", start: 92, end: 236, quartile: null },
  { label: "Domestic product", start: 92, end: 322, quartile: null },
  { label: "India GCC", start: 92, end: 430, quartile: 338 },
];

export function RewardsGraphic() {
  return (
    <svg
      className="graphic"
      viewBox="0 0 480 380"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <text x="22" y="30" className="graphic-label">RELATIVE TOTAL REWARD BAND</text>

      {[92, 176, 260, 344, 430].map((x) => (
        <line key={x} x1={x} y1="56" x2={x} y2="282" stroke="var(--border)" strokeDasharray="2 6" />
      ))}

      {bands.map((band, index) => {
        const y = 92 + index * 72;
        const isGcc = index === 2;
        return (
          <g key={band.label}>
            <text x="22" y={y - 14} className="graphic-micro">{band.label}</text>
            <rect
              x={band.start}
              y={y}
              width={band.end - band.start}
              height="30"
              rx="3"
              fill={isGcc ? "var(--brand-soft)" : "var(--surface-muted)"}
              stroke={isGcc ? "var(--accent-ink)" : "var(--border-strong)"}
              strokeOpacity={isGcc ? 0.65 : 0.4}
            />
            {band.quartile ? (
              <>
                <rect
                  x={band.quartile}
                  y={y}
                  width={band.end - band.quartile}
                  height="30"
                  rx="3"
                  fill="var(--accent-ink)"
                  fillOpacity="0.85"
                />
                <text x={(band.quartile + band.end) / 2} y={y + 20} className="graphic-micro-invert" textAnchor="middle">
                  top quartile
                </text>
              </>
            ) : null}
            {/* End tick: where this band tops out against the benchmark. */}
            <line
              x1={band.end}
              y1={y - 5}
              x2={band.end}
              y2={y + 35}
              stroke={isGcc ? "var(--accent-ink)" : "var(--border-strong)"}
              strokeOpacity={isGcc ? 0.85 : 0.5}
            />
          </g>
        );
      })}

      {/* The benchmark the GCC band is measured against. */}
      <line x1="430" y1="48" x2="430" y2="296" stroke="var(--accent-ink)" strokeOpacity="0.45" strokeDasharray="3 4" />

      <line x1="92" y1="296" x2="430" y2="296" stroke="var(--border-strong)" strokeOpacity="0.5" />
      <text x="92" y="314" className="graphic-micro">Local grid</text>
      <text x="430" y="314" className="graphic-micro" textAnchor="end">Global benchmark</text>
      <text x="22" y="350" className="graphic-foot">
        Illustrative shape of the bands, not a salary survey.
      </text>
    </svg>
  );
}
