import { migrateOnboardingState } from "@/components/auth/onboarding/migrate";
import type { OnboardingState } from "@/components/auth/onboarding/types";

const storageKey = "prepclever-onboarding";
export async function loadOnboarding(): Promise<OnboardingState | null> {
  try {
    const response = await fetch("/api/onboarding", { cache: "no-store" });
    if (response.ok) return await response.json() as OnboardingState;
  } catch { /* local mock keeps the disabled-auth prototype usable offline */ }
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try { return migrateOnboardingState(JSON.parse(raw)); } catch { return null; }
}

export async function saveOnboarding(patch: Partial<OnboardingState>) {
  const response = await fetch("/api/onboarding", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
  if (!response.ok) throw new Error("Couldn't save. Try again.");
  const state = await response.json() as OnboardingState;
  localStorage.setItem(storageKey, JSON.stringify(state));
  return state;
}

export async function completeOnboarding() {
  const response = await fetch("/api/onboarding/complete", { method: "POST" });
  if (!response.ok) throw new Error("Couldn't save. Try again.");
  localStorage.removeItem(storageKey);
}
