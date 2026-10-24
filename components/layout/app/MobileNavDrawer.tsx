"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { ListTree, Menu, X } from "lucide-react";
import { SidebarContent } from "@/components/layout/app/SidebarContent";
import { navCopy } from "@/content/nav.config";
import { sidebarContext, type ShellData } from "@/lib/nav";
import { routes } from "@/lib/routes";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Under 1024px the sidebar opens as a drawer: a modal dialog, so the page
 * behind is inert. Tab and Shift+Tab are kept inside it, Escape and the
 * backdrop close it, and focus returns to the button that opened it. Inside a
 * block the button reads "Contents", since that is what the drawer shows.
 */
export function MobileNavDrawer({ data }: { data: ShellData }) {
  const pathname = usePathname() ?? "";
  // Open on a given pathname: any route change, including following a link in
  // the drawer, closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inBlock = sidebarContext(pathname, data.blocks).kind === "block";
  const label = inBlock ? navCopy.contents : navCopy.menu;

  const close = useCallback(() => setOpenOn(null), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }
    if (!open && dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
  }, [open]);

  const trapTab = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="app-nav-drawer"
        onClick={() => setOpenOn(pathname)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-[var(--space-xs)] rounded-[var(--radius-soft-sm)] border border-border-soft px-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-primary transition-colors duration-150 ease-out hover:border-border-strong motion-reduce:transition-none lg:hidden"
      >
        {inBlock ? (
          <ListTree size={16} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <Menu size={16} strokeWidth={1.8} aria-hidden="true" />
        )}
        {/* "Contents" is worth the width inside a block; elsewhere the icon is enough. */}
        <span className={inBlock ? undefined : "sr-only"}>{label}</span>
      </button>

      <dialog
        ref={dialogRef}
        id="app-nav-drawer"
        aria-label={label}
        onClose={close}
        onKeyDown={trapTab}
        // A click on the dialog itself, not its content, is a click on the backdrop.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[var(--drawer-width)] max-w-none border-0 border-r border-border-soft bg-surface-card p-0 text-text-primary shadow-soft-raised backdrop:bg-text-primary/30 lg:hidden"
      >
        {open ? (
          <div className="flex h-full flex-col">
            <div className="flex min-h-[var(--app-nav-height)] shrink-0 items-center justify-between gap-[var(--space-sm)] border-b border-border-soft px-[var(--space-md)]">
              <Link
                href={routes.dashboard}
                onClick={close}
                aria-label={navCopy.brandAriaLabel}
                className="font-heading text-lg font-extrabold tracking-[-0.08em] text-text-primary"
              >
                {navCopy.brand}
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label={navCopy.closeMenu}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-soft-sm)] text-text-subtle hover:bg-brand-soft/40 hover:text-text-primary"
              >
                <X size={18} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[var(--space-sm)]">
              <SidebarContent data={data} collapsed={false} onNavigate={close} />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
