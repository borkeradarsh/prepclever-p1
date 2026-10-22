import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CtaBanner() {
  return (
    <section className="border-b border-border">
      <Container className="grid gap-[var(--space-xl)] py-[var(--section-padding)] md:grid-cols-2">
        <div>
          <h2 className="text-[length:var(--font-size-h3)] font-semibold">Getting started is easy.</h2>
          <p className="mt-[var(--space-sm)] max-w-sm text-text-muted">Connect your data and bring trusted answers to every team.</p>
          <div className="mt-[var(--space-lg)] flex flex-wrap gap-[var(--space-sm)]">
            <Link className="inline-flex min-h-9 items-center justify-center rounded-[var(--radius-button)] border border-button-primary bg-button-primary px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium text-button-primary-text hover:bg-text-muted" href="/signup">Get started for free</Link>
            <Button variant="secondary">Talk to us</Button>
          </div>
        </div>
        <div className="border-l border-border pl-[var(--space-xl)]">
          <p className="max-w-sm text-text-muted">Check out our plans to find the right fit for your organization.</p>
          <a className="mt-[var(--space-lg)] inline-block underline underline-offset-4" href="#">See our plans →</a>
        </div>
      </Container>
    </section>
  );
}
