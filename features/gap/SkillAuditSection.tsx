import { levelLabels } from "@/content/concepts";
import { SkillAudit } from "@/features/gap/SkillAudit";
import { getProgress, getRoleSyllabus } from "@/lib/data";
import { routes } from "@/lib/routes";

/** Loads the role's syllabus and the user's answers for the client audit. */
export async function SkillAuditSection() {
  const [syllabus, progress] = await Promise.all([getRoleSyllabus(), getProgress()]);
  const domains = syllabus.domains.map((group) => ({
    id: group.domain.id,
    title: group.domain.title,
    concepts: group.concepts.map((entry) => ({
      id: entry.concept.id,
      title: entry.concept.title,
      href: routes.concept(entry.concept.domain, entry.concept.id),
      levelLabel: levelLabels[entry.level],
    })),
  }));
  const relevant = new Set(syllabus.order);
  const initialRatings = Object.fromEntries(
    Object.entries(progress.auditRatings).filter(([id]) => relevant.has(id)),
  );

  return <SkillAudit domains={domains} initialRatings={initialRatings} />;
}
