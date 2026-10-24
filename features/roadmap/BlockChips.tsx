import { Lock } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { tierLabels } from "@/content/blocks.config";
import { blockStateLabels, roadmapCopy } from "@/content/roadmap.config";
import type { BlockView } from "@/types/domain";

/** Tier, then status: Coming soon wins over progress, since it can't be started. */
export function BlockChips({ block }: { block: BlockView }) {
  return (
    <span className="flex flex-wrap items-center gap-[var(--space-xs)]">
      <Chip selected={block.tier === "paid"}>
        {block.locked ? <Lock size={12} strokeWidth={2} aria-hidden="true" /> : null}
        {tierLabels[block.tier]}
      </Chip>
      <Chip>{block.status === "coming_soon" ? roadmapCopy.comingSoon : blockStateLabels[block.progress.state]}</Chip>
    </span>
  );
}
