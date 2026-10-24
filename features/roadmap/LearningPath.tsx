import { ProgressBar } from "@/components/ui/Progress";
import { getDomain, levelLabels } from "@/content/concepts";
import { itemCopy, pathCopy, ratingLabels } from "@/content/roadmap.config";
import { LearningPathList, type PathRow } from "@/features/roadmap/LearningPathList";
import { ACCESS_RULES, canAccess } from "@/lib/access";
import { getProfile, getProgress, getRoleSyllabus, getUser, roleTitle } from "@/lib/data";
import { conceptKey } from "@/lib/progress";
import { routes } from "@/lib/routes";

/**
 * The role's concepts as one list in learning order, ported from the research
 * concept map's side panel. Numbers follow the full order, so they stay put
 * when the Core only toggle hides the rest.
 */
export async function LearningPath({ scroll = false, headingLevel = 2 }: { scroll?: boolean; headingLevel?: 2 | 3 }) {
  const [syllabus, progress, profile, user] = await Promise.all([getRoleSyllabus(), getProgress(), getProfile(), getUser()]);
  const entries = new Map(syllabus.domains.flatMap((group) => group.concepts).map((entry) => [entry.concept.id, entry]));

  const rows: PathRow[] = syllabus.order.map((id) => {
    const entry = entries.get(id)!;
    const rated = progress.auditRatings[id] !== undefined;
    return {
      id,
      title: entry.concept.title,
      href: routes.concept(entry.concept.domain, id),
      domainTitle: getDomain(entry.concept.domain)?.title ?? entry.concept.domain,
      core: entry.level === 2,
      levelLabel: levelLabels[entry.level],
      ratingLabel: rated ? ratingLabels[entry.rating] : pathCopy.notRated,
      done: progress.doneItems.includes(conceptKey(id)),
    };
  });
  const core = rows.filter((row) => row.core);
  const coreDone = core.filter((row) => row.done).length;
  const Heading = `h${headingLevel}` as const;

  return (
    <section aria-labelledby="learning-path" className="grid content-start gap-[var(--space-sm)]">
      <div className="grid gap-[var(--space-xs)]">
        <p className="text-[length:var(--font-size-small)] font-medium uppercase tracking-[0.08em] text-text-subtle">{pathCopy.eyebrow}</p>
        <Heading id="learning-path" className="font-heading text-lg leading-tight text-text-primary">
          {pathCopy.heading(roleTitle(profile.roleId))}
        </Heading>
        <p className="text-[length:var(--font-size-small)] text-text-subtle">{pathCopy.note}</p>
        <ProgressBar value={coreDone} max={core.length} label={pathCopy.progressLabel} className="mt-[var(--space-xs)]" />
        <p className="text-[length:var(--font-size-small)] text-text-subtle">{pathCopy.progress(coreDone, core.length)}</p>
      </div>
      <LearningPathList
        rows={rows}
        lessonsLocked={!canAccess(user, { access: ACCESS_RULES.blocks.upskilling })}
        lockedLabel={itemCopy.lockedLabel}
        doneLabel={itemCopy.doneLabel}
        scroll={scroll}
      />
    </section>
  );
}
