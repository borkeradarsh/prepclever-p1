// Home: the greeting, the metrics row, the six blocks and the roles row. Each
// widget has its own Suspense skeleton (same size as the loaded widget) and its
// own error boundary, so one failing read never takes the page down.

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { WidgetBoundary } from "@/components/ui/WidgetBoundary";
import { dashboardCopy } from "@/content/dashboard.config";
import { BlockGrid, BlockGridSkeleton } from "@/features/home/BlockGrid";
import { MetricsRow, MetricsRowSkeleton } from "@/features/home/MetricsRow";
import { RolesSection, RolesSkeleton } from "@/features/home/RolesSection";
import { getProfile, getUser, roleTitle } from "@/lib/data";
import { routes } from "@/lib/routes";
import { trackLabel } from "@/lib/tracks";

export const metadata: Metadata = { title: "Home · PrepClever" };

const copy = dashboardCopy;
const errorFrame =
  "rounded-[var(--radius-soft-lg)] border border-border-soft bg-surface-card p-[var(--space-md)]";

function Widget({ id, heading, subtext, fallback, children }: { id: string; heading?: string; subtext?: string; fallback: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={heading ? `home-${id}` : undefined} aria-label={heading ? undefined : copy.metrics.label} className="grid gap-[var(--space-sm)]">
      {heading ? (
        <div>
          <h2 id={`home-${id}`} className="font-heading text-lg leading-tight text-text-primary">
            {heading}
          </h2>
          {subtext ? <p className="text-text-subtle">{subtext}</p> : null}
        </div>
      ) : null}
      <WidgetBoundary message={copy.states.errorMessage} retryLabel={copy.states.retryLabel} errorClassName={errorFrame}>
        <Suspense fallback={fallback}>{children}</Suspense>
      </WidgetBoundary>
    </section>
  );
}

export default async function DashboardPage() {
  const [user, profile] = await Promise.all([getUser(), getProfile()]);
  const firstName = user.firstName;

  return (
    <AppContainer>
      <PageHeader
        title={firstName ? copy.greeting.withName(firstName) : copy.greeting.withoutName}
        subtext={copy.greeting.subtext}
        action={
          <>
            <Link href={routes.profile} aria-label={`${copy.greeting.roleChipHint}: ${roleTitle(profile.roleId)}`}>
              <Chip>
                {copy.greeting.roleChipPrefix} {roleTitle(profile.roleId)} · {trackLabel(profile.track, profile.situation)}
              </Chip>
            </Link>
            <Badge>{user.plan === "pro" ? copy.greeting.planPro : copy.greeting.planFree}</Badge>
          </>
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-[var(--space-xl)] pb-[var(--space-xl)]">
        <Widget id="metrics" fallback={<MetricsRowSkeleton />}>
          <MetricsRow />
        </Widget>
        <Widget id="blocks" heading={copy.blocks.heading} subtext={copy.blocks.subtext} fallback={<BlockGridSkeleton />}>
          <BlockGrid />
        </Widget>
        <Widget id="roles" heading={copy.roles.heading} subtext={copy.roles.subtext} fallback={<RolesSkeleton />}>
          <RolesSection />
        </Widget>
      </div>
    </AppContainer>
  );
}
