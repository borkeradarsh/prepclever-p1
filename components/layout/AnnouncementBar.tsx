import { tickerMetrics } from "@/content/landing.config";

export function AnnouncementBar() {
  // The track is duplicated so the marquee loops with no visible seam. Only the
  // first copy is announced; the second is decorative.
  const renderGroup = (group: "primary" | "duplicate") => (
    <div className="announcement-group flex shrink-0" aria-hidden={group === "duplicate"}>
      {tickerMetrics.map((metric) => (
        <span
          className="mx-[var(--space-lg)] inline-flex shrink-0 items-center gap-[var(--space-sm)]"
          key={`${group}-${metric.label}`}
        >
          <span className="size-1 rounded-full bg-brand" aria-hidden="true" />
          <strong className="font-semibold">{metric.value}</strong>
          {metric.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="announcement-bar overflow-hidden border-b border-border bg-surface-muted text-[length:var(--font-size-small)] text-text-primary">
      <div className="announcement-track flex w-max whitespace-nowrap py-[var(--space-sm)]">
        {renderGroup("primary")}
        {renderGroup("duplicate")}
      </div>
    </div>
  );
}
