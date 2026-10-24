"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { pathCopy } from "@/content/roadmap.config";

export type PathRow = {
  id: string;
  title: string;
  href: string;
  domainTitle: string;
  core: boolean;
  levelLabel: string;
  ratingLabel: string;
  done: boolean;
};

type LearningPathListProps = {
  rows: PathRow[];
  /** Free users: the concept pages are open, their lessons are not. */
  lessonsLocked: boolean;
  lockedLabel: string;
  doneLabel: string;
  /** Caps the list's height and scrolls it on its own, beside the concept map. */
  scroll?: boolean;
};

/** Pure: the rows shown for the toggle, in learning order either way. */
export function visibleRows(rows: PathRow[], coreOnly: boolean): PathRow[] {
  return coreOnly ? rows.filter((row) => row.core) : rows;
}

export function LearningPathList({ rows, lessonsLocked, lockedLabel, doneLabel, scroll = false }: LearningPathListProps) {
  const [coreOnly, setCoreOnly] = useState(false);
  const shown = visibleRows(rows, coreOnly);

  return (
    <div className="grid gap-[var(--space-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <p aria-live="polite" className="text-[length:var(--font-size-small)] text-text-subtle">
          {pathCopy.count(shown.length)}
        </p>
        <Chip as="button" selected={coreOnly} onClick={() => setCoreOnly((value) => !value)}>
          {pathCopy.coreOnly}
        </Chip>
      </div>
      <ol className={`grid gap-px ${scroll ? "max-h-[70dvh] overflow-y-auto overscroll-contain pr-[var(--space-xs)]" : ""}`}>
        {shown.map((row) => (
          <li key={row.id}>
            <Link
              href={row.href}
              className="flex min-h-11 items-center gap-[var(--space-sm)] rounded-[var(--radius-soft-sm)] px-[var(--space-xs)] py-[var(--space-xs)] transition-colors duration-150 ease-out hover:bg-brand-soft/40 motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-[var(--radius-pill)] border text-[length:var(--font-size-small)] ${row.done ? "border-brand bg-brand-soft text-text-primary" : "border-border-soft-strong text-text-subtle"}`}
              >
                {row.done ? <Check size={14} strokeWidth={2} /> : rows.indexOf(row) + 1}
              </span>
              <span className="grid min-w-0 flex-1 leading-tight">
                <span className="text-text-primary">{row.title}</span>
                <span className="text-[length:var(--font-size-small)] text-text-subtle">
                  {row.domainTitle} · {row.ratingLabel}
                </span>
              </span>
              <span className={`shrink-0 text-[length:var(--font-size-small)] ${row.core ? "font-medium text-accent-ink" : "text-text-subtle"}`}>
                {row.levelLabel}
              </span>
              {row.done ? <span className="sr-only">, {doneLabel}</span> : null}
              {lessonsLocked ? (
                <Lock size={14} strokeWidth={1.8} className="shrink-0 text-text-subtle" aria-label={lockedLabel} />
              ) : null}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
