"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/Progress";
import { textLink } from "@/components/ui/link-styles";
import { dashboardCopy } from "@/content/dashboard.config";
import { routes } from "@/lib/routes";
import type { RoleOverview } from "@/types/domain";

const copy = dashboardCopy.roles;

const arrowButton =
  "inline-flex size-11 items-center justify-center rounded-[var(--radius-pill)] border border-border-soft bg-surface-card text-text-primary transition-colors duration-150 ease-out hover:border-border-strong motion-reduce:transition-none";

/**
 * The seven roles in a sideways row, the user's own first. The row scrolls by
 * touch, trackpad or the arrow buttons, and is a focusable region so arrow
 * keys scroll it too. Snap points keep a card's edge aligned.
 */
export function RolesScroller({ roles }: { roles: RoleOverview[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const card = list.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : list.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="grid gap-[var(--space-sm)]">
      <div className="flex justify-end gap-[var(--space-xs)]">
        <button type="button" onClick={() => scrollByCard(-1)} aria-label={copy.previous} className={arrowButton}>
          <ChevronLeft size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => scrollByCard(1)} aria-label={copy.next} className={arrowButton}>
          <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
      {/* relative: keeps screen-reader text inside this scroll box. */}
      <ul
        ref={listRef}
        tabIndex={0}
        aria-label={copy.regionLabel}
        className="relative flex snap-x snap-mandatory gap-[var(--space-md)] overflow-x-auto overscroll-x-contain pb-[var(--space-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {roles.map((role) => {
          const percent = role.readiness === null ? null : Math.round(role.readiness * 100);
          return (
            <li
              key={role.roleId}
              className={`grid w-[var(--role-card-width)] shrink-0 snap-start content-start gap-[var(--space-sm)] rounded-[var(--radius-soft-lg)] border p-[var(--space-md)] shadow-soft ${role.isTarget ? "border-brand border-t-[3px] bg-brand-soft/25" : "border-border-soft bg-surface-card"}`}
            >
              <div className="flex min-h-7 items-center justify-between gap-[var(--space-xs)]">
                {role.isTarget ? <Chip selected>{copy.yourRole}</Chip> : <span />}
                <span className="text-[length:var(--font-size-small)] text-text-subtle">{copy.core(role.coreCount)}</span>
              </div>
              <h3 className="font-heading text-lg leading-tight text-text-primary">{role.title}</h3>
              <p className="min-h-[3lh] text-[length:var(--font-size-small)] text-text-subtle">{role.shortDescription}</p>
              <p className="text-[length:var(--font-size-small)] font-medium text-text-primary">{copy.fit[role.fit]}</p>
              {percent === null ? (
                <Link href={routes.skillAudit} className={`${textLink} inline-flex min-h-11 items-center text-[length:var(--font-size-small)]`}>
                  {copy.noAudit}
                </Link>
              ) : (
                <div className="grid min-h-11 content-center gap-[var(--space-xs)]">
                  <span className="text-[length:var(--font-size-small)] text-text-primary">{copy.readiness(percent)}</span>
                  <ProgressBar value={percent} max={100} label={copy.readinessLabel(role.title)} />
                </div>
              )}
              <div className="flex flex-wrap gap-x-[var(--space-md)]">
                <Link
                  href={`${routes.jobs}?role=${encodeURIComponent(role.roleId)}`}
                  aria-label={copy.jobsLabel(role.title)}
                  className={`${textLink} inline-flex min-h-11 items-center text-[length:var(--font-size-small)]`}
                >
                  {copy.jobs}
                </Link>
                <Link
                  href={role.isTarget ? routes.blockItem("market", "your-role") : "/roles"}
                  className={`${textLink} inline-flex min-h-11 items-center text-[length:var(--font-size-small)]`}
                >
                  {role.isTarget ? copy.rolePage : copy.allRoles}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
