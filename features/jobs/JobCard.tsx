import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { SoftCard } from "@/components/ui/SoftCard";
import { jobsCopy, seniorityLabels } from "@/content/jobs.config";
import { experienceRange, formatJobDate } from "@/lib/jobs/format";
import { routes } from "@/lib/routes";
import type { Job } from "@/types/domain";
import { SkillTags } from "./SkillTags";
import { secondaryLink } from "@/components/ui/link-styles";

const copy = jobsCopy.card;

/** The kind label: research examples and dev samples are never mistaken for live jobs. */
export function JobKindBadge({ kind }: { kind: Job["kind"] }) {
  if (kind === "dev_sample") {
    return <Badge className="border-danger-ink bg-background text-danger-ink">{copy.devSample}</Badge>;
  }
  if (kind === "example") return <Badge>{copy.example}</Badge>;
  return null;
}

function dateLine(job: Job): string {
  if (job.kind === "example") return copy.exampleNote(formatJobDate(job.lastCheckedAt));
  return job.postedAt ? copy.posted(formatJobDate(job.postedAt)) : copy.firstSeen(formatJobDate(job.firstSeenAt));
}

type JobCardProps = { job: Job; roleTitle: string | null };

/**
 * One job in the list. Every card has the same rows in the same order, and the
 * grid stretches them to one height, so a group of cards is identical in size.
 */
export function JobCard({ job, roleTitle }: JobCardProps) {
  const experience = experienceRange(job.expMin, job.expMax) ?? copy.experienceMissing;
  const seniority = job.seniority ? ` · ${seniorityLabels[job.seniority]}` : "";

  return (
    <SoftCard className="flex h-full min-h-[var(--job-card-min-height)] flex-col gap-[var(--space-sm)]">
      <div className="flex items-start justify-between gap-[var(--space-sm)]">
        <Chip>{roleTitle ?? copy.roleUnclassified}</Chip>
        <JobKindBadge kind={job.kind} />
      </div>

      <div className="grid gap-[var(--space-xs)]">
        <h3 className="line-clamp-2 min-h-[2lh] font-heading text-base leading-snug text-text-primary">
          {job.title}
        </h3>
        <p className="text-text-primary">
          {job.company}
          <span className="text-text-subtle"> · {job.city ?? copy.cityMissing}</span>
        </p>
        <p className="text-text-subtle">
          {experience}
          {seniority}
        </p>
      </div>

      <div className="grid gap-[var(--space-xs)]">
        {job.skillsBasis === "role" && job.conceptIds.length > 0 ? (
          <p className="text-[length:var(--font-size-small)] text-text-subtle">{copy.roleSkills}</p>
        ) : null}
        <SkillTags conceptIds={job.conceptIds} />
      </div>

      {/* TODO(match): the match badge ("72% match" or the audit prompt) goes here once the skill audit exists. */}

      <div className="mt-auto flex items-end justify-between gap-[var(--space-sm)]">
        <p className="min-w-0 text-[length:var(--font-size-small)] text-text-subtle">{dateLine(job)}</p>
        <Link
          href={routes.job(job.id)}
          aria-label={copy.viewLabel(job.title, job.company)}
          className={`${secondaryLink} shrink-0`}
        >
          {copy.view}
        </Link>
      </div>
    </SoftCard>
  );
}
