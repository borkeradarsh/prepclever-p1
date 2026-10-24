// /explore: everything beyond the user's own roadmap. Cards whose page does not
// exist yet carry a Coming soon chip and are not links.

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { exploreCards, exploreCopy, type ExploreCard } from "@/content/explore.config";

export const metadata: Metadata = { title: `${exploreCopy.title} · PrepClever` };

const card =
  "flex h-full flex-col gap-[var(--space-sm)] rounded-[var(--radius-soft-lg)] border border-border-soft p-[var(--space-lg)]";

function CardBody({ item }: { item: ExploreCard }) {
  return (
    <>
      <span className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <h2 className="font-heading text-lg leading-tight text-text-primary">{item.title}</h2>
        {item.href ? null : <Chip>{exploreCopy.comingSoon}</Chip>}
      </span>
      <p className="text-text-subtle">{item.description}</p>
      {item.href ? (
        <span className="mt-auto inline-flex items-center gap-[var(--space-xs)] pt-[var(--space-sm)] text-[length:var(--font-size-small)] font-medium text-accent-ink">
          {exploreCopy.open}
          <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
        </span>
      ) : null}
    </>
  );
}

export default function ExplorePage() {
  return (
    <AppContainer>
      <PageHeader title={exploreCopy.title} subtext={exploreCopy.subtext} />
      <ul className="grid auto-rows-fr gap-[var(--space-md)] pb-[var(--space-xl)] sm:grid-cols-2 lg:grid-cols-3">
        {exploreCards.map((item) => (
          <li key={item.id}>
            {item.href ? (
              <Link
                href={item.href}
                className={`${card} bg-surface-card shadow-soft transition-[box-shadow,border-color] duration-200 ease-out hover:border-border-soft-strong hover:shadow-soft-hover motion-reduce:transition-none`}
              >
                <CardBody item={item} />
              </Link>
            ) : (
              <div className={`${card} bg-surface-muted/50`}>
                <CardBody item={item} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </AppContainer>
  );
}
