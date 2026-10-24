// /roadmap/[block]: one block's overview. Locked blocks are shown in full
// (bullets and every step, with lock icons) plus one upgrade action and one
// free alternative. Every state ends with a next action.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { LockPanel } from "@/components/ui/LockPanel";
import { primaryLink, secondaryLink } from "@/components/ui/link-styles";
import { getBlockConfig } from "@/content/blocks.config";
import { blockCopy, itemCopy, roadmapCopy } from "@/content/roadmap.config";
import { BlockChips } from "@/features/roadmap/BlockChips";
import { BlockInside } from "@/features/roadmap/BlockInside";
import { ItemList } from "@/features/roadmap/ItemList";
import { ItemPager } from "@/features/roadmap/ItemPager";
import { SyllabusList } from "@/features/roadmap/SyllabusList";
import { getBlocks, getProgress, getRoleSyllabus, getUser } from "@/lib/data";
import { itemKey } from "@/lib/progress";
import { routes } from "@/lib/routes";
import type { BlockView, ItemLink } from "@/types/domain";

type BlockParams = { params: Promise<{ block: string }> };

export async function generateMetadata({ params }: BlockParams): Promise<Metadata> {
  const config = getBlockConfig((await params).block);
  return { title: `${config?.shortTitle ?? roadmapCopy.title} · PrepClever` };
}

function blockNeighbours(blocks: BlockView[], index: number): { previous: ItemLink | null; next: ItemLink } {
  const previous = blocks[index - 1];
  const next = blocks[index + 1];
  return {
    previous: previous
      ? { title: blockCopy.blockLink(previous.order, previous.shortTitle), href: routes.block(previous.slug) }
      : null,
    next: next
      ? { title: blockCopy.blockLink(next.order, next.shortTitle), href: routes.block(next.slug) }
      : { title: blockCopy.home, href: routes.dashboard },
  };
}

export default async function BlockPage({ params }: BlockParams) {
  const { block: slug } = await params;
  const [blocks, progress, user] = await Promise.all([getBlocks(), getProgress(), getUser()]);
  const index = blocks.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  const block = blocks[index];
  // Block 3 also lists the role's concepts from the concept map.
  const syllabus = block.slug === "upskilling" ? await getRoleSyllabus() : null;
  const live = block.items.filter((item) => item.status === "available");
  const firstOpen = live.find((item) => !progress.doneItems.includes(itemKey(block.slug, item.slug)));
  const started = block.progress.state !== "not_started";
  const pager = blockNeighbours(blocks, index);

  return (
    <AppContainer>
      <PageHeader
        title={block.title}
        subtext={block.summary}
        action={
          block.locked ? null : firstOpen ? (
            <Link href={routes.blockItem(block.slug, firstOpen.slug)} className={primaryLink}>
              {started ? blockCopy.continue(firstOpen.title) : blockCopy.start}
            </Link>
          ) : live[0] ? (
            <Link href={routes.blockItem(block.slug, live[0].slug)} className={secondaryLink}>
              {blockCopy.review}
            </Link>
          ) : null
        }
      />

      <div className="-mt-[var(--space-sm)] mb-[var(--space-lg)] flex flex-wrap items-center gap-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-subtle">
        <span>{roadmapCopy.blockLabel(block.order)}</span>
        <BlockChips block={block} />
        {block.locked ? null : <span>{roadmapCopy.progress(block.progress.done, block.progress.total)}</span>}
      </div>

      <div className="grid gap-[var(--space-lg)]">
        {block.locked ? (
          <LockPanel
            variant="panel"
            title={blockCopy.locked.title}
            body={blockCopy.locked.body}
            primary={{ label: blockCopy.locked.primary, href: routes.upgradeFrom("locked-page", routes.block(block.slug)) }}
            secondary={{
              label: itemCopy.freeAlternative.label,
              href: routes.blockItem(itemCopy.freeAlternative.block, itemCopy.freeAlternative.item),
            }}
          />
        ) : null}

        <BlockInside block={block} heading={blockCopy.insideHeading} />

        <section aria-labelledby="block-steps" className="grid gap-[var(--space-sm)]">
          <h2 id="block-steps" className="font-heading text-lg leading-tight text-text-primary">
            {blockCopy.itemsHeading}
          </h2>
          <ItemList block={block} plan={user.plan} doneItems={progress.doneItems} />
        </section>

        {syllabus ? <SyllabusList syllabus={syllabus} doneItems={progress.doneItems} lessonsLocked={block.locked} /> : null}
      </div>

      <ItemPager previous={pager.previous} next={pager.next} />
    </AppContainer>
  );
}
