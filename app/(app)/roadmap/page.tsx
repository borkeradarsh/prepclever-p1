// /roadmap: the six blocks as a connected flow, each with its tier, status and
// progress. States: loading (loading.tsx, same card heights), error (the app
// error boundary), first-run (nothing started: "Start with Block 1"),
// populated, and empty (no blocks configured).

import type { Metadata } from "next";
import Link from "next/link";
import { AppContainer } from "@/components/layout/app/AppContainer";
import { PageHeader } from "@/components/layout/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { primaryLink } from "@/components/ui/link-styles";
import { firstItem } from "@/content/blocks.config";
import { roadmapCopy } from "@/content/roadmap.config";
import { RoadmapFlow } from "@/features/roadmap/RoadmapFlow";
import { getBlocks } from "@/lib/data";
import { routes } from "@/lib/routes";
import type { BlockView } from "@/types/domain";

export const metadata: Metadata = { title: `${roadmapCopy.title} · PrepClever` };

/** The page's one next action: Block 1 on a first visit, else the first unfinished block. */
function nextAction(blocks: BlockView[]): { label: string; href: string } | null {
  if (blocks.every((block) => block.progress.state === "not_started")) {
    return { label: roadmapCopy.startFirst, href: routes.blockItem(firstItem.block, firstItem.item) };
  }
  const open = blocks.find((block) => block.status === "available" && block.progress.state !== "done");
  return open ? { label: roadmapCopy.continueBlock(open.order), href: routes.block(open.slug) } : null;
}

export default async function RoadmapPage() {
  const blocks = await getBlocks();
  const action = blocks.length > 0 ? nextAction(blocks) : null;

  return (
    <AppContainer>
      <PageHeader
        title={roadmapCopy.title}
        subtext={roadmapCopy.subtext}
        action={
          action ? (
            <Link href={action.href} className={primaryLink}>
              {action.label}
            </Link>
          ) : null
        }
      />
      {blocks.length === 0 ? (
        <EmptyState title={roadmapCopy.emptyTitle} body={roadmapCopy.emptyBody} />
      ) : (
        <>
          {action ? null : <p className="mb-[var(--space-md)] text-text-subtle">{roadmapCopy.allDone}</p>}
          <div className="pb-[var(--space-xl)]">
            <RoadmapFlow blocks={blocks} />
          </div>
        </>
      )}
    </AppContainer>
  );
}
