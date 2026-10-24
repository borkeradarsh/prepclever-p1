import { Chip } from "@/components/ui/Chip";
import { getConceptById } from "@/content/concepts";
import { MAX_SKILL_TAGS } from "@/lib/jobs/skills";

type SkillTagsProps = {
  conceptIds: string[];
  /** Cards show at most five; the detail page shows all. */
  limit?: number;
};

/** Skill tags labelled with the concept map's titles. Unknown ids are dropped. */
export function SkillTags({ conceptIds, limit = MAX_SKILL_TAGS }: SkillTagsProps) {
  const tags = conceptIds
    .map((id) => getConceptById(id))
    .filter((concept) => concept !== null)
    .slice(0, limit);
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-[var(--space-xs)]">
      {tags.map((concept) => (
        <li key={concept.id}>
          <Chip>{concept.title}</Chip>
        </li>
      ))}
    </ul>
  );
}
