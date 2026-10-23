import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MobileTabBar } from "@/components/layout/app/MobileTabBar";
import { NavLink } from "@/components/layout/app/NavLink";
import { UserMenu } from "@/components/layout/app/UserMenu";
import { appNav, navCopy } from "@/content/nav.config";
import { dashboardCopy } from "@/content/dashboard.config";
import { routes } from "@/lib/routes";
import type { User } from "@/types/domain";

type AppTopBarProps = {
  /** Null when the user could not be loaded: the shell still renders. */
  user: User | null;
};

// No display utility here on purpose: `hidden` and `inline-flex` are both
// unprefixed display rules, and Tailwind's emission order would let inline-flex
// win over hidden no matter how the classes are ordered. The caller supplies the
// display utility instead.
const upgradeButton =
  "min-h-11 items-center justify-center rounded-[var(--radius-soft-sm)] border border-button-primary bg-button-primary px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium text-button-primary-text transition-colors duration-200 ease-out hover:bg-text-muted";

export function AppTopBar({ user }: AppTopBarProps) {
  const isPro = user?.plan === "pro";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border-soft bg-surface-card backdrop-blur">
        <div className="mx-auto flex min-h-[var(--app-nav-height)] w-full max-w-[var(--app-max-width)] items-center gap-[var(--space-lg)] px-4 md:px-8">
          <Link
            href={routes.dashboard}
            aria-label={navCopy.brandAriaLabel}
            className="font-heading text-lg font-extrabold tracking-[-0.08em] text-text-primary"
          >
            {navCopy.brand}
          </Link>

          <nav
            aria-label={navCopy.primaryNavLabel}
            className="hidden flex-1 items-center gap-[var(--space-lg)] md:flex"
          >
            {appNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-[var(--space-sm)] md:ml-0">
            {user ? (
              <span className="hidden md:contents">
                <Badge>
                  {isPro ? dashboardCopy.greeting.planPro : dashboardCopy.greeting.planFree}
                </Badge>
              </span>
            ) : null}
            {user && !isPro ? (
              <Link href={routes.upgrade} className={`${upgradeButton} hidden md:inline-flex`}>
                {navCopy.upgrade}
              </Link>
            ) : null}
            <UserMenu firstName={user?.firstName ?? null} />
          </div>
        </div>
      </header>
      <MobileTabBar />
    </>
  );
}
