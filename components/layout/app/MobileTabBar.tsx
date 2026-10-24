"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navCopy, tabNav } from "@/content/nav.config";
import { isActivePath } from "@/lib/nav";

/** Replaces the sidebar under 1024px. Profile is in the user menu there. */
export function MobileTabBar() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label={navCopy.tabBarLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-surface-card pb-[env(safe-area-inset-bottom,0px)] backdrop-blur lg:hidden"
    >
      {/* One equal column per nav item, so adding a tab needs no change here. */}
      <ul className="grid auto-cols-fr grid-flow-col">
        {tabNav.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[var(--app-tabbar-height)] flex-col items-center justify-center gap-0.5 text-[length:var(--font-size-small)] ${active ? "text-text-primary" : "text-text-subtle"}`}
              >
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                {item.label}
                {/* Always rendered, so the icon never shifts between tabs. */}
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-5 rounded-[var(--radius-pill)] ${active ? "bg-brand" : "bg-transparent"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
