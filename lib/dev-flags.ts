// Dev-only switches that let the four acceptance scenarios and the widget
// loading/error states be seen without a database.
//
// Session 1 has no writer for this cookie (the middleware that would capture
// ?scenario=&plan=&fail=&slow= is deferred), so set `prepclever-dev` by hand in
// devtools: document.cookie = "prepclever-dev=scenario:complete|plan:pro".
// TODO(dev-toolbar): add the middleware capture and the on-screen toolbar.

import type { Plan } from "@/types/domain";

export const DEV_COOKIE = "prepclever-dev";

export type Scenario = "first-run" | "in-progress" | "complete";
export type WidgetKey =
  | "continue"
  | "journey"
  | "goal"
  | "pulse"
  | "readiness"
  | "user"
  | "syllabus"
  | "concept"
  | "gap"
  | "jobs"
  | "home"
  | "roles";

export interface DevFlags {
  scenario: Scenario;
  plan: Plan;
  fail: WidgetKey[];
  slow: boolean;
}

const SCENARIOS: Scenario[] = ["first-run", "in-progress", "complete"];
const PLANS: Plan[] = ["free", "pro"];
const WIDGETS: WidgetKey[] = [
  "continue",
  "journey",
  "goal",
  "pulse",
  "readiness",
  "user",
  "syllabus",
  "concept",
  "gap",
  "jobs",
  "home",
  "roles",
];

export const devToolsEnabled = process.env.NODE_ENV !== "production";

export function defaultDevFlags(): DevFlags {
  return { scenario: "in-progress", plan: "free", fail: [], slow: false };
}

/**
 * Parses the cookie form `scenario:complete|plan:pro|fail:goal,pulse|slow:1`.
 * Unknown keys and values are ignored rather than throwing, and production
 * always gets the defaults so a stray cookie can never change behaviour there.
 */
export function parseDevFlags(raw: string | null | undefined): DevFlags {
  const flags = defaultDevFlags();
  // Read NODE_ENV at call time, so the gate is testable and cannot be baked in.
  if (process.env.NODE_ENV === "production" || !raw) return flags;

  for (const part of raw.split("|")) {
    const [key, value = ""] = part.split(":");
    if (key === "scenario" && isScenario(value)) flags.scenario = value;
    if (key === "plan" && isPlan(value)) flags.plan = value;
    if (key === "slow") flags.slow = value === "1" || value === "true";
    if (key === "fail") flags.fail = value.split(",").filter(isWidgetKey);
  }

  return flags;
}

export function serializeDevFlags(patch: Partial<DevFlags>): string {
  const flags = { ...defaultDevFlags(), ...patch };
  return [
    `scenario:${flags.scenario}`,
    `plan:${flags.plan}`,
    `fail:${flags.fail.join(",")}`,
    `slow:${flags.slow ? "1" : "0"}`,
  ].join("|");
}

/** Reads the same flags from a query string, for the deferred middleware. */
export function devFlagsFromSearchParams(params: URLSearchParams): Partial<DevFlags> {
  const patch: Partial<DevFlags> = {};
  const scenario = params.get("scenario");
  const plan = params.get("plan");
  const fail = params.get("fail");
  const slow = params.get("slow");

  if (isScenario(scenario)) patch.scenario = scenario;
  if (isPlan(plan)) patch.plan = plan;
  if (fail !== null) patch.fail = fail.split(",").filter(isWidgetKey);
  if (slow !== null) patch.slow = slow === "1" || slow === "true";

  return patch;
}

function isScenario(value: string | null): value is Scenario {
  return value !== null && (SCENARIOS as string[]).includes(value);
}

function isPlan(value: string | null): value is Plan {
  return value !== null && (PLANS as string[]).includes(value);
}

function isWidgetKey(value: string): value is WidgetKey {
  return (WIDGETS as string[]).includes(value);
}
