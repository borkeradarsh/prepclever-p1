import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { dashboardCopy } from "@/content/dashboard.config";
import { RolesScroller } from "@/features/home/RolesScroller";
import { getRoleOverviews } from "@/lib/data";

const copy = dashboardCopy.roles;

export async function RolesSection() {
  const roles = await getRoleOverviews();
  if (roles.length === 0) return <EmptyState title={copy.emptyTitle} body={copy.emptyBody} />;
  return <RolesScroller roles={roles} />;
}

/** Same card width and arrow row as the loaded scroller. */
export function RolesSkeleton() {
  return (
    <div role="status" aria-label={dashboardCopy.states.loadingLabel} className="grid gap-[var(--space-sm)]">
      <div aria-hidden="true" className="flex justify-end gap-[var(--space-xs)]">
        <Skeleton width="2.75rem" height="2.75rem" radius="pill" />
        <Skeleton width="2.75rem" height="2.75rem" radius="pill" />
      </div>
      <div aria-hidden="true" className="flex gap-[var(--space-md)] overflow-hidden pb-[var(--space-sm)]">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="grid w-[var(--role-card-width)] shrink-0 content-start gap-[var(--space-sm)] rounded-[var(--radius-soft-lg)] border border-border-soft p-[var(--space-md)]"
          >
            <Skeleton width="5rem" height="1.6rem" radius="pill" />
            <Skeleton width="70%" height="1.3rem" />
            <Skeleton height="3.2rem" />
            <Skeleton width="60%" height="0.8rem" />
            <Skeleton height="2.75rem" />
            <Skeleton width="50%" height="2.75rem" />
          </div>
        ))}
      </div>
    </div>
  );
}
