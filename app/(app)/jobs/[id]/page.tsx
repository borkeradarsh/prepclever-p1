// /jobs/[id]: one job, linking out to the original posting. Free for everyone
// (ACCESS_RULES.jobs). Nothing from the posting itself is republished: only the
// summary, tags and dates the data layer holds.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { ProgressBar } from "@/components/ui/Progress";
import { SoftCard } from "@/components/ui/SoftCard";
import { JOBS_CONTACT_EMAIL, jobsCopy, seniorityLabels } from "@/content/jobs.config";
import { JobKindBadge } from "@/features/jobs/JobCard";
import { SkillTags } from "@/features/jobs/SkillTags";
import { primaryLink, textLink } from "@/components/ui/link-styles";
import { getJob, getJobMatch, roleTitle } from "@/lib/data";
import { applyTarget, experienceRange, formatJobDate } from "@/lib/jobs/format";
import { routes } from "@/lib/routes";
import type { Job, JobMatch } from "@/types/domain";

const copy = jobsCopy.detail;

type JobParams = { params: Promise<{ id: string }> };

/** One read per request, shared by the metadata and the page. */
const loadJob = cache(getJob);

export async function generateMetadata({ params }: JobParams): Promise<Metadata> {
  const { id } = await params;
  const job = await loadJob(id).catch(() => null);
  return { title: job ? `${job.title} · ${job.company} · PrepClever` : `${jobsCopy.title} · PrepClever` };
}

function Banners({ job }: { job: Job }) {
  const banners: { text: string; tone: "danger" | "muted" }[] = [];
  if (job.status === "closed") banners.push({ text: copy.closedBanner, tone: "danger" });
  if (job.kind === "dev_sample") banners.push({ text: copy.devSampleBanner, tone: "danger" });
  if (job.kind === "example") banners.push({ text: copy.exampleBanner(formatJobDate(job.lastCheckedAt)), tone: "muted" });
  if (banners.length === 0) return null;

  return (
    <div className="grid gap-[var(--space-sm)]">
      {banners.map((banner) => (
        <SoftCard
          key={banner.text}
          tone="flat"
          role="note"
          className={banner.tone === "danger" ? "border-danger-ink text-danger-ink" : "text-text-subtle"}
        >
          {banner.text}
        </SoftCard>
      ))}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-[var(--space-sm)]">
      <h2 id={id} className="font-heading text-lg leading-tight text-text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * The bridge from jobs to learning: how the user's audit covers this posting,
 * and each gap linking to its concept page. Before an audit, the prompt.
 */
function MatchPanel({ match }: { match: JobMatch | null }) {
  const matchCopy = jobsCopy.match;
  if (!match) {
    return (
      <SoftCard tone="flat" className="grid justify-items-start gap-[var(--space-xs)]">
        <p className="text-text-subtle">{matchCopy.noAuditBody}</p>
        <Link href={routes.skillAudit} className={`${textLink} inline-flex min-h-11 items-center`}>
          {jobsCopy.auditPrompt}
        </Link>
      </SoftCard>
    );
  }

  return (
    <SoftCard className="grid gap-[var(--space-sm)]">
      <p className="flex flex-wrap items-baseline justify-between gap-[var(--space-sm)] text-text-primary">
        <span>{matchCopy.summary(match.confident, match.required)}</span>
        <span className="font-heading text-lg">{jobsCopy.card.match(match.percent)}</span>
      </p>
      <ProgressBar value={match.percent} max={100} label={jobsCopy.card.matchLabel(match.percent)} />
      {match.gaps.length === 0 ? (
        <p className="text-text-subtle">{matchCopy.noGaps}</p>
      ) : (
        <div className="grid gap-[var(--space-xs)]">
          <h3 className="font-medium text-text-primary">{matchCopy.gapsHeading}</h3>
          <p className="text-[length:var(--font-size-small)] text-text-subtle">{matchCopy.gapsNote}</p>
          <ul className="flex flex-wrap gap-x-[var(--space-md)]">
            {match.gaps.map((gap) => (
              <li key={gap.id}>
                <Link href={routes.concept(gap.domain, gap.id)} className={`${textLink} inline-flex min-h-11 items-center`}>
                  {gap.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SoftCard>
  );
}

export default async function JobDetailPage({ params }: JobParams) {
  const { id } = await params;
  const job = await loadJob(id);
  if (!job) notFound();
  // A job with no skills has nothing to match against: no panel at all.
  const match = job.conceptIds.length > 0 ? await getJobMatch(job.id) : null;

  const role = job.roleId ? roleTitle(job.roleId) : null;
  const target = applyTarget(job.applyUrl);
  const applyLabel = target.kind === "careers" ? copy.applyCareers(job.company) : copy.applyBoard(target.siteName);
  const reportHref = `mailto:${JOBS_CONTACT_EMAIL}?subject=${encodeURIComponent(
    `${copy.reportSubject(job.title, job.company)} (${job.id})`,
  )}`;

  const facts: { label: string; value: string }[] = [
    { label: copy.role, value: role ?? jobsCopy.card.roleUnclassified },
    { label: copy.experience, value: experienceRange(job.expMin, job.expMax) ?? copy.notStated },
    { label: copy.seniority, value: job.seniority ? seniorityLabels[job.seniority] : copy.notStated },
    { label: copy.location, value: job.city ?? copy.notStated },
    { label: copy.posted, value: job.postedAt ? formatJobDate(job.postedAt) : copy.notStated },
    { label: copy.firstSeen, value: formatJobDate(job.firstSeenAt) },
    { label: copy.lastChecked, value: formatJobDate(job.lastCheckedAt) },
  ];

  return (
    <AppContainer width="reading">
      <nav aria-label="Breadcrumb" className="pt-[var(--space-lg)]">
        <Link href={routes.jobs} className={`${textLink} inline-flex min-h-11 items-center`}>
          <span aria-hidden="true">←&nbsp;</span>
          {copy.back}
        </Link>
      </nav>
      <PageHeader
        title={job.title}
        subtext={`${job.company} · ${job.city ?? jobsCopy.card.cityMissing}`}
        action={<JobKindBadge kind={job.kind} />}
      />

      <div className="grid gap-[var(--space-lg)] pb-[var(--space-xl)]">
        <Banners job={job} />

        <div className="grid justify-items-start gap-[var(--space-sm)]">
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={primaryLink}>
            {applyLabel}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          {/* Dev samples carry their own banner; they have no source to describe. */}
          {job.kind === "dev_sample" ? null : (
            <p className="text-[length:var(--font-size-small)] text-text-subtle">
              {job.kind === "collected" ? copy.note : copy.exampleNote}
            </p>
          )}
        </div>

        <Section id="job-summary" title={copy.summary}>
          <p className="max-w-prose text-text-primary">{job.summary ?? copy.summaryMissing}</p>
        </Section>

        {job.conceptIds.length > 0 ? (
          <Section id="job-match" title={jobsCopy.match.heading}>
            <MatchPanel match={match} />
          </Section>
        ) : null}

        {job.conceptIds.length > 0 ? (
          <Section id="job-skills" title={copy.skills}>
            {job.skillsBasis === "role" && role ? (
              <p className="text-text-subtle">{copy.roleSkillsNote(role)}</p>
            ) : null}
            <SkillTags conceptIds={job.conceptIds} limit={job.conceptIds.length} />
          </Section>
        ) : null}

        <Section id="job-facts" title={copy.facts}>
          <dl className="grid gap-x-[var(--space-md)] gap-y-[var(--space-sm)] sm:grid-cols-[auto_minmax(0,1fr)]">
            {facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="text-text-subtle">{fact.label}</dt>
                <dd className="m-0 text-text-primary">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <p>
          <a href={reportHref} className={`${textLink} inline-flex min-h-11 items-center`}>
            {copy.report}
          </a>
        </p>
      </div>
    </AppContainer>
  );
}
