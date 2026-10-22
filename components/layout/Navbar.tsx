"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { topViewportData } from "@/lib/placeholder-data";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 72);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header className={`navbar-shell ${scrolled ? "navbar-shell-scrolled" : "navbar-shell-hero"}`}>
      <nav className="relative mx-auto grid min-h-20 w-full max-w-[72rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-10 px-[var(--container-padding)]" aria-label="Main navigation">
        <div className="hidden items-center justify-self-end gap-4 md:flex">
          {topViewportData.navItems.slice(0, 3).map((item) => (
            <Link className="whitespace-nowrap text-sm text-text-primary hover:text-text-muted" href={item === "Log in" ? "/login" : "#"} key={item}>
              {item}
            </Link>
          ))}
        </div>
        <Link className="absolute left-[var(--container-padding)] whitespace-nowrap font-[Formula] text-xl font-extrabold tracking-[-0.1em] text-text-primary md:static md:col-start-2 md:justify-self-center" href="/" aria-label={topViewportData.brand}>
          {topViewportData.brand}
        </Link>
        <div className="hidden items-center justify-self-start gap-4 md:flex">
          {topViewportData.navItems.slice(3).map((item) => (
            <Link className="whitespace-nowrap text-sm text-text-primary hover:text-text-muted" href={item === "Log in" ? "/login" : "#"} key={item}>
              {item}
            </Link>
          ))}
          <Link className="inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-[var(--radius-button)] border border-button-primary bg-button-primary px-3 text-xs font-medium text-button-primary-text hover:bg-text-muted" href="/signup">Get started</Link>
        </div>
        <button
          className="absolute right-[var(--container-padding)] inline-flex size-11 items-center justify-center rounded-[var(--radius-button)] border border-border text-lg md:hidden"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
        </button>
      </nav>
      {menuOpen ? (
        <div id="mobile-navigation" className="border-t border-border bg-surface px-[var(--container-padding)] py-[var(--space-md)] md:hidden">
          <div className="flex flex-col gap-[var(--space-sm)]">
            {topViewportData.navItems.map((item) => (
              <Link className="min-h-11 border-b border-border py-[var(--space-sm)] text-text-primary" href={item === "Log in" ? "/login" : "#"} key={item}>
                {item}
              </Link>
            ))}
            <Link className="mt-[var(--space-sm)] inline-flex min-h-9 w-full items-center justify-center rounded-[var(--radius-button)] border border-button-primary bg-button-primary px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium text-button-primary-text hover:bg-text-muted" href="/signup">{topViewportData.primaryAction}</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
