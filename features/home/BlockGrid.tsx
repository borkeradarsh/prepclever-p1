import Link from "next/link";
import { Lock } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";
import { textLink } from "@/components/ui/link-styles";
import { dashboardCopy } from "@/content/dashboard.config";
import { BlockChips } from "@/features/roadmap/BlockChips";
import { getBlocks, getProgress } from "@/lib/data";
import { itemKey } from "@/lib/progress";
import { routes } from "@/lib/routes";
import type { BlockView } from "@/types/domain";

const copy = dashboardCopy.blocks;

export const blockFrame =
  "grid min-h-[var(--home-block-min-height)] content-start gap-[var(--space-sm)] rounded-[var(--radius-soft-lg)] border bg-surface-card p-[var(--space-md)] shadow-soft";
export const blockGrid = "grid auto-rows-fr gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-3";

/** The first block not finished: the one the user is in. Locked blocks count. */
function currentBlock(blocks: BlockView[]): BlockView | null {
  return blocks.find((block) => block.status === "available" && block.progress.state !== "done") ?? null;
}

/**
 * The six blocks as equal cards. The current one is marked and shows its next
 * two steps. Locked blocks stay visible with a lock; the page's upgrade action
 * lives in the metrics row, so these carry none of their own.
 */
export async function BlockGrid() {
  const [blocks, progress] = await Promise.all([getBlocks(), getProgress()]);
  if (blocks.length === 0) return <EmptyState title={copy.emptyTitle} body={copy.emptyBody} />;

  const current = currentBlock(blocks);
  const done = new Set(progress.doneItems);

  return (
    <ol className={blockGrid}>
      {blocks.map((block) => {
        const isCurrent = block.slug === current?.slug;
        const nextItems = isCurrent && !block.locked
          ? block.items.filter((item) => item.status === "available" && !done.has(itemKey(block.slug, item.slug))).slice(0, 2)
          : [];
        return (
          <li
            key={block.slug}
            aria-current={isCurrent ? "step" : undefined}
            className={`${blockFrame} ${isCurrent ? "border-border-soft border-t-[3px] border-t-brand bg-brand-soft/25" : "border-border-soft"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-xs)]">
              <span className="text-[length:var(--font-size-small)] text-text-subtle">
                {copy.label(block.order)}
                {isCurrent ? <span className="ml-[var(--space-xs)] font-medium text-accent-ink">· {copy.current}</span> : null}
              </span>
              <BlockChips block={block} />
            </div>
            <h3 className="font-heading text-lg leading-tight text-text-primary">
              <Link href={routes.block(block.slug)} className="underline-offset-2 hover:underline">
                {block.shortTitle}
              </Link>
            </h3>
            <p className="text-[length:var(--font-size-small)] text-text-subtle">{block.summary}</p>

            {nextItems.length > 0 ? (
              <div className="grid gap-0.5">
                <p className="text-[length:var(--font-size-small)] font-medium text-text-primary">{copy.nextHeading}</p>
                <ul className="grid">
                  {nextItems.map((item) => (
                    <li key={item.slug}>
                      <Link href={routes.blockItem(block.slug, item.slug)} className={`${textLink} inline-flex min-h-11 items-center text-[length:var(--font-size-small)]`}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-auto grid gap-[var(--space-xs)]">
              {block.locked ? (
                <>
                  <p className="flex items-center gap-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-subtle">
                    <Lock size={13} strokeWidth={1.8} aria-hidden="true" />
                    {copy.lockedNote}
                  </p>
                  {block.slug === "upskilling" ? (
                    <Link href={routes.conceptMap} className={`${textLink} inline-flex min-h-11 items-center text-[length:var(--font-size-small)]`}>
                      {copy.mapNote}
                    </Link>
                  ) : null}
                </>
              ) : (
                <>
                  <ProgressBar value={block.progress.done} max={block.progress.total} label={copy.progressLabel(block.shortTitle)} />
                  <p className="text-[length:var(--font-size-small)] text-text-subtle">
                    {copy.progress(block.progress.done, block.progress.total)}
                  </p>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function BlockGridSkeleton() {
  return (
    <div role="status" aria-label={dashboardCopy.states.loadingLabel}>
      <ol aria-hidden="true" className={blockGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index} className={`${blockFrame} border-border-soft`}>
            <div className="flex justify-between">
              <Skeleton width="4rem" height="0.75rem" />
              <Skeleton width="8rem" height="1.6rem" radius="pill" />
            </div>
            <Skeleton width="60%" height="1.3rem" />
            <Skeleton width="90%" height="0.8rem" />
            <Skeleton height="0.25rem" className="mt-auto" />
          </li>
        ))}
      </ol>
    </div>
  );
}
