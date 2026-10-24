// Items that already have a real page body. Everything else shows "Content is
// being added" until Session C writes its guide. Each body loads its own data
// and is only rendered once the item page has passed its access check.

import type { ComponentType } from "react";
import { ConceptMapSection } from "@/features/concept-map/ConceptMapSection";
import { GapReportSection } from "@/features/gap/GapReportSection";
import { SkillAuditSection } from "@/features/gap/SkillAuditSection";
import { itemKey } from "@/lib/progress";
import type { BlockId } from "@/types/domain";

export type ItemBody = {
  Body: ComponentType;
  /** The concept map needs the full app width; text pages keep the reading width. */
  width: "app" | "reading";
};

const bodies: Record<string, ItemBody> = {
  [itemKey("gap-analysis", "skill-audit")]: { Body: SkillAuditSection, width: "reading" },
  [itemKey("gap-analysis", "gap-report")]: { Body: GapReportSection, width: "reading" },
  [itemKey("upskilling", "concept-map")]: { Body: ConceptMapSection, width: "app" },
};

export function itemBody(blockId: BlockId, itemSlug: string): ItemBody | null {
  return bodies[itemKey(blockId, itemSlug)] ?? null;
}
