import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { closingCta } from "@/content/landing.config";

export function ClosingCta() {
  return (
    <section className="closing-cta border-b border-border">
      <Container className="closing-cta-inner">
        <div>
          <h2 className="section-title">{closingCta.title}</h2>
          <p className="section-lede">{closingCta.description}</p>
          <div className="mt-[var(--space-lg)] flex flex-wrap items-center gap-[var(--space-sm)]">
            <Link className="cta-primary" href={closingCta.primaryAction.href}>
              {closingCta.primaryAction.label}
              <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link className="cta-secondary" href={closingCta.secondaryAction.href}>
              {closingCta.secondaryAction.label}
            </Link>
          </div>
        </div>
        <aside className="closing-cta-aside">
          <h3>{closingCta.aside.title}</h3>
          <p>{closingCta.aside.description}</p>
          <Link className="closing-cta-aside-link" href={closingCta.aside.action.href}>
            {closingCta.aside.action.label}
            <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </aside>
      </Container>
    </section>
  );
}
