import { describe, expect, it } from "vitest";
import { plans, showPrices } from "@/content/plans.config";
import { allLessons } from "@/lib/data/mock/lessons.mock";

const feature = (planId: string, label: string) =>
  plans.find((plan) => plan.id === planId)?.features.find((item) => item.label === label);

describe("plans", () => {
  it("has Free, Pro and Teams, each including the one before", () => {
    expect(plans.map((plan) => [plan.id, plan.includes])).toEqual([
      ["free", null],
      ["pro", "free"],
      ["teams", "pro"],
    ]);
  });

  it("gives every feature a status", () => {
    for (const plan of plans) {
      for (const item of plan.features) expect(["available", "coming_soon"]).toContain(item.status);
    }
  });

  it("keeps the research price ranges hidden until prices are final", () => {
    expect(showPrices).toBe(false);
    expect(plans.find((plan) => plan.id === "pro")?.priceRange).toMatchObject({ min: 12, max: 29 });
    expect(plans.find((plan) => plan.id === "teams")?.priceRange).toMatchObject({ min: 19, max: 49 });
  });

  it("only claims quizzes once quiz lessons exist", () => {
    const hasQuiz = allLessons.some((lesson) => lesson.type === "quiz");
    expect(feature("pro", "Interactive quizzes and checkpoints")?.status).toBe(hasQuiz ? "available" : "coming_soon");
  });

  it("only claims project specs while project lessons exist", () => {
    const hasProject = allLessons.some((lesson) => lesson.type === "project");
    expect(feature("pro", "Production-grade project specs and solutions")?.status).toBe(
      hasProject ? "available" : "coming_soon",
    );
  });

  it("makes Teams contact-only", () => {
    expect(plans.find((plan) => plan.id === "teams")?.contactOnly).toBe(true);
  });
});
