import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { itemCopy, kindLabels, roadmapCopy } from "@/content/roadmap.config";
import { canAccess } from "@/lib/access";
import { itemKey } from "@/lib/progress";
import { routes } from "@/lib/routes";
import type { BlockView, Plan } from "@/types/domain";

type ItemListProps = {
  block: BlockView;
  plan: Plan;
  doneItems: string[];
  /** Highlights the item being viewed, on a lock page. */
  currentSlug?: string;
};

/** A block's steps, in order. Locked and coming-soon steps stay listed and clickable. */
export function ItemList({ block, plan, doneItems, currentSlug }: ItemListProps) {
  return (
    <ol className="grid gap-[var(--space-xs)]">
      {block.items.map((item, index) => {
        const locked = !canAccess({ plan }, item);
        const done = doneItems.includes(itemKey(block.slug, item.slug));
        const current = item.slug === currentSlug;
        const meta = [kindLabels[item.kind], item.estimatedMinutes ? itemCopy.minutes(item.estimatedMinutes) : null]
          .filter(Boolean)
          .join(" · ");

        return (
          <li key={item.slug}>
            <Link
              href={routes.blockItem(block.slug, item.slug)}
              aria-current={current ? "page" : undefined}
              className={`flex min-h-11 items-center gap-[var(--space-sm)] rounded-[var(--radius-soft-md)] border px-[var(--space-sm)] py-[var(--space-sm)] transition-colors duration-150 ease-out hover:border-border-soft-strong hover:bg-brand-soft/30 motion-reduce:transition-none ${current ? "border-border-soft-strong bg-brand-soft/30" : "border-border-soft bg-surface-card"}`}
            >
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-[var(--radius-pill)] border text-[length:var(--font-size-small)] ${done ? "border-brand bg-brand-soft text-text-primary" : "border-border-soft-strong text-text-subtle"}`}
              >
                {done ? <Check size={14} strokeWidth={2} /> : index + 1}
              </span>
              <span className="grid min-w-0 flex-1">
                <span className="text-text-primary">{item.title}</span>
                <span className="text-[length:var(--font-size-small)] text-text-subtle">{meta}</span>
              </span>
              {item.status === "coming_soon" ? <Chip className="shrink-0">{roadmapCopy.comingSoon}</Chip> : null}
              {done ? <span className="sr-only">{itemCopy.doneLabel}</span> : null}
              {locked ? (
                <Lock size={15} strokeWidth={1.8} className="shrink-0 text-text-subtle" aria-label={itemCopy.lockedLabel} />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
