import { LockPanel } from "@/components/ui/LockPanel";
import { itemCopy } from "@/content/roadmap.config";
import { BlockInside } from "@/features/roadmap/BlockInside";
import { ItemList } from "@/features/roadmap/ItemList";
import { routes } from "@/lib/routes";
import type { BlockItem, BlockView } from "@/types/domain";

/**
 * A locked item's page body: its block's summary and what is inside, every
 * step (locked ones marked), one upgrade action that comes back here, and one
 * free alternative. Takes only metadata: there is no body to leak.
 */
export function LockedItem({ block, item }: { block: BlockView; item: BlockItem }) {
  const here = routes.blockItem(block.slug, item.slug);

  return (
    <div className="grid gap-[var(--space-lg)]">
      <LockPanel
        variant="panel"
        title={itemCopy.locked.title}
        body={itemCopy.locked.body}
        primary={{ label: itemCopy.locked.primary, href: routes.upgradeFrom("locked-page", here) }}
        secondary={{
          label: itemCopy.freeAlternative.label,
          href: routes.blockItem(itemCopy.freeAlternative.block, itemCopy.freeAlternative.item),
        }}
      />

      <p className="text-text-primary">{block.summary}</p>

      <BlockInside block={block} heading={itemCopy.locked.insideHeading} />

      <section aria-labelledby="locked-steps" className="grid gap-[var(--space-sm)]">
        <h2 id="locked-steps" className="font-heading text-lg leading-tight text-text-primary">
          {itemCopy.locked.stepsHeading}
        </h2>
        {/* Free users have no progress inside a locked block. */}
        <ItemList block={block} plan="free" doneItems={[]} currentSlug={item.slug} />
      </section>
    </div>
  );
}
