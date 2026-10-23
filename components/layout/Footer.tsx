import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerCopy, footerNav, marketingNavCopy } from "@/content/marketing-nav.config";

export function Footer() {
  return (
    <footer>
      <Container className="grid gap-[var(--space-xl)] py-[clamp(3.5rem,7vw,6rem)] sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <p className="font-[Formula] text-xl font-extrabold tracking-[-0.1em]">
            {marketingNavCopy.brand}
          </p>
          <p className="mt-[var(--space-sm)] max-w-[18rem] text-[length:var(--font-size-small)] text-text-muted">
            {footerCopy.tagline}
          </p>
        </div>
        {footerNav.map((column) => (
          <div key={column.title}>
            <h2 className="text-[length:var(--font-size-small)] font-semibold uppercase tracking-[0.12em]">
              {column.title}
            </h2>
            <ul className="mt-[var(--space-sm)] space-y-[var(--space-xs)]">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}-${link.label}`}>
                  <Link
                    className="inline-flex min-h-7 items-center text-[length:var(--font-size-small)] text-text-muted hover:text-text-primary"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-wrap justify-between gap-[var(--space-sm)] py-[var(--space-md)] text-[length:var(--font-size-small)] text-text-muted">
          <span>{footerCopy.copyright}</span>
          <span>{footerCopy.legal}</span>
        </Container>
      </div>
    </footer>
  );
}
