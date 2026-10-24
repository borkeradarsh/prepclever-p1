// The concept map's graph layout, ported from docs/research/14-ai-roles-concept-map.html.
// One column (lane) per domain in map order; within a lane, concepts sit by
// prerequisite depth, then file order. Edges run from a prerequisite to what it
// unlocks: a curve across lanes, or a loop on the left within one lane.
// Pure, so the geometry is tested without a browser.

import type { Concept, Domain, DomainId } from "@/types/domain";

export const MAP_GEOMETRY = {
  nodeWidth: 136,
  nodeHeight: 48,
  columnWidth: 172,
  rowHeight: 60,
  pad: 20,
  header: 34,
} as const;

export type MapConcept = Pick<Concept, "id" | "title" | "domain" | "prerequisites" | "levels">;

export interface MapNode extends MapConcept {
  /** Longest prerequisite chain below this concept: 0 for a starting point. */
  depth: number;
  column: number;
  row: number;
  x: number;
  y: number;
  dependents: string[];
}

export interface MapEdge {
  from: string;
  to: string;
  path: string;
}

export interface MapLane {
  domain: Domain;
  x: number;
}

export interface MapLayout {
  nodes: MapNode[];
  edges: MapEdge[];
  lanes: MapLane[];
  width: number;
  height: number;
}

export function layoutConceptMap(concepts: MapConcept[], domains: Domain[]): MapLayout {
  const { nodeWidth: NW, nodeHeight: NH, columnWidth: COLW, rowHeight: ROWH, pad: PAD, header: HEAD } = MAP_GEOMETRY;
  const byId = new Map(concepts.map((concept) => [concept.id, concept]));
  const fileIndex = new Map(concepts.map((concept, index) => [concept.id, index]));

  const depths = new Map<string, number>();
  const depthOf = (id: string, trail: Set<string> = new Set()): number => {
    const known = depths.get(id);
    if (known !== undefined) return known;
    if (trail.has(id)) throw new Error(`Prerequisite cycle through ${id}`);
    trail.add(id);
    const prerequisites = (byId.get(id)?.prerequisites ?? []).filter((pre) => byId.has(pre));
    const depth = prerequisites.length === 0 ? 0 : 1 + Math.max(...prerequisites.map((pre) => depthOf(pre, trail)));
    trail.delete(id);
    depths.set(id, depth);
    return depth;
  };

  const dependents = new Map<string, string[]>(concepts.map((concept) => [concept.id, []]));
  for (const concept of concepts) {
    for (const pre of concept.prerequisites) dependents.get(pre)?.push(concept.id);
  }

  const columnOf = new Map<DomainId, number>(domains.map((domain, index) => [domain.id, index]));
  const nodes: MapNode[] = [];
  domains.forEach((domain, column) => {
    concepts
      .filter((concept) => concept.domain === domain.id)
      .sort((a, b) => depthOf(a.id) - depthOf(b.id) || fileIndex.get(a.id)! - fileIndex.get(b.id)!)
      .forEach((concept, row) => {
        nodes.push({
          ...concept,
          depth: depthOf(concept.id),
          column,
          row,
          x: PAD + 14 + column * COLW,
          y: PAD + HEAD + row * ROWH,
          dependents: dependents.get(concept.id) ?? [],
        });
      });
  });

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edges: MapEdge[] = [];
  for (const node of nodes) {
    for (const pre of node.prerequisites) {
      const source = nodeById.get(pre);
      if (!source) continue;
      let path: string;
      if (source.column === node.column) {
        const y1 = source.y + NH / 2;
        const y2 = node.y + NH / 2;
        const bend = 10 + Math.min(14, (node.row - source.row) * 3);
        path = `M${source.x},${y1} C${source.x - bend},${y1} ${node.x - bend},${y2} ${node.x},${y2}`;
      } else {
        const x1 = source.x + NW;
        const y1 = source.y + NH / 2;
        const x2 = node.x;
        const y2 = node.y + NH / 2;
        const c = Math.max(24, (x2 - x1) * 0.45);
        path = `M${x1},${y1} C${x1 + c},${y1} ${x2 - c},${y2} ${x2},${y2}`;
      }
      edges.push({ from: pre, to: node.id, path });
    }
  }

  const maxRows = Math.max(1, ...domains.map((domain) => nodes.filter((node) => node.column === columnOf.get(domain.id)).length));
  return {
    nodes,
    edges,
    lanes: domains.map((domain, column) => ({ domain, x: PAD + column * COLW })),
    width: PAD * 2 + (domains.length - 1) * COLW + NW + 28,
    height: PAD + HEAD + maxRows * ROWH + PAD - ROWH + NH + 14,
  };
}

/** Every concept a concept needs first, directly or through others. */
export function ancestorsOf(id: string, byId: Map<string, Pick<MapConcept, "prerequisites">>): Set<string> {
  const found = new Set<string>();
  const visit = (current: string) => {
    for (const pre of byId.get(current)?.prerequisites ?? []) {
      if (!found.has(pre)) {
        found.add(pre);
        visit(pre);
      }
    }
  };
  visit(id);
  return found;
}

/** A node label in at most two lines of about `max` characters. */
export function wrapTitle(title: string, max = 19): string[] {
  const lines = [""];
  for (const word of title.split(" ")) {
    const current = lines[lines.length - 1];
    if (!current) lines[lines.length - 1] = word;
    else if (`${current} ${word}`.length <= max) lines[lines.length - 1] = `${current} ${word}`;
    else lines.push(word);
  }
  if (lines.length <= 2) return lines;
  return [lines[0], `${lines.slice(1).join(" ").slice(0, max - 1)}…`];
}
