// /start: one place that decides where a signed-in user lands (spec section 3,
// edit 3). Onboarding incomplete: onboarding. Complete with nothing opened yet:
// Block 1's role page. Otherwise: the dashboard.

import { NextResponse } from "next/server";
import { getOnboardingComplete, getProgress } from "@/lib/data";
import { resolveStartDestination } from "@/lib/start";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const complete = await getOnboardingComplete();
  // A failed progress read must not strand the user: fall back to the dashboard.
  const progress = complete ? await getProgress().catch(() => null) : null;
  return NextResponse.redirect(new URL(resolveStartDestination(complete, progress), request.url));
}
