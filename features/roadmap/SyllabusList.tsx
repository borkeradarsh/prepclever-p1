import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { levelLabels } from "@/content/concepts";
import { itemCopy, syllabusCopy } from "@/content/roadmap.config";
import { conceptKey } from "@/lib/progress";
import { routes } from "@/lib/routes";
import type { RoleSyllabus } from "@/types/domain";

type SyllabusListProps = {
  syllabus: RoleSyllabus;
  doneItems: string[];
  /** Lessons are locked for free users; the concept pages stay open. */
  lessonsLocked: boolean;
};

/** Block 3's concepts on its overview: one group per domain, in learning order. */
export function SyllabusList({ syllabus, doneItems, lessonsLocked }: SyllabusListProps) {
  return (
    <section aria-labelledby="block-syllabus" className="grid gap-[var(--space-sm)]">
      <h2 id="block-syllabus" className="font-heading text-lg leading-tight text-text-primary">
        {syllabusCopy.heading}
      </h2>
      <p className="text-text-subtle">{syllabusCopy.note}</p>
      <div className="grid gap-[var(--space-md)] md:grid-cols-2">
        {syllabus.domains.map((group) => (
          <section
            key={group.domain.id}
            aria-labelledby={`syllabus-${group.domain.id}`}
            className="grid content-start gap-[var(--space-xs)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-sm)]"
          >
            <h3 id={`syllabus-${group.domain.id}`} className="flex items-baseline justify-between gap-[var(--space-sm)] px-[var(--space-xs)]">
              <span className="font-medium text-text-primary">{group.domain.title}</span>
              <span className="text-[length:var(--font-size-small)] font-normal text-text-subtle">
                {syllabusCopy.count(group.concepts.length)}
              </span>
            </h3>
            <ol className="grid gap-px">
              {group.concepts.map((entry) => {
                const done = doneItems.includes(conceptKey(entry.concept.id));
                return (
                  <li key={entry.concept.id}>
                    <Link
                      href={routes.concept(entry.concept.domain, entry.concept.id)}
                      className="flex min-h-11 items-center gap-[var(--space-sm)] rounded-[var(--radius-soft-sm)] px-[var(--space-xs)] transition-colors duration-150 ease-out hover:bg-brand-soft/40 motion-reduce:transition-none"
                    >
                      <span className="grid min-w-0 flex-1 leading-tight">
                        <span className="text-text-primary">{entry.concept.title}</span>
                        <span className="text-[length:var(--font-size-small)] text-text-subtle">{levelLabels[entry.level]}</span>
                      </span>
                      {done ? <Check size={15} strokeWidth={2} className="shrink-0 text-accent-ink" aria-label={itemCopy.doneLabel} /> : null}
                      {lessonsLocked ? (
                        <Lock size={14} strokeWidth={1.8} className="shrink-0 text-text-subtle" aria-label={itemCopy.lockedLabel} />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
