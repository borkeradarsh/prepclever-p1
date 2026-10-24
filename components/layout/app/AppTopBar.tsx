import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MobileNavDrawer } from "@/components/layout/app/MobileNavDrawer";
import { Breadcrumb, UpgradeButton } from "@/components/layout/app/TopBarClient";
import { UserMenu } from "@/components/layout/app/UserMenu";
import { navCopy } from "@/content/nav.config";
import type { ShellData } from "@/lib/nav";
import { routes } from "@/lib/routes";

/**
 * The slim top bar: breadcrumb, plan badge, Upgrade for free users, user menu.
 * Navigation itself lives in the sidebar; under 1024px the menu button opens
 * it as a drawer and the bottom tab bar takes the main sections.
 */
export function AppTopBar({ data }: { data: ShellData }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-surface-card backdrop-blur">
      <div className="flex min-h-[var(--app-nav-height)] w-full items-center gap-[var(--space-sm)] px-4 md:px-8">
        <MobileNavDrawer data={data} />
        <Link
          href={routes.dashboard}
          aria-label={navCopy.brandAriaLabel}
          className="shrink-0 font-heading text-lg font-extrabold tracking-[-0.08em] text-text-primary lg:hidden"
        >
          {navCopy.brand}
        </Link>

        <Breadcrumb blocks={data.blocks} className="hidden flex-1 lg:block" />

        <div className="ml-auto flex shrink-0 items-center gap-[var(--space-sm)]">
          {data.plan ? (
            <span className="hidden sm:contents">
              <Badge>{data.plan === "pro" ? navCopy.planPro : navCopy.planFree}</Badge>
            </span>
          ) : null}
          {data.plan === "free" ? <UpgradeButton /> : null}
          <UserMenu firstName={data.firstName} />
        </div>
      </div>
    </header>
  );
}
