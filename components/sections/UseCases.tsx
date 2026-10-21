import { ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { landingData } from "@/lib/placeholder-data";

export function UseCases() {
  return (
    <section className="border-b border-border py-[var(--section-padding)]">
      <Container className="grid gap-[var(--space-xl)] lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-[length:var(--font-size-h2)] font-semibold leading-[var(--line-height-h2)] tracking-[-0.05em]">Use cases</h2>
          <p className="font-display text-4xl italic leading-none text-text-muted">Get the most out of your data</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {landingData.useCases.map((item) => (
            <a className="group grid gap-[var(--space-sm)] py-[var(--space-lg)] md:grid-cols-[auto_1fr_auto] md:items-center" href="#" key={item.title}>
              <span className="flex size-11 items-center justify-center rounded-[var(--radius-card)] border border-border bg-surface-muted text-brand"><Sparkles size={18} strokeWidth={1.6} aria-hidden="true" /></span>
              <span><strong className="block text-base">{item.title}</strong><span className="text-text-muted">{item.description}</span></span>
              <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} strokeWidth={1.6} aria-hidden="true" />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
