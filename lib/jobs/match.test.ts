import { describe, expect, it } from "vitest";
import { learningOrder } from "@/lib/syllabus";
import type { Rating } from "@/types/domain";
import { hasAudit, jobMatch } from "./match";

const order = learningOrder("genai_llm").map((concept) => concept.id);
// Three concepts genai_llm uses, in learning order, plus one it does not.
const [first, second, third] = order;
const unused = learningOrder("applied_scientist")
  .map((concept) => concept.id)
  .find((id) => !order.includes(id))!;

describe("jobMatch without an audit", () => {
  it("returns null so the UI can prompt for the audit", () => {
    expect(hasAudit({})).toBe(false);
    expect(jobMatch({ conceptIds: [first, second] }, {}, order)).toBeNull();
  });

  it("returns null for a job with no skills, even with an audit", () => {
    expect(jobMatch({ conceptIds: [] }, { [first]: "confident" }, order)).toBeNull();
  });
});

describe("jobMatch with an audit", () => {
  it("scores audit points over two per required concept, rounded", () => {
    const ratings: Record<string, Rating> = { [first]: "confident", [second]: "learning" };
    // (2 + 1 + 0) / 6 = 50%
    expect(jobMatch({ conceptIds: [first, second, third] }, ratings, order)).toMatchObject({
      percent: 50,
      confident: 1,
      required: 3,
    });
    // (1 + 0) / 4 = 25%; (2 + 2 + 1) / 6 = 83.3% rounds to 83
    expect(jobMatch({ conceptIds: [second, third] }, ratings, order)?.percent).toBe(25);
    expect(
      jobMatch({ conceptIds: [first, second, third] }, { [first]: "confident", [second]: "confident", [third]: "learning" }, order)
        ?.percent,
    ).toBe(83);
  });

  it("counts an unrated required concept as not started", () => {
    expect(jobMatch({ conceptIds: [third] }, { [first]: "confident" }, order)).toMatchObject({ percent: 0, confident: 0 });
  });

  it("is 100% with every required concept confident, and has no gaps", () => {
    const ratings: Record<string, Rating> = { [first]: "confident", [second]: "confident" };
    expect(jobMatch({ conceptIds: [first, second] }, ratings, order)).toMatchObject({ percent: 100, gaps: [] });
  });

  it("lists gaps in the role's learning order, whatever order the job lists them in", () => {
    const match = jobMatch({ conceptIds: [third, first, second] }, { [second]: "confident" }, order);
    expect(match?.gaps.map((gap) => gap.id)).toEqual([first, third]);
    expect(match?.gaps[0]).toMatchObject({ title: expect.any(String), domain: expect.any(String) });
  });

  it("leaves concepts the role does not use out of the gaps, but still scores them", () => {
    const match = jobMatch({ conceptIds: [first, unused] }, { [first]: "confident" }, order);
    expect(match?.gaps).toEqual([]);
    expect(match?.percent).toBe(50);
  });

  it("counts a concept listed twice once", () => {
    expect(jobMatch({ conceptIds: [first, first] }, { [first]: "learning" }, order)).toMatchObject({ required: 1, percent: 50 });
  });
});
