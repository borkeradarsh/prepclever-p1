import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { CustomerStories } from "@/components/sections/CustomerStories";
import { Faq } from "@/components/sections/Faq";
import { FeatureShowcase } from "@/components/sections/FeatureShowcase";
import { Integrations } from "@/components/sections/Integrations";
import { UseCases } from "@/components/sections/UseCases";
import { topViewportData } from "@/lib/placeholder-data";

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden">
      <AnnouncementBar />
      <Navbar />
      <section className="hero-grid border-b border-border">
        <Container className="flex flex-col items-center px-[var(--container-padding)] pb-[clamp(5rem,11vw,9rem)] pt-[clamp(5rem,10vw,9rem)] text-center">
          <h1 className="hero-title max-w-5xl font-[Formula] text-[length:var(--font-size-h1)] font-semibold leading-[var(--line-height-h1)] tracking-[-0.065em] text-text-primary">
            {topViewportData.heroTitle}
            <span className="block font-[Editorial] font-normal italic tracking-[-0.055em]">
              {topViewportData.heroAccent}
            </span>
          </h1>
          <div className="mt-[var(--space-xl)] flex max-w-2xl flex-wrap justify-center gap-x-[var(--space-xs)] gap-y-[var(--space-sm)] text-lg text-text-muted">
            <span>Rethinking</span>
            {topViewportData.heroLinks.map((link) => (
              <a className="rounded-[var(--radius-pill)] border border-border bg-surface px-[var(--space-sm)] py-[var(--space-xs)] underline decoration-brand underline-offset-4 transition-colors hover:bg-brand-soft" href="#" key={link}>
                {link}
              </a>
            ))}
            <span>{topViewportData.heroSupportingText}</span>
          </div>
          <div className="mt-[var(--space-xl)] flex flex-wrap justify-center gap-[var(--space-sm)]">
            <Link className="inline-flex min-h-9 items-center justify-center rounded-[var(--radius-button)] border border-button-primary bg-button-primary px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium text-button-primary-text hover:bg-text-muted" href="/signup">{topViewportData.primaryAction}</Link>
            <Button variant="secondary">{topViewportData.secondaryAction}</Button>
          </div>
        </Container>
      </section>
      <section className="border-b border-border bg-surface py-[var(--space-md)]">
        <Container>
          <p className="mb-[var(--space-sm)] text-center text-[length:var(--font-size-small)] uppercase tracking-[0.16em] text-text-subtle">
            {topViewportData.logoLabel}
          </p>
          <div className="grid grid-cols-2 gap-x-[var(--space-md)] gap-y-[var(--space-sm)] text-center text-sm font-semibold uppercase tracking-[0.08em] text-text-muted sm:grid-cols-4 lg:grid-cols-8">
            {topViewportData.logos.map((logo) => (
              <span className="py-[var(--space-xs)] grayscale transition-all hover:grayscale-0" key={logo}>
                {logo}
              </span>
            ))}
          </div>
        </Container>
      </section>
      <FeatureShowcase />
      <UseCases />
      <CustomerStories />
      <Integrations />
      <CtaBanner />
      <Faq />
      <Footer />
    </main>
  );
}
