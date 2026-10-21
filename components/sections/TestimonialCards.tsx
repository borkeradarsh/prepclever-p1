import { Container } from "@/components/ui/Container";
import { landingData } from "@/lib/placeholder-data";

export function TestimonialCards() {
  return (
    <section className="border-b border-border py-[var(--section-padding)]">
      <Container className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {landingData.testimonials.map((item) => (
          <article className="bg-surface p-[clamp(1.5rem,4vw,3.5rem)]" key={item.logo}>
            <p className="font-semibold tracking-[0.1em]">{item.logo}</p>
            <p className="mt-[var(--space-xl)] font-display text-2xl italic leading-tight">“{item.quote}”</p>
            <p className="mt-[var(--space-xl)] text-[length:var(--font-size-small)] text-text-muted">{item.person} · {item.role}</p>
          </article>
        ))}
      </Container>
    </section>
  );
}
