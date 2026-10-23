// Vendor delivery chain versus direct GCC ownership. Decorative: the adjacent
// copy carries the meaning, so the SVG is hidden from assistive technology.

const layers = ["Global product owner", "Regional vendor lead", "Delivery manager", "You"];

export function OwnershipGraphic() {
  return (
    <svg
      className="graphic"
      viewBox="0 0 480 380"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker id="own-arrow" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
          <path d="M0 0.6 L5.4 3 L0 5.4 Z" fill="var(--border-strong)" />
        </marker>
        <marker id="own-arrow-brand" markerWidth="7" markerHeight="7" refX="5.4" refY="3" orient="auto">
          <path d="M0 0.6 L5.4 3 L0 5.4 Z" fill="var(--accent-ink)" />
        </marker>
      </defs>

      <line x1="240" y1="18" x2="240" y2="362" stroke="var(--border)" strokeDasharray="3 6" />

      {/* Vendor chain */}
      <text x="22" y="30" className="graphic-label">THE VENDOR CHAIN</text>
      {layers.map((layer, index) => {
        const y = 56 + index * 76;
        return (
          <g key={layer}>
            <rect
              x="22"
              y={y}
              width="178"
              height="48"
              rx="4"
              fill={index === 3 ? "var(--surface-muted)" : "none"}
              stroke="var(--border-strong)"
              strokeOpacity={index === 3 ? 1 : 0.5}
            />
            <text x="111" y={y + 28} className="graphic-node" textAnchor="middle">
              {layer}
            </text>
            {index < 3 ? (
              <line
                x1="111"
                y1={y + 48}
                x2="111"
                y2={y + 72}
                stroke="var(--border-strong)"
                strokeOpacity="0.55"
                strokeDasharray="4 4"
                markerEnd="url(#own-arrow)"
              />
            ) : null}
          </g>
        );
      })}
      <text x="111" y="364" className="graphic-foot" textAnchor="middle">
        Three handoffs from the decision
      </text>

      {/* Direct ownership */}
      <text x="280" y="30" className="graphic-label">DIRECT OWNERSHIP</text>
      <circle cx="364" cy="196" r="100" fill="none" stroke="var(--border)" strokeDasharray="2 7" />
      <circle cx="364" cy="196" r="64" fill="var(--brand-soft)" fillOpacity="0.5" stroke="none" />

      {[
        { label: "Global\nexecutives", x: 364, y: 78 },
        { label: "Product\narchitects", x: 446, y: 252 },
        { label: "Functional\nleads", x: 282, y: 252 },
      ].map((node) => (
        <g key={node.label}>
          <line
            x1={364 + (node.x - 364) * 0.34}
            y1={196 + (node.y - 196) * 0.34}
            x2={364 + (node.x - 364) * 0.72}
            y2={196 + (node.y - 196) * 0.72}
            stroke="var(--accent-ink)"
            strokeOpacity="0.5"
            markerEnd="url(#own-arrow-brand)"
          />
          <circle cx={node.x} cy={node.y} r="31" fill="var(--surface-card)" stroke="var(--border-strong)" strokeOpacity="0.55" />
          {node.label.split("\n").map((line, lineIndex) => (
            <text
              key={line}
              x={node.x}
              y={node.y - 2 + lineIndex * 12}
              className="graphic-micro"
              textAnchor="middle"
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      <circle cx="364" cy="196" r="40" fill="var(--text-primary)" />
      <text x="364" y="194" className="graphic-node-invert" textAnchor="middle">You</text>
      <text x="364" y="208" className="graphic-micro-invert" textAnchor="middle">own the product</text>
      <text x="364" y="364" className="graphic-foot" textAnchor="middle">
        No layer between you and the call
      </text>
    </svg>
  );
}
