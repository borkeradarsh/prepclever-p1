import { NextResponse } from "next/server";
import { emptyOnboardingState } from "@/components/auth/onboarding/types";
import type { OnboardingState } from "@/components/auth/onboarding/types";

const cookieName = "prepclever-onboarding";
const validSituations = new Set(["student", "it_services", "product_tech", "non_tech"]);
const validYears = new Set(["0-2", "3-5", "6-10", "10+"]);
const validRoles = new Set(["genai_llm", "ml_mlops", "ai_platform", "ai_data", "backend_to_ai"]);
const validSteps = new Set(["situation", "role", "payoff", "done"]);
function read(request: Request): OnboardingState {
  const value = request.headers.get("cookie")?.match(new RegExp(`${cookieName}=([^;]+)`))?.[1];
  if (!value) return emptyOnboardingState();
  try { return JSON.parse(decodeURIComponent(value)) as OnboardingState; } catch { return emptyOnboardingState(); }
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
