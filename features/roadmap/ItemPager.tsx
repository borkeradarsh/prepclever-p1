import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { itemCopy } from "@/content/roadmap.config";
import type { ItemLink } from "@/types/domain";

const tile =
  "grid min-h-11 content-center gap-0.5 rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card px-[var(--space-md)] py-[var(--space-sm)] transition-colors duration-150 ease-out hover:border-border-soft-strong hover:bg-brand-soft/30 motion-reduce:transition-none";

/** Previous and Next. Next always exists: the next item, the next block, or home. */
export function ItemPager({ previous, next }: { previous: ItemLink | null; next: ItemLink }) {
  return (
    <nav
      aria-label={itemCopy.pagerLabel}
      className="mt-[var(--space-lg)] grid gap-[var(--space-sm)] border-t border-border-soft pb-[var(--space-xl)] pt-[var(--space-md)] sm:grid-cols-2"
    >
      {previous ? (
        <Link href={previous.href} className={tile}>
          <span className="flex items-center gap-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-subtle">
            <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" />
            {itemCopy.previous}
          </span>
          <span className="text-text-primary">{previous.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      <Link href={next.href} className={`${tile} sm:justify-items-end sm:text-right`}>
        <span className="flex items-center gap-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-subtle">
          {itemCopy.next}
          <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-text-primary">{next.title}</span>
      </Link>
    </nav>
  );
}
