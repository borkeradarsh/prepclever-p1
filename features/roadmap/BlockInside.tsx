import type { Block } from "@/types/domain";

/** A block's "what's inside": the owner's bullets from blocks.config. */
export function BlockInside({ block, heading }: { block: Block; heading: string }) {
  return (
    <section aria-labelledby={`inside-${block.slug}`} className="grid gap-[var(--space-sm)]">
      <h2 id={`inside-${block.slug}`} className="font-heading text-lg leading-tight text-text-primary">
        {heading}
      </h2>
      <dl className="grid gap-[var(--space-sm)] md:grid-cols-2">
        {block.bullets.map((bullet) => (
          <div
            key={bullet.term}
            className="grid content-start gap-[var(--space-xs)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-md)]"
          >
            <dt className="font-medium text-text-primary">{bullet.term}</dt>
            <dd className="m-0 text-text-subtle">{bullet.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
