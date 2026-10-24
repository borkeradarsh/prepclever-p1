import Link from "next/link";
import { Lock } from "lucide-react";
import { ProgressBar } from "@/components/ui/Progress";
import { roadmapCopy } from "@/content/roadmap.config";
import { BlockChips } from "@/features/roadmap/BlockChips";
import { routes } from "@/lib/routes";
import type { BlockView } from "@/types/domain";

const card =
  "flex h-full min-h-[var(--roadmap-card-min-height)] flex-col gap-[var(--space-sm)] rounded-[var(--radius-soft-lg)] border border-border-soft bg-surface-card p-[var(--space-md)] shadow-soft transition-[box-shadow,border-color] duration-200 ease-out hover:border-border-soft-strong hover:shadow-soft-hover motion-reduce:transition-none md:p-[var(--space-lg)]";

/**
 * The six blocks as one connected flow: a numbered rail joins the cards in
 * order. Every card is the same height and every one is a link, locked or
 * not: a locked block opens its overview with the lock explained.
 */
export function RoadmapFlow({ blocks }: { blocks: BlockView[] }) {
  return (
    <ol aria-label={roadmapCopy.flowLabel} className="grid auto-rows-fr gap-[var(--space-md)]">
      {blocks.map((block, index) => (
        <li key={block.slug} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-[var(--space-sm)] md:gap-[var(--space-md)]">
          <div aria-hidden="true" className="relative flex justify-center">
            <span
              className={`relative z-10 grid size-10 place-items-center rounded-[var(--radius-pill)] border font-heading text-base ${block.progress.state === "done" ? "border-brand bg-brand-soft text-text-primary" : "border-border-soft-strong bg-surface-card text-text-subtle"}`}
            >
              {block.order}
            </span>
            {index < blocks.length - 1 ? (
              <span className="absolute bottom-[calc(-1*var(--space-md))] left-1/2 top-10 w-px -translate-x-1/2 bg-border-soft-strong" />
            ) : null}
          </div>

          <Link href={routes.block(block.slug)} className={card}>
            <span className="flex flex-wrap items-center justify-between gap-[var(--space-xs)]">
              <span className="text-[length:var(--font-size-small)] text-text-subtle">
                {roadmapCopy.blockLabel(block.order)}
              </span>
              <BlockChips block={block} />
            </span>
            <h2 className="font-heading text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] text-text-primary text-balance">
              {block.title}
            </h2>
            <p className="text-text-subtle">{block.summary}</p>
            <span className="mt-auto grid gap-[var(--space-xs)]">
              {block.locked ? (
                <span className="flex items-center gap-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-subtle">
                  <Lock size={14} strokeWidth={1.8} aria-hidden="true" />
                  {roadmapCopy.lockedNote}
                </span>
              ) : (
                <>
                  <ProgressBar
                    value={block.progress.done}
                    max={block.progress.total}
                    label={roadmapCopy.progressLabel(block.shortTitle)}
                  />
                  <span className="text-[length:var(--font-size-small)] text-text-subtle">
                    {roadmapCopy.progress(block.progress.done, block.progress.total)}
                  </span>
                </>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
