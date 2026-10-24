// TODO(session-c): TEMPORARY HOME. The course-model widget placeholders are
// gone; Session C rebuilds Continue, Journey, This week, GCC pulse and Profile
// readiness on the six blocks, each with its own Suspense, error boundary and
// five states. Until then: the greeting row and one way into the roadmap.

import type { Metadata } from "next";
import Link from "next/link";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { SoftCard } from "@/components/ui/SoftCard";
import { primaryLink } from "@/components/ui/link-styles";
import { dashboardCopy } from "@/content/dashboard.config";
import { getProfile, getUser, roleTitle } from "@/lib/data";
import { routes } from "@/lib/routes";
import { trackLabel } from "@/lib/tracks";

export const metadata: Metadata = { title: "Home · PrepClever" };

const copy = dashboardCopy;

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

      <SoftCard tone="accent" padding="lg" className="mb-[var(--space-xl)] grid justify-items-start gap-[var(--space-sm)]">
        <h2 className="font-heading text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] text-text-primary">
          {copy.temporary.title}
        </h2>
        <p className="max-w-prose text-text-subtle">{copy.temporary.body}</p>
        <Link href={routes.roadmap} className={`${primaryLink} mt-[var(--space-xs)]`}>
          {copy.temporary.cta}
        </Link>
      </SoftCard>
    </AppContainer>
  );
}
