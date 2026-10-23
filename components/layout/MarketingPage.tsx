// Shell for the small public pages the nav links to (Companies, Roles, Tools).
// They share the landing page's chrome so the nav never jumps between pages.

import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";

type MarketingPageProps = {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
};

export function MarketingPage({ eyebrow, title, lede, children }: MarketingPageProps) {
  return (
    <main className="min-h-dvh overflow-hidden">
      <Navbar />
      <section className="hero-grid marketing-page border-b border-border">
        <Container>
          <p className="section-eyebrow">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          <p className="marketing-page-lede">{lede}</p>
          {children}
        </Container>
      </section>
      <Footer />
    </main>
  );
}
