"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = { href: string; label: string };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Top-bar link. The active one carries the rose accent underline. */
export function NavLink({ href, label }: NavLinkProps) {
  const active = isActive(usePathname() ?? "", href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative inline-flex min-h-11 items-center text-[length:var(--font-size-small)] transition-colors duration-200 ease-out ${active ? "text-text-primary" : "text-text-subtle hover:text-text-primary"}`}
    >
      {label}
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-0.5 rounded-[var(--radius-pill)] bg-brand"
        />
      ) : null}
    </Link>
  );
}
