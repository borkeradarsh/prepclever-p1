import { NextResponse } from "next/server";
import { parseOnboardingCookie } from "@/components/auth/onboarding/migrate";
import { INTENT_COOKIE } from "@/lib/intent";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie")?.match(/prepclever-onboarding=([^;]+)/)?.[1];
  const state = parseOnboardingCookie(cookie);
  state.currentStep = "done"; state.completedAt = state.completedAt ?? new Date().toISOString(); state.updatedAt = new Date().toISOString();
  const result = NextResponse.json(state);
  result.cookies.set("prepclever-onboarding", encodeURIComponent(JSON.stringify(state)), { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 90, path: "/" });
  // The landing-page situation has done its job once onboarding is complete.
  result.cookies.delete(INTENT_COOKIE);
  return result;
}
