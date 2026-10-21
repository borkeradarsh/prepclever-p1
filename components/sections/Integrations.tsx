import { Container } from "@/components/ui/Container";
import { landingData } from "@/lib/placeholder-data";

export function Integrations() {
  return (
    <section className="hero-grid border-b border-border py-[var(--section-padding)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[length:var(--font-size-h2)] italic leading-[var(--line-height-h2)]">Instant integration</h2>
          <h3 className="text-[length:var(--font-size-h2)] font-semibold leading-[var(--line-height-h2)] tracking-[-0.05em]">with the whole stack</h3>
          <p className="mt-[var(--space-md)] text-text-muted">{landingData.integrations.description}</p>
        </div>
        <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-[var(--space-sm)] sm:grid-cols-2 lg:grid-cols-3">
          {landingData.integrations.cards.map((card, index) => (
            <article className="group min-h-48 border border-border bg-surface p-[var(--space-lg)] transition-transform duration-300 hover:-translate-y-1" key={card}>
              <div className="mb-[var(--space-xl)] flex h-16 items-center justify-center border-b border-border bg-section-alt text-2xl text-brand">{["◌", "⌁", "◇", "⌘", "⊙", "✧"][index]}</div>
              <h3 className="font-semibold">{card}</h3>
              <p className="mt-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-muted">Placeholder integration description for this card.</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
