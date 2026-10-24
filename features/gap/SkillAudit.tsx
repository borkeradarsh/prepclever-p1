"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ProgressBar } from "@/components/ui/Progress";
import { primaryLink, textLink } from "@/components/ui/link-styles";
import { auditCopy, ratingLabels } from "@/content/roadmap.config";
import { rateConceptAction } from "@/features/gap/actions";
import { routes } from "@/lib/routes";
import type { Rating } from "@/types/domain";

export type AuditDomain = {
  id: string;
  title: string;
  concepts: { id: string; title: string; href: string; levelLabel: string }[];
};

type SkillAuditProps = {
  domains: AuditDomain[];
  /** Only answers the user has given: an unrated concept has no entry. */
  initialRatings: Record<string, Rating>;
};

const OPTIONS: Rating[] = ["not_started", "learning", "confident"];

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * The audit, one radio group per concept. Each answer shows at once and saves
 * in the background; a failed save puts the previous answer back and says so.
 */
export function SkillAudit({ domains, initialRatings }: SkillAuditProps) {
  const [ratings, setRatings] = useState(initialRatings);
  const [save, setSave] = useState<SaveState>("idle");
  const [, startTransition] = useTransition();

  const total = domains.reduce((sum, domain) => sum + domain.concepts.length, 0);
  const rated = domains.reduce(
    (sum, domain) => sum + domain.concepts.filter((concept) => ratings[concept.id] !== undefined).length,
    0,
  );

  const rate = (conceptId: string, rating: Rating) => {
    const previous = ratings[conceptId];
    setRatings((current) => ({ ...current, [conceptId]: rating }));
    setSave("saving");
    startTransition(async () => {
      try {
        await rateConceptAction(conceptId, rating);
        setSave("saved");
      } catch {
        setRatings((current) => {
          const next = { ...current };
          if (previous === undefined) delete next[conceptId];
          else next[conceptId] = previous;
          return next;
        });
        setSave("error");
      }
    });
  };

  return (
    <div className="grid gap-[var(--space-lg)]">
      <p className="max-w-prose text-text-primary">{auditCopy.intro}</p>

      {/* Sticky, so progress and the save state stay in view down a long list. */}
      <div className="sticky top-[var(--app-nav-height)] z-10 -mx-[var(--space-xs)] grid gap-[var(--space-xs)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-sm)] shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-sm)] text-[length:var(--font-size-small)]">
          <span className="font-medium text-text-primary">{auditCopy.progress(rated, total)}</span>
          <span aria-live="polite" className={save === "error" ? "text-danger-ink" : "text-text-subtle"}>
            {save === "saving" ? auditCopy.saving : save === "saved" ? auditCopy.saved : save === "error" ? auditCopy.error : ""}
          </span>
        </div>
        <ProgressBar value={rated} max={total} label={auditCopy.progressLabel} />
      </div>

      {domains.map((domain) => {
        const domainRated = domain.concepts.filter((concept) => ratings[concept.id] !== undefined).length;
        return (
          <section key={domain.id} aria-labelledby={`audit-${domain.id}`} className="grid gap-[var(--space-sm)]">
            <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-sm)]">
              <h2 id={`audit-${domain.id}`} className="font-heading text-lg leading-tight text-text-primary">
                {domain.title}
              </h2>
              <span className="text-[length:var(--font-size-small)] text-text-subtle">
                {auditCopy.domainCount(domainRated, domain.concepts.length)}
              </span>
            </div>
            <ul className="grid gap-[var(--space-xs)]">
              {domain.concepts.map((concept) => {
                return (
                  <li
                    key={concept.id}
                    className="grid gap-[var(--space-xs)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-sm)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="grid min-w-0">
                      <Link href={concept.href} className={`${textLink} justify-self-start`}>
                        {concept.title}
                      </Link>
                      <span className="text-[length:var(--font-size-small)] text-text-subtle">{concept.levelLabel}</span>
                    </div>
                    <div
                      role="radiogroup"
                      aria-label={auditCopy.ratingGroupLabel(concept.title)}
                      className="grid grid-cols-3 gap-[var(--space-xs)]"
                    >
                      {OPTIONS.map((option) => (
                        <label
                          key={option}
                          className="relative inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border border-border bg-background px-[var(--space-sm)] text-center text-[length:var(--font-size-small)] text-text-primary transition-colors duration-150 ease-out hover:border-focus has-checked:border-focus has-checked:bg-brand-soft has-checked:font-medium has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus motion-reduce:transition-none"
                        >
                          <input
                            type="radio"
                            name={`rating-${concept.id}`}
                            value={option}
                            checked={ratings[concept.id] === option}
                            onChange={() => rate(concept.id, option)}
                            className="sr-only"
                          />
                          {ratingLabels[option]}
                        </label>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="flex flex-wrap items-center gap-[var(--space-md)]">
        {rated === total ? <p className="text-text-primary">{auditCopy.done}</p> : null}
        <Link href={routes.gapReport} className={primaryLink}>
          {auditCopy.toReport}
        </Link>
      </div>
    </div>
  );
}
