import { NextResponse } from "next/server";
import { parseOnboardingCookie } from "@/components/auth/onboarding/migrate";
import { ONBOARDING_STEPS, ROLE_IDS, SITUATIONS, YEARS_BANDS } from "@/components/auth/onboarding/types";
import type { OnboardingState } from "@/components/auth/onboarding/types";

const cookieName = "prepclever-onboarding";
const validSituations = new Set<string>(SITUATIONS);
const validYears = new Set<string>(YEARS_BANDS);
const validRoles = new Set<string>(ROLE_IDS);
const validSteps = new Set<string>(ONBOARDING_STEPS);
// Reading migrates old year bands and role ids; the response then re-saves them.
function read(request: Request): OnboardingState {
  const value = request.headers.get("cookie")?.match(new RegExp(`${cookieName}=([^;]+)`))?.[1];
  return parseOnboardingCookie(value);
}
function valid(state: OnboardingState) {
  if (state.situation && !validSituations.has(state.situation)) return false;
  if (state.yearsBand && !validYears.has(state.yearsBand)) return false;
  if (state.roleId && !validRoles.has(state.roleId)) return false;
  if (!validSteps.has(state.currentStep)) return false;
  if (state.situation && (state.situation === "student" || state.situation === "non_tech") && state.yearsBand !== null) return false;
  if (state.currentStep !== "situation" && state.situation && (state.situation === "it_services" || state.situation === "product_tech") && !state.yearsBand) return false;
  return true;
}
function response(state: OnboardingState) {
  const result = NextResponse.json(state);
  result.cookies.set(cookieName, encodeURIComponent(JSON.stringify(state)), { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 90, path: "/" });
  return result;
}
export async function GET(request: Request) { return response(read(request)); }
export async function PATCH(request: Request) {
  const current = read(request);
  const patch = await request.json() as Partial<OnboardingState>;
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  if (!valid(next)) return NextResponse.json({ error: "Invalid onboarding state" }, { status: 400 });
  return response(next);
}
