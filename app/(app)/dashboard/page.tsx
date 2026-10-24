// TODO(widgets): TEMPORARY PAGE. This exists only to prove the shell, the 1120px
// container, the two-column grid and the mobile stacking order. Next session
// replaces every placeholder below with the real widget, each wrapped in its own
// Suspense and error boundary and each implementing all five states.

import type { Metadata } from "next";
import Link from "next/link";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { SoftCard } from "@/components/ui/SoftCard";
import { dashboardCopy } from "@/content/dashboard.config";
import { getProfile, getUser, roleTitle } from "@/lib/data";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Home · PrepClever" };

const copy = dashboardCopy;

/** Reserved heights, so a skeleton and its loaded content are the same size. */
const placeholders = {
  main: [
    { key: "continue", heading: copy.continueCard.heading, height: "13rem", tone: "accent" as const },
    { key: "path", heading: copy.pathOverview.heading, height: "22rem", tone: "default" as const },
  ],
  side: [
    { key: "goal", heading: copy.weeklyGoal.heading, height: "9.5rem", tone: "default" as const },
    { key: "pulse", heading: copy.gccPulse.heading, height: "9rem", tone: "default" as const },
    { key: "readiness", heading: copy.profileReadiness.heading, height: "10rem", tone: "default" as const },
  ],
};

function WidgetPlaceholder({
  heading,
  height,
  tone,
}: {
  heading: string;
  height: string;
  tone: "default" | "accent";
}) {
  return (
    <SoftCard tone={tone} padding="lg">
      <p className="font-heading text-base leading-tight text-text-primary">{heading}</p>
      <div className="mt-[var(--space-md)] grid content-start gap-[var(--space-sm)]" style={{ minHeight: height }}>
        <Skeleton width="40%" height="0.7rem" />
        <SkeletonText lines={3} />
      </div>
    </SoftCard>
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
          <Link href={routes.profile} aria-label={copy.greeting.roleChipHint}>
            <Chip>
              {copy.greeting.roleChipPrefix} {roleTitle(profile.roleId)}
            </Chip>
          </Link>
        }
      />

      <div className="grid items-start gap-6 pb-[var(--space-xl)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-6">
          {placeholders.main.map((item) => (
            <WidgetPlaceholder
              key={item.key}
              heading={item.heading}
              height={item.height}
              tone={item.tone}
            />
          ))}
        </div>
        <div className="grid gap-6">
          {placeholders.side.map((item) => (
            <WidgetPlaceholder
              key={item.key}
              heading={item.heading}
              height={item.height}
              tone={item.tone}
            />
          ))}
        </div>
      </div>
    </AppContainer>
  );
}
