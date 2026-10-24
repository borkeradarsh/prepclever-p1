// Billing stub (docs/dashboard-v2-spec.md section 7). No payment exists yet.
//
// Development: upgrading sets the mock plan to Pro and returns the user to
// where they came from. Production: there is nothing to buy, so the caller
// shows a "Pro is opening soon" state and we record the interest.
// TODO(payments): replace the production branch with a real checkout.

import { redirect } from "next/navigation";
import { setPlan } from "@/lib/data";
import { track } from "@/lib/analytics";
import { safeReturnTo } from "@/lib/return-to";

/** Every place an upgrade can start from; each one passes its own `from`. */
export type UpgradeSource = "locked-page" | "sidebar" | "continue-card" | "gap-report" | "nav" | "profile";

const UPGRADE_SOURCES: UpgradeSource[] = ["locked-page", "sidebar", "continue-card", "gap-report", "nav", "profile"];

/** `?from=` as it arrives; anything unknown is counted as the nav button. */
export function parseUpgradeSource(value: unknown): UpgradeSource {
  return (UPGRADE_SOURCES as unknown[]).includes(value) ? (value as UpgradeSource) : "nav";
}

export type BillingMode = "mock" | "none";

export type UpgradeDecision =
  | { status: "upgraded"; returnTo: string }
  | { status: "opening_soon"; returnTo: string };

export function billingMode(nodeEnv: string | undefined = process.env.NODE_ENV): BillingMode {
  return nodeEnv === "production" ? "none" : "mock";
}

/** Pure: what an upgrade request does in a given mode. */
export function decideUpgrade(mode: BillingMode, returnTo: unknown): UpgradeDecision {
  const destination = safeReturnTo(returnTo);
  return mode === "mock" ? { status: "upgraded", returnTo: destination } : { status: "opening_soon", returnTo: destination };
}

/**
 * Call from a server action. Redirects on success (mock mode), otherwise
 * returns the opening-soon decision for the page to render.
 */
export async function startUpgrade({
  source,
  returnTo,
}: {
  source: UpgradeSource;
  returnTo: unknown;
}): Promise<UpgradeDecision> {
  const decision = decideUpgrade(billingMode(), returnTo);
  if (decision.status === "upgraded") {
    await setPlan("pro");
    redirect(decision.returnTo);
  }
  track("upgrade_interest", { source });
  return decision;
}
