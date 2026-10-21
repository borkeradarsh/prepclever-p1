import { topViewportData } from "@/lib/placeholder-data";

export function AnnouncementBar() {
  const items = topViewportData.announcementItems;

  const renderItems = (group: string) => (
    <div className="announcement-group flex shrink-0" aria-hidden={group === "duplicate"}>
      {items.map((item, index) => (
        <span className="mx-[var(--space-lg)] inline-flex shrink-0 items-center gap-[var(--space-sm)]" key={`${group}-${item}-${index}`}>
          <span className="size-1 rounded-full bg-brand" aria-hidden="true" />
          {item}
          <span aria-hidden="true">→</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="announcement-bar overflow-hidden border-b border-border bg-surface-muted text-[length:var(--font-size-small)] text-text-primary">
      <div className="announcement-track flex w-max whitespace-nowrap py-[var(--space-sm)]">
        {renderItems("primary")}
        {renderItems("duplicate")}
      </div>
    </div>
  );
}
