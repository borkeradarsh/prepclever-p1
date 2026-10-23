"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { marketingNav, marketingNavCopy } from "@/content/marketing-nav.config";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  // A mouse entering a trigger opens its menu, so the click that follows must
  // not toggle it straight back shut. Only a menu opened by click or keyboard
  // closes on a second press.
  const openedByHover = useRef(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 72);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  // A pointer press anywhere outside the bar closes whatever is open.
  useEffect(() => {
    if (!openMenu && !menuOpen) return;
    const close = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [openMenu, menuOpen]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    setOpenMenu(null);
    setMenuOpen(false);
  };

  return (
    <header
      ref={navRef}
      className={`navbar-shell ${scrolled ? "navbar-shell-scrolled" : "navbar-shell-hero"}`}
      onKeyDown={handleKeyDown}
    >
      <nav className="marketing-nav" aria-label={marketingNavCopy.primaryNavLabel}>
        <Link className="marketing-nav-brand" href="/" aria-label={marketingNavCopy.brandAriaLabel}>
          {marketingNavCopy.brand}
        </Link>

        <ul className="marketing-nav-list">
          {marketingNav.map((item) =>
            item.kind === "link" ? (
              <li key={item.label}>
                <Link className="marketing-nav-link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li
                key={item.id}
                className="marketing-nav-menu"
                onMouseEnter={() => {
                  openedByHover.current = true;
                  setOpenMenu(item.id);
                }}
                onMouseLeave={() => setOpenMenu((current) => (current === item.id ? null : current))}
              >
                <button
                  className="marketing-nav-link marketing-nav-trigger"
                  type="button"
                  aria-expanded={openMenu === item.id}
                  aria-controls={`nav-menu-${item.id}`}
                  onClick={() => {
                    setOpenMenu((current) => {
                      if (current !== item.id) return item.id;
                      return openedByHover.current ? current : null;
                    });
                    openedByHover.current = false;
                  }}
                >
                  {item.label}
                  <ChevronDown
                    className={openMenu === item.id ? "is-open" : ""}
                    size={13}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className="marketing-nav-panel"
                  id={`nav-menu-${item.id}`}
                  hidden={openMenu !== item.id}
                >
                  <ul>
                    {item.items.map((entry) => (
                      <li key={entry.href}>
                        <Link href={entry.href} onClick={() => setOpenMenu(null)}>
                          <span className="marketing-nav-panel-label">{entry.label}</span>
                          {entry.description ? (
                            <span className="marketing-nav-panel-detail">{entry.description}</span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ),
          )}
        </ul>

        <div className="marketing-nav-actions">
          <Link className="marketing-nav-link" href={marketingNavCopy.login.href}>
            {marketingNavCopy.login.label}
          </Link>
          <Link className="marketing-nav-cta" href={marketingNavCopy.getStarted.href}>
            {marketingNavCopy.getStarted.label}
          </Link>
        </div>

        <button
          className="marketing-nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? marketingNavCopy.closeMenu : marketingNavCopy.openMenu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
        </button>
      </nav>

      <div className="marketing-nav-sheet" id="mobile-navigation" hidden={!menuOpen}>
        {marketingNav.map((item) =>
          item.kind === "link" ? (
            <Link
              className="marketing-nav-sheet-link"
              href={item.href}
              key={item.label}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ) : (
            <div className="marketing-nav-sheet-group" key={item.id}>
              <p className="marketing-nav-sheet-title">{item.label}</p>
              {item.items.map((entry) => (
                <Link
                  className="marketing-nav-sheet-link"
                  href={entry.href}
                  key={entry.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          ),
        )}
        <div className="marketing-nav-sheet-actions">
          <Link
            className="marketing-nav-sheet-login"
            href={marketingNavCopy.login.href}
            onClick={() => setMenuOpen(false)}
          >
            {marketingNavCopy.login.label}
          </Link>
          <Link
            className="marketing-nav-cta"
            href={marketingNavCopy.getStarted.href}
            onClick={() => setMenuOpen(false)}
          >
            {marketingNavCopy.getStarted.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
