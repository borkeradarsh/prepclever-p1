"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { OnboardingFlow } from "@/components/auth/OnboardingFlow";

export function AuthDisabledFlow() {
  return (
    <AuthShell showLegal={false} contentClassName="onboarding-auth-content">
      <OnboardingFlow nameRequired onComplete={(destination) => window.location.assign(destination)} />
      <style jsx>{`
        :global(.onboarding-auth-content) {
          width: min(100% - 2rem, 30rem);
          min-height: auto;
          align-items: flex-start;
          padding-top: 3.5rem;
        }
        @media (max-width: 480px) {
          :global(.onboarding-auth-content) {
            width: min(100% - 1.5rem, 30rem);
            padding-top: 3rem;
          }
        }
      `}</style>
    </AuthShell>
  );
}
