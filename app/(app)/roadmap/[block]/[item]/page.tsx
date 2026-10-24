// /roadmap/[block]/[item]: the generic item page. Guide content is written in a
// later session, so an open item shows a "Content is being added" state, never
// invented text.
//
// Locked: the page returns before anything could touch an item body, so a
// locked body is never rendered and never requested. TODO(session-c): when item
// bodies exist, fetch them only below the locked branch, through an
// access-checked lib/data function.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { getBlockConfig, statusLabels } from "@/content/blocks.config";
import { itemCopy, kindLabels, roadmapCopy } from "@/content/roadmap.config";
import { ItemPager } from "@/features/roadmap/ItemPager";
import { LockedItem } from "@/features/roadmap/LockedItem";
import { MarkDoneButton } from "@/features/roadmap/MarkDoneButton";
import { getBlockItem } from "@/lib/data";

type ItemParams = { params: Promise<{ block: string; item: string }> };

export async function generateMetadata({ params }: ItemParams): Promise<Metadata> {
  const { block, item } = await params;
  const title = getBlockConfig(block)?.items.find((entry) => entry.slug === item)?.title;
  return { title: `${title ?? roadmapCopy.title} · PrepClever` };
}

export default async function ItemPage({ params }: ItemParams) {
  const { block: blockSlug, item: itemSlug } = await params;
  const view = await getBlockItem(blockSlug, itemSlug);
  if (!view) notFound();

  const { block, item, locked, done, previous, next } = view;
  const comingSoon = item.status === "coming_soon";

  const header = (
    <>
      <PageHeader title={item.title} subtext={`${roadmapCopy.blockLabel(block.order)} · ${block.shortTitle}`} />
      <div className="-mt-[var(--space-sm)] mb-[var(--space-lg)] flex flex-wrap items-center gap-[var(--space-xs)]">
        <Chip>{kindLabels[item.kind]}</Chip>
        <Chip>{statusLabels[item.status]}</Chip>
        {item.estimatedMinutes ? <Chip>{itemCopy.minutes(item.estimatedMinutes)}</Chip> : null}
        {done ? <Chip selected>{itemCopy.done}</Chip> : null}
      </div>
    </>
  );

  if (locked) {
    return (
      <AppContainer width="reading">
        {header}
        <LockedItem block={block} item={item} />
        <ItemPager previous={previous} next={next} />
      </AppContainer>
    );
  }

  return (
    <AppContainer width="reading">
      {header}
      <div className="grid gap-[var(--space-lg)]">
        <EmptyState
          title={comingSoon ? itemCopy.comingSoon.title : itemCopy.pending.title}
          body={comingSoon ? itemCopy.comingSoon.body : itemCopy.pending.body}
        />

        {item.extras?.length ? (
          <section aria-labelledby="item-extras" className="grid gap-[var(--space-sm)]">
            <h2 id="item-extras" className="font-heading text-lg leading-tight text-text-primary">
              {itemCopy.extrasHeading}
            </h2>
            <ul className="flex flex-wrap gap-[var(--space-sm)]">
              {item.extras.map((extra) => (
                <li key={extra.label} className="flex items-center gap-[var(--space-xs)] text-text-primary">
                  {extra.label}
                  <Chip>{statusLabels[extra.status]}</Chip>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* A coming-soon step cannot be finished, so it offers Next instead. */}
        {comingSoon ? null : <MarkDoneButton blockSlug={block.slug} itemSlug={item.slug} done={done} />}
      </div>
      <ItemPager previous={previous} next={next} />
    </AppContainer>
  );
}
