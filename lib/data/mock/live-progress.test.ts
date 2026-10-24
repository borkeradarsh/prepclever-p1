// With no dev cookie (and always in production) progress is the user's own:
// nothing is seeded, every bar starts at zero, and only real actions move it.

import { beforeEach, describe, expect, it, vi } from "vitest";

const jar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => void jar.set(name, value),
  }),
}));

vi.mock("@/lib/data/mock/store", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/data/mock/store")>()),
  latency: async () => {},
}));

const data = await import("@/lib/data/mock");
const { defaultDevFlags } = await import("@/lib/dev-flags");

describe("live progress", () => {
  beforeEach(() => jar.clear());

  it("is the default scenario", () => {
    expect(defaultDevFlags().scenario).toBe("live");
  });

  it("starts empty: no done steps, no ratings, no streak", async () => {
    expect(await data.getProgress()).toMatchObject({
      doneItems: [],
      auditRatings: {},
      completedLessonIds: [],
      checklistDone: [],
      lastItem: null,
      streakDays: 0,
      sessionsThisWeek: 0,
    });
  });

  it("shows every bar at zero before the user does anything", async () => {
    const [summary, blocks, report, roles] = await Promise.all([
      data.getHomeSummary(),
      data.getBlocks(),
      data.getGapReport(),
      data.getRoleOverviews(),
    ]);
    expect(summary).toMatchObject({ lastStudied: null, readiness: null, roadmap: { done: 0 } });
    expect(blocks.every((block) => block.progress.done === 0)).toBe(true);
    expect(report).toMatchObject({ readiness: 0, ratedCount: 0 });
    expect(roles.every((role) => role.readiness === null)).toBe(true);
  });

  it("moves only when the user acts", async () => {
    await data.markItemDone("market/landscape");
    const summary = await data.getHomeSummary();
    expect(summary.roadmap.done).toBe(1);
    expect(summary.lastStudied?.title).toBe("The GCC landscape");

    const [first] = (await data.getRoleSyllabus()).order;
    await data.setRating(first, "confident");
    expect((await data.getGapReport()).ratedCount).toBe(1);
  });

  it("ignores progress recorded under a demo scenario", async () => {
    jar.set("prepclever-dev", "scenario:in-progress");
    await data.markItemDone("market/target-companies");
    expect((await data.getProgress()).doneItems.length).toBeGreaterThan(1);

    jar.delete("prepclever-dev");
    expect((await data.getProgress()).doneItems).toEqual([]);
  });
});
