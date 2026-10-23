"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { navCopy } from "@/content/nav.config";
import { authEnabled } from "@/lib/auth/config";
import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase/client";

type UserMenuProps = { firstName: string | null };

export function UserMenu({ firstName }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape or an outside click, returning focus to the trigger.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const signOut = async () => {
    // TODO(auth): with auth disabled there is no session to end, so this just
    // returns to the marketing page.
    if (authEnabled && supabase) await supabase.auth.signOut();
    window.location.assign("/");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={navCopy.userMenuLabel}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-[var(--space-xs)] rounded-[var(--radius-pill)] border border-border-soft px-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-primary transition-colors duration-200 ease-out hover:border-border-strong"
      >
        <Avatar name={firstName} />
        <span className="hidden sm:inline">{firstName ?? navCopy.profile}</span>
        <ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={navCopy.userMenuLabel}
          className="absolute right-0 top-[calc(100%+var(--space-xs))] z-50 grid w-44 gap-px overflow-hidden rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-card p-[var(--space-xs)] shadow-soft-raised"
        >
          <Link
            role="menuitem"
            href={routes.profile}
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center rounded-[var(--radius-soft-sm)] px-[var(--space-sm)] text-text-primary hover:bg-brand-soft/40"
          >
            {navCopy.profile}
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={signOut}
            className="flex min-h-11 items-center rounded-[var(--radius-soft-sm)] px-[var(--space-sm)] text-left text-text-primary hover:bg-brand-soft/40"
          >
            {navCopy.signOut}
          </button>
        </div>
      ) : null}
    </div>
  );
}
