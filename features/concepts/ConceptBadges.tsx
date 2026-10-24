import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { textLink } from "@/components/ui/link-styles";
import { levelLabels } from "@/content/concepts";
import { conceptCopy, ratingLabels } from "@/content/roadmap.config";
import { routes } from "@/lib/routes";
import type { Level, Rating } from "@/types/domain";

/** Core, Good to know, or outside the user's role. */
export function LevelChip({ level }: { level: Level }) {
  return <Chip selected={level === 2}>{level === 0 ? conceptCopy.outsideRole : levelLabels[level]}</Chip>;
}

/** The user's own audit rating, with the way to change it. */
export function RatingLine({ rating, rated }: { rating: Rating; rated: boolean }) {
  return (
    <p className="flex flex-wrap items-center gap-x-[var(--space-sm)] gap-y-[var(--space-xs)] text-text-subtle">
      <span>
        {conceptCopy.ratingPrefix}{" "}
        <span className="font-medium text-text-primary">{rated ? ratingLabels[rating] : conceptCopy.notRated}</span>
      </span>
      <Link href={routes.skillAudit} className={`${textLink} inline-flex min-h-11 items-center`}>
        {conceptCopy.changeRating}
      </Link>
    </p>
  );
}
