import { describe, expect, it } from "vitest";
import { concepts, domains } from "@/content/concepts";
import { ancestorsOf, layoutConceptMap, MAP_GEOMETRY, wrapTitle } from "@/lib/concept-map-layout";

const layout = layoutConceptMap(concepts, domains);
const byId = new Map(layout.nodes.map((node) => [node.id, node]));

describe("layoutConceptMap on the real concept map", () => {
  it("places every concept exactly once, in its domain's lane", () => {
    expect(layout.nodes).toHaveLength(concepts.length);
    for (const node of layout.nodes) {
      expect(domains[node.column].id).toBe(node.domain);
    }
  });

  it("puts every prerequisite at a smaller depth than what it unlocks", () => {
    for (const node of layout.nodes) {
      for (const pre of node.prerequisites) expect(byId.get(pre)!.depth).toBeLessThan(node.depth);
    }
  });

  it("orders each lane by depth, never stacking two nodes in one slot", () => {
    for (let column = 0; column < domains.length; column++) {
      const lane = layout.nodes.filter((node) => node.column === column).sort((a, b) => a.row - b.row);
      lane.forEach((node, index) => {
        expect(node.row).toBe(index);
        if (index > 0) expect(node.depth).toBeGreaterThanOrEqual(lane[index - 1].depth);
      });
    }
  });

  it("draws one edge per prerequisite, and keeps every node inside the canvas", () => {
    expect(layout.edges).toHaveLength(concepts.reduce((sum, concept) => sum + concept.prerequisites.length, 0));
    for (const node of layout.nodes) {
      expect(node.x + MAP_GEOMETRY.nodeWidth).toBeLessThanOrEqual(layout.width);
      expect(node.y + MAP_GEOMETRY.nodeHeight).toBeLessThanOrEqual(layout.height);
    }
  });

  it("records what each concept unlocks", () => {
    for (const node of layout.nodes) {
      for (const pre of node.prerequisites) expect(byId.get(pre)!.dependents).toContain(node.id);
    }
  });
});

describe("ancestorsOf", () => {
  it("follows prerequisites transitively", () => {
    const graph = new Map([
      ["c", { prerequisites: ["b"] }],
      ["b", { prerequisites: ["a"] }],
      ["a", { prerequisites: [] }],
    ]);
    expect([...ancestorsOf("c", graph)].sort()).toEqual(["a", "b"]);
    expect(ancestorsOf("a", graph).size).toBe(0);
  });
});

describe("wrapTitle", () => {
  it("keeps short titles on one line and wraps longer ones onto two", () => {
    expect(wrapTitle("Linear Algebra")).toEqual(["Linear Algebra"]);
    expect(wrapTitle("Retrieval-Augmented Generation (RAG)")).toHaveLength(2);
  });

  it("never returns more than two lines, marking the cut", () => {
    const lines = wrapTitle("one two three four five six seven eight nine ten eleven twelve", 10);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith("…")).toBe(true);
  });
});
