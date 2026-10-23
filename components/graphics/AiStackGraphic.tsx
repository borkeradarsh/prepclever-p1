// The production AI lifecycle sitting on enterprise infrastructure. Decorative:
// the adjacent copy carries the meaning.

const lifecycle = ["Research", "Prototype", "Train", "Deploy", "Monitor", "Govern"];

const plinth = [
  { label: "Petabyte-scale real-world data", fill: 0.9 },
  { label: "Enterprise cloud", fill: 0.62 },
  { label: "GPU clusters", fill: 0.34 },
];

const CX = 240;
const CY = 158;
const R = 104;

export function AiStackGraphic() {
  return (
    <svg
      className="graphic"
      viewBox="0 0 480 380"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker id="stack-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0 0.6 L5.4 3 L0 5.4 Z" fill="var(--accent-ink)" />
        </marker>
      </defs>

      <text x="22" y="26" className="graphic-label">THE FULL LIFECYCLE</text>

      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--border)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={R - 26} fill="var(--brand-soft)" fillOpacity="0.35" stroke="none" />

      {lifecycle.map((stage, index) => {
        const angle = (index / lifecycle.length) * Math.PI * 2 - Math.PI / 2;
        const next = ((index + 1) / lifecycle.length) * Math.PI * 2 - Math.PI / 2;
        const x = CX + Math.cos(angle) * R;
        const y = CY + Math.sin(angle) * R;
        const arcStart = angle + 0.3;
        const arcEnd = next - 0.3;
        return (
          <g key={stage}>
            <path
              d={`M${CX + Math.cos(arcStart) * R} ${CY + Math.sin(arcStart) * R} A${R} ${R} 0 0 1 ${
                CX + Math.cos(arcEnd) * R
              } ${CY + Math.sin(arcEnd) * R}`}
              fill="none"
              stroke="var(--accent-ink)"
              strokeOpacity="0.45"
              markerEnd="url(#stack-arrow)"
            />
            <circle cx={x} cy={y} r="31" fill="var(--surface-card)" stroke="var(--border-strong)" strokeOpacity="0.6" />
            <text x={x} y={y + 3} className="graphic-micro" textAnchor="middle">
              {stage}
            </text>
          </g>
        );
      })}

      <text x={CX} y={CY - 4} className="graphic-node" textAnchor="middle">Production</text>
      <text x={CX} y={CY + 13} className="graphic-node" textAnchor="middle">AI systems</text>

      {plinth.map((layer, index) => {
        const y = 288 + index * 30;
        const inset = index * 26;
        return (
          <g key={layer.label}>
            <rect
              x={54 + inset}
              y={y}
              width={372 - inset * 2}
              height="24"
              rx="3"
              fill="var(--text-primary)"
              fillOpacity={0.05 + layer.fill * 0.06}
              stroke="var(--border-strong)"
              strokeOpacity="0.45"
            />
            <text x={CX} y={y + 16} className="graphic-micro" textAnchor="middle">
              {layer.label}
            </text>
          </g>
        );
      })}
      <line
        x1={CX}
        y1="268"
        x2={CX}
        y2="284"
        stroke="var(--border-strong)"
        strokeOpacity="0.5"
        strokeDasharray="3 3"
      />
      <text x="22" y="278" className="graphic-label">RUNS ON</text>
    </svg>
  );
}
