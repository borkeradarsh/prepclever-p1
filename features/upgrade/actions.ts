"use server";

import { parseUpgradeSource, startUpgrade } from "@/lib/billing";

export type UpgradeFormState = { status: "idle" } | { status: "opening_soon"; returnTo: string };

/**
 * The /upgrade form's action. In development startUpgrade sets the mock plan
 * and redirects to the validated returnTo, so this never returns; in
 * production there is nothing to buy yet and the form shows "opening soon".
 */
export async function upgradeAction(_previous: UpgradeFormState, formData: FormData): Promise<UpgradeFormState> {
  const decision = await startUpgrade({
    source: parseUpgradeSource(formData.get("from")),
    returnTo: formData.get("returnTo"),
  });
  return { status: "opening_soon", returnTo: decision.returnTo };
}
