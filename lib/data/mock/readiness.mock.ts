// PLACEHOLDER CONTENT — the profile-readiness checklist, keyed to the "Profile
// Prep: Resume, GitHub, LinkedIn, Interviews" segment of
// docs/research/gcc-ai-careers-india-research-base.md. These are the four items
// the build spec names; whether each is done is mock state.
// TODO(cms): real readiness tracking once profiles exist.

import type { ReadinessItem } from "@/types/domain";
import type { Scenario } from "@/lib/dev-flags";

const items: { id: string; label: string }[] = [
  { id: "resume", label: "Rewrite your resume for AI roles" },
  { id: "github", label: "Publish one project with a README" },
  { id: "linkedin", label: "Update your LinkedIn headline and skills" },
  { id: "city", label: "Pick your target GCC city" },
];

/** How many items are done per scenario, so the widget's states are reachable. */
const doneCountByScenario: Record<Scenario, number> = {
  "first-run": 0,
  "in-progress": 1,
  // All four done, which is the case where the widget hides itself.
  complete: items.length,
};

export function buildReadiness(scenario: Scenario): ReadinessItem[] {
  const doneCount = doneCountByScenario[scenario];
  return items.map((item, index) => ({ ...item, done: index < doneCount }));
}
