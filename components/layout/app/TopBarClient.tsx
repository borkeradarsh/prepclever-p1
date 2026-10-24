"use client";

// The parts of the top bar that depend on the current path.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { navCopy, sectionLabels } from "@/content/nav.config";
import { breadcrumbFor, type NavBlock } from "@/lib/nav";
import { routes } from "@/lib/routes";

export function Breadcrumb({ blocks, className = "" }: { blocks: NavBlock[] | null; className?: string }) {
  const crumbs = breadcrumbFor(usePathname() ?? "", blocks, sectionLabels);

  return (
    <nav aria-label={navCopy.breadcrumbLabel} className={`min-w-0 ${className}`}>
      <ol className="flex min-w-0 items-center gap-[var(--space-xs)] text-[length:var(--font-size-small)]">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className={`flex items-center gap-[var(--space-xs)] ${last ? "min-w-0" : "shrink-0"}`}>
              {index > 0 ? (
                <ChevronRight size={14} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-text-subtle" />
              ) : null}
              {last ? (
                <span aria-current="page" className="truncate font-medium text-text-primary">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="text-text-subtle underline-offset-2 hover:text-text-primary hover:underline">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const upgradeButton =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-soft-sm)] border border-button-primary bg-button-primary px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium text-button-primary-text transition-colors duration-200 ease-out hover:bg-text-muted motion-reduce:transition-none";

/** Free users only. Returns them to this page after upgrading; hidden on /upgrade itself. */
export function UpgradeButton() {
  const pathname = usePathname() ?? routes.dashboard;
  if (pathname === routes.upgrade) return null;

  return (
    <Link href={routes.upgradeFrom("nav", pathname)} className={upgradeButton}>
      {navCopy.upgrade}
    </Link>
  );
}
