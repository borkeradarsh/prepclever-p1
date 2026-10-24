"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { jobsCopy } from "@/content/jobs.config";

/** The jobs error state, for the list and a single job. Dev: fail:jobs. */
export default function JobsError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  // The failure was on the server, so re-fetch it before re-rendering.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <AppContainer>
      <PageHeader title={jobsCopy.title} subtext={jobsCopy.subtext} />
      <ErrorState
        className="pb-[var(--space-xl)]"
        message={jobsCopy.error.message}
        retryLabel={jobsCopy.error.retry}
        onRetry={retry}
      />
    </AppContainer>
  );
}
