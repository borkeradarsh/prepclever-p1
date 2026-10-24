import { describe, expect, it } from "vitest";
import { ROLE_IDS } from "@/components/auth/onboarding/types";
import { coreCount } from "@/content/concepts";
import { visibleRows, type PathRow } from "@/features/roadmap/LearningPathList";
import { learningOrder } from "@/lib/syllabus";

const rowsFor = (roleId: (typeof ROLE_IDS)[number]): PathRow[] =>
  learningOrder(roleId).map((concept) => ({
    id: concept.id,
    title: concept.title,
    href: `/x/${concept.id}`,
    domainTitle: concept.domain,
    core: concept.levels[roleId] === 2,
    levelLabel: "",
    ratingLabel: "",
    done: false,
  }));

describe("learning path Core only filter", () => {
  it.each(ROLE_IDS)("keeps learning order and matches the core count for %s", (roleId) => {
    const all = rowsFor(roleId);
    const core = visibleRows(all, true);
    expect(core).toHaveLength(coreCount(roleId));
    expect(core.map((row) => all.indexOf(row))).toEqual([...core.map((row) => all.indexOf(row))].sort((a, b) => a - b));
    expect(visibleRows(all, false)).toBe(all);
  });
});
