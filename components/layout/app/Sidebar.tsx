"use client";

import Link from "next/link";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarContent } from "@/components/layout/app/SidebarContent";
import { navCopy } from "@/content/nav.config";
import type { ShellData } from "@/lib/nav";
import { routes } from "@/lib/routes";
import { serializeSidebarCookie, type SidebarState } from "@/lib/sidebar-cookie";

type SidebarProps = {
  data: ShellData;
  /** Read from the cookie on the server, so the first paint has the right width. */
  initialState: SidebarState;
};

/**
 * The desktop sidebar, from 1024px: 280px expanded, 72px collapsed. It scrolls
 * on its own and stays put while the page scrolls. Below 1024px the same
 * content opens in MobileNavDrawer instead.
 */
export function Sidebar({ data, initialState }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(initialState === "collapsed");

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = serializeSidebarCookie(next ? "collapsed" : "expanded");
  };

  return (
    <aside
      className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border-soft bg-surface-card transition-[width] duration-200 ease-out motion-reduce:transition-none lg:flex ${collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]"}`}
    >
      <div
        className={`flex min-h-[var(--app-nav-height)] shrink-0 items-center border-b border-border-soft ${collapsed ? "justify-center" : "px-[var(--space-md)]"}`}
      >
        <Link
          href={routes.dashboard}
          aria-label={navCopy.brandAriaLabel}
          className="font-heading text-lg font-extrabold tracking-[-0.08em] text-text-primary"
        >
          {collapsed ? navCopy.brandShort : navCopy.brand}
        </Link>
      </div>

      <div id="app-sidebar-content" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[var(--space-sm)]">
        <SidebarContent data={data} collapsed={collapsed} />
      </div>

      <div className={`shrink-0 border-t border-border-soft p-[var(--space-sm)] ${collapsed ? "grid justify-items-center" : ""}`}>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar-content"
          aria-label={collapsed ? navCopy.expand : navCopy.collapse}
          title={collapsed ? navCopy.expand : navCopy.collapse}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-[var(--space-sm)] rounded-[var(--radius-soft-sm)] px-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-subtle transition-colors duration-150 ease-out hover:bg-brand-soft/40 hover:text-text-primary motion-reduce:transition-none"
        >
          {collapsed ? (
            <PanelLeftOpen size={16} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose size={16} strokeWidth={1.8} aria-hidden="true" />
              <span aria-hidden="true">{navCopy.collapse}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
