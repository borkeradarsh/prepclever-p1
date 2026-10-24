import Link from "next/link";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { ProgressBar } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";
import { primaryLink, textLink } from "@/components/ui/link-styles";
import { firstItem } from "@/content/blocks.config";
import { dashboardCopy } from "@/content/dashboard.config";
import { getHomeSummary } from "@/lib/data";
import { routes } from "@/lib/routes";

const copy = dashboardCopy.metrics;

/** Shared by the tiles, their skeletons and the widget's error state. */
export const tileFrame =
  "grid min-h-[var(--home-tile-min-height)] content-start gap-[var(--space-xs)] rounded-[var(--radius-soft-lg)] border border-border-soft bg-surface-card p-[var(--space-md)] shadow-soft";
export const tileGrid = "grid auto-rows-fr gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-4";

function Tile({ label, title, body, children, accent = false }: { label: string; title: ReactNode; body?: ReactNode; children?: ReactNode; accent?: boolean }) {
  return (
    <li className={`${tileFrame} ${accent ? "border-t-[3px] border-t-brand" : ""}`}>
      <p className="text-[length:var(--font-size-small)] font-medium uppercase tracking-[0.06em] text-text-subtle">{label}</p>
      <p className="font-heading text-lg leading-tight text-text-primary">{title}</p>
      {body ? <div className="text-[length:var(--font-size-small)] text-text-subtle">{body}</div> : null}
      {children ? <div className="mt-auto flex flex-wrap items-center gap-x-[var(--space-md)] pt-[var(--space-xs)]">{children}</div> : null}
    </li>
  );
}

const tileLink = `${textLink} inline-flex min-h-11 items-center text-[length:var(--font-size-small)]`;

/**
 * Four tiles: what you last studied, what's next, roadmap progress and skill
 * readiness. First-run shows each tile's starting point instead of zeros.
 * The Next tile carries the page's one upgrade action when it is locked.
 */
export async function MetricsRow() {
  const summary = await getHomeSummary();
  const { lastStudied, next, roadmap, readiness } = summary;
  const percent = (value: number) => Math.round(value * 100);

  return (
    <ul aria-label={copy.label} className={tileGrid}>
      {lastStudied ? (
        <Tile label={copy.lastStudied.label} title={lastStudied.title} body={lastStudied.context} accent>
          <Link href={lastStudied.href} className={tileLink}>
            {copy.lastStudied.action}
          </Link>
        </Tile>
      ) : (
        <Tile label={copy.lastStudied.label} title={copy.lastStudied.firstRunTitle} body={copy.lastStudied.firstRunBody} accent>
          <Link href={routes.blockItem(firstItem.block, firstItem.item)} className={primaryLink}>
            {copy.lastStudied.firstRunAction}
          </Link>
        </Tile>
      )}

      {next ? (
        <Tile
          label={copy.next.label}
          title={next.title}
          body={
            next.locked ? (
              <span className="inline-flex items-center gap-[var(--space-xs)]">
                <Lock size={13} strokeWidth={1.8} aria-hidden="true" />
                {copy.next.lockedNote}
              </span>
            ) : null
          }
        >
          {next.locked ? (
            <Link href={routes.upgradeFrom("continue-card", next.href)} className={primaryLink}>
              {copy.next.lockedAction}
            </Link>
          ) : (
            <Link href={next.href} className={primaryLink}>
              {copy.next.action}
            </Link>
          )}
        </Tile>
      ) : (
        <Tile label={copy.next.label} title={copy.next.doneTitle} body={copy.next.doneBody}>
          <Link href={routes.roadmap} className={tileLink}>
            {copy.next.doneAction}
          </Link>
        </Tile>
      )}

      <Tile
        label={copy.roadmap.label}
        title={roadmap.total > 0 ? copy.roadmap.value(roadmap.done, roadmap.total) : "—"}
        body={
          roadmap.total > 0 ? (
            <div className="grid gap-[var(--space-xs)]">
              <span>{copy.roadmap.body}</span>
              <ProgressBar value={roadmap.done} max={roadmap.total} label={copy.roadmap.bar} />
            </div>
          ) : (
            copy.roadmap.emptyBody
          )
        }
      >
        <Link href={routes.roadmap} className={tileLink}>
          {copy.roadmap.action}
        </Link>
      </Tile>

      {readiness === null ? (
        <Tile label={copy.readiness.label} title={copy.readiness.firstRunTitle} body={copy.readiness.firstRunBody}>
          <Link href={routes.skillAudit} className={tileLink}>
            {copy.readiness.firstRunAction}
          </Link>
          <Link href={routes.conceptMap} className={tileLink}>
            {copy.readiness.mapAction}
          </Link>
        </Tile>
      ) : (
        <Tile
          label={copy.readiness.label}
          title={copy.readiness.value(percent(readiness))}
          body={
            <div className="grid gap-[var(--space-xs)]">
              <span>{copy.readiness.body}</span>
              <ProgressBar value={percent(readiness)} max={100} label={copy.readiness.bar} />
            </div>
          }
        >
          <Link href={routes.gapReport} className={tileLink}>
            {copy.readiness.action}
          </Link>
          <Link href={routes.conceptMap} className={tileLink}>
            {copy.readiness.mapAction}
          </Link>
        </Tile>
      )}
    </ul>
  );
}

export function MetricsRowSkeleton() {
  return (
    <div role="status" aria-label={dashboardCopy.states.loadingLabel}>
      <ul aria-hidden="true" className={tileGrid}>
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className={tileFrame}>
            <Skeleton width="6rem" height="0.7rem" />
            <Skeleton width="70%" height="1.3rem" />
            <Skeleton width="85%" height="0.8rem" />
            <Skeleton width="7rem" height="2.75rem" className="mt-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}
