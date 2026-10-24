import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { hero } from "@/content/landing.config";

export function Hero() {
  return (
    <section className="hero-grid border-b border-border">
      <Container className="flex flex-col items-center pb-[clamp(4rem,9vw,7rem)] pt-[clamp(7rem,12vw,10rem)] text-center">
        <h1 className="hero-title max-w-4xl font-[Formula] text-[length:var(--font-size-h1)] font-semibold leading-[var(--line-height-h1)] tracking-[-0.055em] text-text-primary">
          {hero.title}
        </h1>
        <p className="mt-[var(--space-lg)] max-w-xl text-balance text-base leading-relaxed text-text-muted">
          {hero.description}
        </p>
        <div className="mt-[var(--space-xl)] flex flex-wrap items-center justify-center gap-[var(--space-sm)]">
          <Link className="cta-primary" href={hero.primaryAction.href}>
            {hero.primaryAction.label}
            <ArrowRight size={14} strokeWidth={1.8} aria-hidden="true" />
          </Link>
          <Link className="cta-secondary" href={hero.secondaryAction.href}>
            {hero.secondaryAction.label}
          </Link>
        </div>
        <p className="mt-[var(--space-md)] text-[length:var(--font-size-small)] text-text-subtle">
          {hero.note}
        </p>
      </Container>
    </section>
  );
}
