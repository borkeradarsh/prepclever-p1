import { NextResponse } from "next/server";
import { emptyOnboardingState } from "@/components/auth/onboarding/types";
import type { OnboardingState } from "@/components/auth/onboarding/types";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie")?.match(/prepclever-onboarding=([^;]+)/)?.[1];
  let state: OnboardingState = emptyOnboardingState();
  if (cookie) {
    try { state = JSON.parse(decodeURIComponent(cookie)) as OnboardingState; } catch { /* reset malformed state */ }
  }
  state.currentStep = "done"; state.completedAt = state.completedAt ?? new Date().toISOString(); state.updatedAt = new Date().toISOString();
  const result = NextResponse.json(state);
  result.cookies.set("prepclever-onboarding", encodeURIComponent(JSON.stringify(state)), { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 90, path: "/" });
  return result;
}
