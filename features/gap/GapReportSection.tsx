import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/Progress";
import { SoftCard } from "@/components/ui/SoftCard";
import { primaryLink, textLink } from "@/components/ui/link-styles";
import { levelLabels } from "@/content/concepts";
import { gapCopy, ratingLabels } from "@/content/roadmap.config";
import { ACCESS_RULES, canAccess } from "@/lib/access";
import { getGapReport, getUser } from "@/lib/data";
import { routes } from "@/lib/routes";

const TOP_GAPS = 5;
const percent = (ratio: number) => Math.round(ratio * 100);

/**
 * The gap report: overall and per-domain readiness, the top five gaps in
 * learning order, and the upgrade moment. Free for everyone; Pro users get a
 * way into Block 3 instead of the upgrade card.
 */
export async function GapReportSection() {
  const [report, user] = await Promise.all([getGapReport(), getUser()]);

  if (report.ratedCount === 0) {
    return (
      <EmptyState
        title={gapCopy.empty.title}
        body={gapCopy.empty.body}
        action={
          <Link href={routes.skillAudit} className={primaryLink}>
            {gapCopy.empty.action}
          </Link>
        }
      />
    );
  }

  const gaps = report.gaps.slice(0, TOP_GAPS);
  const firstGap = gaps[0]?.concept;
  // Block 3's access decides between the upgrade card and the way in.
  const canOpenBlock3 = canAccess(user, { access: ACCESS_RULES.blocks.upskilling });

  return (
    <div className="grid gap-[var(--space-lg)]">
      <SoftCard padding="lg" className="grid gap-[var(--space-sm)]">
        <h2 className="font-heading text-lg leading-tight text-text-primary">{gapCopy.readinessHeading}</h2>
        <p className="font-heading text-[length:var(--font-size-page-title)] leading-none text-text-primary">
          {percent(report.readiness)}%
        </p>
        <ProgressBar value={percent(report.readiness)} max={100} label={gapCopy.readinessLabel} />
        <p className="flex flex-wrap items-center gap-x-[var(--space-sm)] text-text-subtle">
          {gapCopy.readinessNote(report.ratedCount, report.total)}
          {report.ratedCount < report.total ? (
            <Link href={routes.skillAudit} className={`${textLink} inline-flex min-h-11 items-center`}>
              {gapCopy.finishAudit}
            </Link>
          ) : null}
        </p>
      </SoftCard>

      <section aria-labelledby="gap-domains" className="grid gap-[var(--space-sm)]">
        <h2 id="gap-domains" className="font-heading text-lg leading-tight text-text-primary">
          {gapCopy.domainsHeading}
        </h2>
        <ul className="grid gap-[var(--space-sm)] sm:grid-cols-2">
          {report.domains.map((domain) => (
            <li
              key={domain.domain.id}
              className="grid content-start gap-[var(--space-xs)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-sm)]"
            >
              <p className="flex items-baseline justify-between gap-[var(--space-sm)] text-text-primary">
                <span className="font-medium">{domain.domain.title}</span>
                <span>{percent(domain.readiness)}%</span>
              </p>
              <ProgressBar
                value={percent(domain.readiness)}
                max={100}
                label={gapCopy.domainLabel(domain.domain.title)}
              />
              <p className="text-[length:var(--font-size-small)] text-text-subtle">
                {gapCopy.domainConfident(domain.confident, domain.total)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="gap-top" className="grid gap-[var(--space-sm)]">
        <h2 id="gap-top" className="font-heading text-lg leading-tight text-text-primary">
          {gapCopy.gapsHeading}
        </h2>
        {gaps.length === 0 ? (
          <p className="text-text-primary">{gapCopy.noGaps}</p>
        ) : (
          <>
            <p className="text-text-subtle">{gapCopy.gapsNote}</p>
            <ol className="grid gap-[var(--space-xs)]">
              {gaps.map((gap, index) => (
                <li key={gap.concept.id}>
                  <Link
                    href={routes.concept(gap.concept.domain, gap.concept.id)}
                    className="flex min-h-11 items-center gap-[var(--space-sm)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card px-[var(--space-sm)] py-[var(--space-sm)] transition-colors duration-150 ease-out hover:border-border-soft-strong hover:bg-brand-soft/30 motion-reduce:transition-none"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-[var(--radius-pill)] border border-border-soft-strong text-[length:var(--font-size-small)] text-text-subtle"
                    >
                      {index + 1}
                    </span>
                    <span className="grid min-w-0 flex-1">
                      <span className="text-text-primary">{gap.concept.title}</span>
                      <span className="text-[length:var(--font-size-small)] text-text-subtle">
                        {levelLabels[gap.level]} · {ratingLabels[gap.rating]}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      {gaps.length > 0 ? (
        canOpenBlock3 ? (
          firstGap ? (
            <SoftCard tone="accent" padding="lg" className="grid justify-items-start gap-[var(--space-sm)]">
              <h2 className="font-heading text-lg leading-tight text-text-primary">{gapCopy.pro.title}</h2>
              <p className="text-text-subtle">{gapCopy.pro.body}</p>
              <Link href={routes.concept(firstGap.domain, firstGap.id)} className={primaryLink}>
                {gapCopy.pro.action(firstGap.title)}
              </Link>
            </SoftCard>
          ) : null
        ) : (
          <SoftCard tone="accent" padding="lg" className="grid justify-items-start gap-[var(--space-sm)]">
            <h2 className="font-heading text-lg leading-tight text-text-primary">{gapCopy.upgrade.title}</h2>
            <p className="max-w-prose text-text-subtle">{gapCopy.upgrade.body}</p>
            <Link href={routes.upgradeFrom("gap-report", routes.block("upskilling"))} className={primaryLink}>
              {gapCopy.upgrade.action}
            </Link>
          </SoftCard>
        )
      ) : null}
    </div>
  );
}
