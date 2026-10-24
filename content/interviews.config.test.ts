import { describe, expect, it } from "vitest";
import { getBlockConfig } from "@/content/blocks.config";
import { companyProcesses, dosAndDonts, interviewMap } from "@/content/interviews.config";
import { itemBodyKeys } from "@/features/roadmap/item-bodies";
import { itemKey } from "@/lib/progress";

const STATUSES = ["core", "sometimes", "skipped"];

describe("interview map", () => {
  it("has one cell per round for every level, each with a valid status", () => {
    for (const level of interviewMap.levels) {
      expect(level.cells, level.id).toHaveLength(interviewMap.rounds.length);
      for (const cell of level.cells) {
        expect(STATUSES).toContain(cell.status);
        expect(cell.focus.length).toBeGreaterThan(0);
      }
    }
  });

  it("sources every figure", () => {
    for (const fact of interviewMap.facts) {
      expect(fact.sourceLabel, fact.value).toBeTruthy();
      expect(fact.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(fact.verified).toBe(false);
    }
    expect(interviewMap.source.sourceLabel).toBeTruthy();
  });
});

describe("company processes", () => {
  it("gives every company at least one stage, and a TL;DR line and table row each", () => {
    const ids = companyProcesses.companies.map((company) => company.id);
    for (const company of companyProcesses.companies) expect(company.stages.length, company.id).toBeGreaterThan(0);
    expect(companyProcesses.tldr.map((line) => line.companyId).sort()).toEqual([...ids].sort());
    expect(companyProcesses.comparison.rows.map((row) => row.companyId).sort()).toEqual([...ids].sort());
  });

  it("sources the pay figure and the company data, and keeps them unverified", () => {
    expect(companyProcesses.gcc.figure).toMatchObject({ sourceLabel: expect.any(String), verified: false });
    expect(companyProcesses.source.verified).toBe(false);
  });
});

describe("do's and don'ts", () => {
  it("has advice in every group", () => {
    for (const group of [...dosAndDonts.dos, ...dosAndDonts.donts]) expect(group.items.length, group.title).toBeGreaterThan(0);
  });
});

describe("Block 6", () => {
  it("is the owner's three pages, each with a body", () => {
    const items = getBlockConfig("interviews")!.items.map((item) => item.slug);
    expect(items).toEqual(["interview-process", "interview-companies", "dos-and-donts"]);
    for (const slug of items) expect(itemBodyKeys()).toContain(itemKey("interviews", slug));
  });
});
