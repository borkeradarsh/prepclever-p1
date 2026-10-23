"use client";

import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { dashboardCopy } from "@/content/dashboard.config";

/**
 * Last-resort boundary for the app pages. Next session's per-widget boundaries
 * should mean a single failing widget never reaches this.
 */
export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <AppContainer>
      <PageHeader title="Something went wrong" />
      <ErrorState
        message={dashboardCopy.states.errorMessage}
        retryLabel={dashboardCopy.states.retryLabel}
        onRetry={reset}
      />
    </AppContainer>
  );
}
