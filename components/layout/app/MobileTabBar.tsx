"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNav, navCopy } from "@/content/nav.config";

/** Replaces the top-bar links under 768px, per the build spec's mobile rule. */
export function MobileTabBar() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label={navCopy.tabBarLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-surface-card pb-[env(safe-area-inset-bottom,0px)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {appNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[var(--app-tabbar-height)] flex-col items-center justify-center gap-0.5 text-[length:var(--font-size-small)] ${active ? "text-text-primary" : "text-text-subtle"}`}
              >
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                {item.tabLabel}
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
