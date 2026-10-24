// /upgrade?from=<source>&returnTo=<path>: Free against Pro, from plans.config.
// Coming-soon features always carry their chip, prices stay hidden until
// showPrices is set, and the action goes through startUpgrade (lib/billing.ts)
// with a validated returnTo. TODO(payments): a real checkout.

import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { SoftCard } from "@/components/ui/SoftCard";
import { textLink } from "@/components/ui/link-styles";
import { getPlan, planCopy, showPrices, upgradeCopy, type PlanConfig } from "@/content/plans.config";
import { UpgradeForm } from "@/features/upgrade/UpgradeForm";
import { parseUpgradeSource } from "@/lib/billing";
import { getUser } from "@/lib/data";
import { safeReturnTo } from "@/lib/return-to";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: `${upgradeCopy.title} · PrepClever` };

type UpgradeProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function PlanCard({ plan, current, footer }: { plan: PlanConfig; current: boolean; footer?: ReactNode }) {
  const included = plan.includes ? getPlan(plan.includes) : null;

  return (
    <SoftCard tone={plan.id === "pro" ? "accent" : "default"} padding="lg" className="flex h-full flex-col gap-[var(--space-md)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <h2 className="font-heading text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] text-text-primary">
          {plan.name}
        </h2>
        {current ? <Chip selected>{upgradeCopy.currentPlan}</Chip> : null}
      </div>
      {showPrices && plan.priceRange ? (
        <p className="text-text-primary">{planCopy.price(plan.priceRange.min, plan.priceRange.max, plan.priceRange.per)}</p>
      ) : null}
      {included ? <p className="text-text-subtle">{planCopy.everythingIn(included.name)}</p> : null}
      <ul className="grid content-start gap-[var(--space-sm)]">
        {plan.features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-[var(--space-sm)]">
            {feature.status === "available" ? (
              <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-ink" />
            ) : (
              <Clock size={16} strokeWidth={1.8} aria-hidden="true" className="mt-0.5 shrink-0 text-text-subtle" />
            )}
            <span className={`min-w-0 flex-1 ${feature.status === "available" ? "text-text-primary" : "text-text-subtle"}`}>
              {feature.label}
              {feature.status === "available" ? <span className="sr-only">, {planCopy.available}</span> : null}
            </span>
            {feature.status === "coming_soon" ? <Chip className="shrink-0">{planCopy.comingSoon}</Chip> : null}
          </li>
        ))}
      </ul>
      {footer ? <div className="mt-auto pt-[var(--space-sm)]">{footer}</div> : null}
    </SoftCard>
  );
}

export default async function UpgradePage({ searchParams }: UpgradeProps) {
  const [params, user] = await Promise.all([searchParams, getUser()]);
  const source = parseUpgradeSource(first(params.from));
  const returnTo = safeReturnTo(first(params.returnTo));
  const [free, pro, teams] = [getPlan("free"), getPlan("pro"), getPlan("teams")];

  if (user.plan === "pro") {
    return (
      <AppContainer>
        <PageHeader title={upgradeCopy.alreadyPro.title} />
        <EmptyState
          title={upgradeCopy.alreadyPro.title}
          body={upgradeCopy.alreadyPro.body}
          action={
            <Link href={returnTo} className={textLink}>
              {upgradeCopy.alreadyPro.back}
            </Link>
          }
        />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <PageHeader title={upgradeCopy.title} subtext={upgradeCopy.subtext} />
      <div className="grid auto-rows-fr gap-[var(--space-md)] md:grid-cols-2">
        <PlanCard plan={free} current />
        <PlanCard plan={pro} current={false} footer={<UpgradeForm source={source} returnTo={returnTo} />} />
      </div>

      <SoftCard tone="flat" className="mb-[var(--space-xl)] mt-[var(--space-md)] grid gap-[var(--space-xs)]">
        <h2 className="font-heading text-base leading-tight text-text-primary">{upgradeCopy.teams.title}</h2>
        {teams.features.map((feature) => (
          <p key={feature.label} className="flex flex-wrap items-center gap-[var(--space-sm)] text-text-subtle">
            {feature.label}
            {feature.status === "coming_soon" ? <Chip>{planCopy.comingSoon}</Chip> : null}
          </p>
        ))}
        <a href={planCopy.contactHref} className={`${textLink} inline-flex min-h-11 items-center justify-self-start`}>
          {planCopy.contact}
        </a>
      </SoftCard>
    </AppContainer>
  );
}
