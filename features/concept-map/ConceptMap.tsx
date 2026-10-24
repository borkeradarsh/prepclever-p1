"use client";

// The concept map, ported from docs/research/14-ai-roles-concept-map.html:
// a graph of domain lanes with prerequisite arrows, and the role matrix as
// the same data in a table. Every concept opens its concept page. The graph's
// nodes are real links, so Tab and Enter work; the matrix is the accessible
// alternative for anyone who cannot use the graph.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type MouseEvent } from "react";
import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { textLink } from "@/components/ui/link-styles";
import { mapCopy } from "@/content/roadmap.config";
import { ancestorsOf, layoutConceptMap, MAP_GEOMETRY, wrapTitle, type MapConcept } from "@/lib/concept-map-layout";
import { routes } from "@/lib/routes";
import type { Domain, Level, RoleId } from "@/types/domain";

type ConceptMapProps = {
  concepts: MapConcept[];
  domains: Domain[];
  roles: { id: RoleId; title: string }[];
  /** The user's own role: the map opens on it. */
  initialRole: RoleId;
  /** Concepts the user rated confident in the audit. */
  confident: string[];
};

type RoleChoice = RoleId | "all";
type View = "graph" | "matrix";

const { nodeWidth: NW, nodeHeight: NH } = MAP_GEOMETRY;
const ZOOMS = [0.6, 0.8, 1, 1.25, 1.5];

const toggleButton =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-soft-sm)] px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium transition-colors duration-150 ease-out motion-reduce:transition-none";
const iconButton =
  "inline-flex size-11 items-center justify-center rounded-[var(--radius-soft-sm)] border border-border-soft bg-surface-card text-text-primary transition-colors duration-150 ease-out hover:border-border-strong disabled:opacity-50 motion-reduce:transition-none";

/** Box styles per relevance for the chosen role; "all" shows every role as dots instead. */
const boxClass: Record<Level | "all", string> = {
  2: "fill-[var(--brand-soft)] stroke-[var(--brand)]",
  1: "fill-[var(--surface-card)] stroke-[var(--brand)] [stroke-dasharray:4_3]",
  0: "fill-[var(--surface-muted)] stroke-[var(--border-soft-strong)]",
  all: "fill-[var(--surface-card)] stroke-[var(--border)]",
};

function Dot({ level, label }: { level: Level; label: string }) {
  return (
    <span className="inline-flex items-center justify-center" title={label}>
      <span
        aria-hidden="true"
        className={`inline-block rounded-[var(--radius-pill)] ${level === 2 ? "size-3 bg-brand" : level === 1 ? "size-3 border-2 border-brand" : "size-1.5 bg-border-soft-strong"}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function ConceptMap({ concepts, domains, roles, initialRole, confident }: ConceptMapProps) {
  const router = useRouter();
  const [role, setRole] = useState<RoleChoice>(initialRole);
  const [view, setView] = useState<View>("graph");
  const [focus, setFocus] = useState<string | null>(null);
  const [zoom, setZoom] = useState(2);

  const layout = useMemo(() => layoutConceptMap(concepts, domains), [concepts, domains]);
  const byId = useMemo(() => new Map(layout.nodes.map((node) => [node.id, node])), [layout]);
  const confidentSet = useMemo(() => new Set(confident), [confident]);
  const domainTitle = useMemo(() => new Map(domains.map((domain) => [domain.id, domain.title])), [domains]);
  const roleTitle = (id: RoleChoice) => (id === "all" ? mapCopy.allRoles : roles.find((entry) => entry.id === id)?.title ?? id);

  const levelFor = (id: string): Level | "all" => (role === "all" ? "all" : (byId.get(id)?.levels[role] ?? 0));

  // Hover or focus traces what a concept needs (ancestors) and what it unlocks.
  const related = useMemo(() => {
    if (!focus) return null;
    const ancestors = ancestorsOf(focus, byId);
    return { ancestors, all: new Set([focus, ...ancestors, ...(byId.get(focus)?.dependents ?? [])]) };
  }, [focus, byId]);

  const hrefFor = (id: string) => {
    const node = byId.get(id);
    return node ? routes.concept(node.domain, node.id) : routes.conceptMap;
  };

  // SVG links: client navigation, but keep new-tab and modifier clicks native.
  const navigate = (event: MouseEvent<Element>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    router.push(hrefFor(id));
  };

  const scale = ZOOMS[zoom];
  const focused = focus ? byId.get(focus) : null;

  return (
    // minmax(0, 1fr): the graph and the matrix scroll inside their own boxes, never the page.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-[var(--space-md)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <div role="group" aria-label={mapCopy.viewsLabel} className="inline-flex gap-px rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-muted p-0.5">
          {(["graph", "matrix"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={`${toggleButton} ${view === option ? "bg-surface-card text-text-primary shadow-soft" : "text-text-subtle hover:text-text-primary"}`}
            >
              {option === "graph" ? mapCopy.graph : mapCopy.matrix}
            </button>
          ))}
        </div>
        {view === "graph" ? (
          <div className="flex gap-[var(--space-xs)]">
            <button type="button" aria-label={mapCopy.zoomOut} title={mapCopy.zoomOut} disabled={zoom === 0} onClick={() => setZoom((value) => Math.max(0, value - 1))} className={iconButton}>
              <Minus size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <button type="button" aria-label={mapCopy.zoomReset} title={mapCopy.zoomReset} onClick={() => setZoom(2)} className={iconButton}>
              <RotateCcw size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <button type="button" aria-label={mapCopy.zoomIn} title={mapCopy.zoomIn} disabled={zoom === ZOOMS.length - 1} onClick={() => setZoom((value) => Math.min(ZOOMS.length - 1, value + 1))} className={iconButton}>
              <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="grid gap-[var(--space-xs)]">
        <p id="map-roles-label" className="text-[length:var(--font-size-small)] text-text-subtle">
          {mapCopy.rolesLabel}
        </p>
        <div role="group" aria-labelledby="map-roles-label" className="flex flex-wrap gap-[var(--space-xs)]">
          {(["all", ...roles.map((entry) => entry.id)] as RoleChoice[]).map((option) => (
            <Chip key={option} as="button" selected={role === option} onClick={() => setRole(option)}>
              {roleTitle(option)}
              {option === initialRole ? <span className="text-text-subtle">· {mapCopy.yourRole}</span> : null}
            </Chip>
          ))}
        </div>
      </div>

      {view === "graph" ? (
        <>
          <div
            role="group"
            aria-label={mapCopy.graphLabel}
            className="max-h-[70dvh] overflow-auto overscroll-contain rounded-[var(--radius-soft-lg)] border border-border-soft bg-background"
          >
            <svg
              width={layout.width * scale}
              height={layout.height * scale}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="block"
              onMouseLeave={() => setFocus(null)}
            >
              <defs>
                <marker id="map-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" className="fill-[var(--border-strong)]" />
                </marker>
              </defs>

              {layout.lanes.map((lane) => (
                <g key={lane.domain.id} aria-hidden="true">
                  <rect
                    x={lane.x}
                    y={MAP_GEOMETRY.pad}
                    width={NW + 28}
                    height={layout.height - MAP_GEOMETRY.pad * 2 + 6}
                    rx={10}
                    className="fill-[var(--surface-muted)] opacity-60"
                  />
                  <text x={lane.x + 14} y={MAP_GEOMETRY.pad + 20} className="fill-[var(--text-muted)] text-[length:var(--font-size-small)] font-medium">
                    {lane.domain.title}
                  </text>
                </g>
              ))}

              <g aria-hidden="true">
                {layout.edges.map((edge) => {
                  let tone = "stroke-[var(--border-soft-strong)] opacity-70";
                  if (related) {
                    if (related.ancestors.has(edge.from) && (edge.to === focus || related.ancestors.has(edge.to))) tone = "stroke-[var(--accent-ink)] [stroke-width:2]";
                    else if (edge.from === focus) tone = "stroke-[var(--focus)] [stroke-width:2]";
                    else tone = "stroke-[var(--border-soft)] opacity-40";
                  } else if (role !== "all") {
                    const on = levelFor(edge.from) !== 0 && levelFor(edge.to) !== 0;
                    tone = on ? "stroke-[var(--border-strong)] opacity-70" : "stroke-[var(--border-soft)] opacity-40";
                  }
                  return <path key={`${edge.from}-${edge.to}`} d={edge.path} fill="none" markerEnd="url(#map-arrow)" className={tone} />;
                })}
              </g>

              {layout.nodes.map((node) => {
                const level = levelFor(node.id);
                const dim = related ? !related.all.has(node.id) : false;
                const lines = wrapTitle(node.title);
                const isConfident = confidentSet.has(node.id);
                const label = [
                  node.title,
                  level === "all" ? null : mapCopy.levels[level],
                  isConfident ? mapCopy.legendConfident : null,
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <a
                    key={node.id}
                    href={hrefFor(node.id)}
                    aria-label={label}
                    onClick={(event) => navigate(event, node.id)}
                    onMouseEnter={() => setFocus(node.id)}
                    onFocus={() => setFocus(node.id)}
                    onBlur={() => setFocus((current) => (current === node.id ? null : current))}
                    className={`group cursor-pointer outline-none transition-opacity duration-150 motion-reduce:transition-none ${dim ? "opacity-30" : level === 0 ? "opacity-70" : ""}`}
                  >
                    <g transform={`translate(${node.x},${node.y})`}>
                      <rect x={-3} y={-3} width={NW + 6} height={NH + 6} rx={9} className="fill-none stroke-transparent [stroke-width:2] group-focus-visible:stroke-[var(--focus)]" />
                      <rect width={NW} height={NH} rx={7} className={`${boxClass[level]} [stroke-width:1.25] ${focus === node.id ? "stroke-[var(--focus)] [stroke-width:2]" : ""}`} />
                      {lines.map((line, index) => (
                        <text
                          key={line}
                          x={NW / 2}
                          y={(lines.length === 1 ? (role === "all" ? 21 : 28) : role === "all" ? 15 : 21) + index * 13}
                          textAnchor="middle"
                          className={`text-[length:var(--font-size-small)] ${level === 0 ? "fill-[var(--text-subtle)]" : "fill-[var(--text-primary)]"}`}
                        >
                          {line}
                        </text>
                      ))}
                      {role === "all"
                        ? roles.map((entry, index) => {
                            const value = node.levels[entry.id];
                            return (
                              <circle
                                key={entry.id}
                                cx={NW / 2 - 24 + index * 8}
                                cy={NH - 8}
                                r={value === 0 ? 1.4 : 2.4}
                                className={value === 2 ? "fill-[var(--brand)]" : value === 1 ? "fill-none stroke-[var(--brand)]" : "fill-[var(--border-soft-strong)]"}
                              />
                            );
                          })
                        : null}
                      {isConfident ? (
                        <g transform={`translate(${NW - 2},2)`}>
                          <circle r={7} className="fill-[var(--accent-ink)]" />
                          <path d="M-3,0 L-1,2.2 L3,-2.4" fill="none" className="stroke-[var(--button-primary-text)] [stroke-width:1.6]" />
                        </g>
                      ) : null}
                    </g>
                  </a>
                );
              })}
            </svg>
          </div>

          {/* What the traced concept is: visible detail for the hovered or focused node. */}
          <div className="grid min-h-[4.5rem] content-center gap-[var(--space-xs)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-sm)] text-[length:var(--font-size-small)]">
            {focused ? (
              <>
                <p className="flex flex-wrap items-center gap-x-[var(--space-sm)] text-text-primary">
                  <span className="font-medium">{focused.title}</span>
                  <span className="text-text-subtle">
                    {domainTitle.get(focused.domain)}
                    {role === "all" ? "" : ` · ${mapCopy.levelFor(mapCopy.levels[focused.levels[role]], roleTitle(role))}`}
                  </span>
                </p>
                <p className="text-text-subtle">
                  {mapCopy.needs(focused.prerequisites.length)} · {mapCopy.unlocks(focused.dependents.length)}
                </p>
              </>
            ) : (
              <p className="text-text-subtle">{mapCopy.focusHint}</p>
            )}
          </div>

          <ul className="flex flex-wrap gap-x-[var(--space-md)] gap-y-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-subtle" aria-label={mapCopy.legend}>
            {role === "all" ? (
              <>
                <li className="flex items-center gap-[var(--space-xs)]"><Dot level={2} label="" />{mapCopy.levels[2]}</li>
                <li className="flex items-center gap-[var(--space-xs)]"><Dot level={1} label="" />{mapCopy.levels[1]}</li>
                <li>{mapCopy.dotsNote}</li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-[var(--space-xs)]"><span aria-hidden="true" className="inline-block h-3 w-5 rounded-[var(--radius-soft-sm)] border border-brand bg-brand-soft" />{mapCopy.levels[2]}</li>
                <li className="flex items-center gap-[var(--space-xs)]"><span aria-hidden="true" className="inline-block h-3 w-5 rounded-[var(--radius-soft-sm)] border border-dashed border-brand bg-surface-card" />{mapCopy.levels[1]}</li>
                <li className="flex items-center gap-[var(--space-xs)]"><span aria-hidden="true" className="inline-block h-3 w-5 rounded-[var(--radius-soft-sm)] border border-border-soft-strong bg-surface-muted" />{mapCopy.levels[0]}</li>
              </>
            )}
            <li className="flex items-center gap-[var(--space-xs)]">
              <span aria-hidden="true" className="grid size-3.5 place-items-center rounded-[var(--radius-pill)] bg-accent-ink text-button-primary-text"><Check size={10} strokeWidth={3} /></span>
              {mapCopy.legendConfident}
            </li>
          </ul>
        </>
      ) : (
        // relative: the cells' screen-reader labels are absolutely positioned and
        // would otherwise escape this scroll box and widen the page.
        <div className="relative overflow-x-auto rounded-[var(--radius-soft-lg)] border border-border-soft">
          <table className="w-full min-w-[44rem] border-collapse text-[length:var(--font-size-small)]">
            <caption className="p-[var(--space-sm)] text-left text-text-subtle">{mapCopy.matrixCaption}</caption>
            <thead>
              <tr className="border-b border-border-soft">
                <th scope="col" className="p-[var(--space-xs)] pl-[var(--space-sm)] text-left font-medium text-text-primary">{mapCopy.concept}</th>
                {roles.map((entry) => (
                  <th key={entry.id} scope="col" className={`p-[var(--space-xs)] text-center align-bottom font-medium text-text-primary ${role === entry.id ? "bg-brand-soft/50" : ""}`}>
                    {entry.title}
                  </th>
                ))}
              </tr>
            </thead>
            {domains.map((domain) => {
              const rows = layout.nodes.filter((node) => node.domain === domain.id);
              return (
                <tbody key={domain.id}>
                  <tr className="bg-surface-muted">
                    <th scope="colgroup" colSpan={roles.length + 1} className="p-[var(--space-xs)] pl-[var(--space-sm)] text-left font-medium text-text-muted">
                      {domain.title}
                    </th>
                  </tr>
                  {rows.map((node) => (
                    <tr key={node.id} className="border-b border-border-soft">
                      <th scope="row" className="p-0 text-left font-normal">
                        <Link href={hrefFor(node.id)} className={`${textLink} flex min-h-11 items-center gap-[var(--space-xs)] px-[var(--space-sm)]`}>
                          {node.title}
                          {confidentSet.has(node.id) ? (
                            <>
                              <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                              <span className="sr-only">, {mapCopy.legendConfident}</span>
                            </>
                          ) : null}
                        </Link>
                      </th>
                      {roles.map((entry) => (
                        <td key={entry.id} className={`p-[var(--space-xs)] text-center ${role === entry.id ? "bg-brand-soft/50" : ""}`}>
                          <Dot level={node.levels[entry.id]} label={mapCopy.levels[node.levels[entry.id]]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              );
            })}
            <tfoot>
              <tr>
                <th scope="row" className="p-[var(--space-xs)] pl-[var(--space-sm)] text-left font-medium text-text-primary">{mapCopy.totals}</th>
                {roles.map((entry) => (
                  <td key={entry.id} className={`p-[var(--space-xs)] text-center text-text-primary ${role === entry.id ? "bg-brand-soft/50" : ""}`}>
                    {layout.nodes.filter((node) => node.levels[entry.id] === 2).length} / {layout.nodes.filter((node) => node.levels[entry.id] === 1).length}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
