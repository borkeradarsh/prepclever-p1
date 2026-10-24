"use client";

import { OnboardingFlow } from "@/components/auth/OnboardingFlow";

export default function OnboardingRoute() {
  return <main className="auth-page"><div className="auth-content"><section className="auth-form-column"><OnboardingFlow onComplete={(destination) => window.location.assign(destination)} /></section></div></main>;
}
