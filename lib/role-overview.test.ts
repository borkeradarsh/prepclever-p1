import { describe, expect, it } from "vitest";
import { concepts } from "@/content/concepts";
import { roles } from "@/content/roles.config";
import { roleOverviews } from "@/lib/role-overview";
import type { Rating } from "@/types/domain";

describe("roleOverviews", () => {
  it("lists every role once, the target first", () => {
    const overviews = roleOverviews(roles, "ai_backend", "switcher", {});
    expect(overviews).toHaveLength(roles.length);
    expect(overviews[0]).toMatchObject({ roleId: "ai_backend", isTarget: true });
    expect(overviews.filter((role) => role.isTarget)).toHaveLength(1);
  });

  it("derives fit from the track", () => {
    const fresher = roleOverviews(roles, "ml_engineer", "fresher", {});
    expect(fresher.find((role) => role.roleId === "ml_engineer")?.fit).toBe("on_track");
    expect(fresher.find((role) => role.roleId === "ai_architect")?.fit).toBe("adjacent_first");
    const senior = roleOverviews(roles, "ai_architect", "senior", {});
    expect(senior.every((role) => role.fit === "on_track")).toBe(true);
  });

  it("has no readiness without an audit, and full readiness with everything confident", () => {
    expect(roleOverviews(roles, "genai_llm", "mid", {}).every((role) => role.readiness === null)).toBe(true);
    const all = Object.fromEntries(concepts.map((concept) => [concept.id, "confident" as Rating]));
    expect(roleOverviews(roles, "genai_llm", "mid", all).every((role) => role.readiness === 1)).toBe(true);
  });

  it("scores each role against its own concepts only", () => {
    const onlyGenai = concepts.find((concept) => concept.levels.genai_llm === 2 && concept.levels.ai_data_engineer === 0)!;
    const overviews = roleOverviews(roles, "genai_llm", "mid", { [onlyGenai.id]: "confident" });
    expect(overviews.find((role) => role.roleId === "genai_llm")!.readiness).toBeGreaterThan(0);
    expect(overviews.find((role) => role.roleId === "ai_data_engineer")!.readiness).toBe(0);
  });
});
