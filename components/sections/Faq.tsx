"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { landingData } from "@/lib/placeholder-data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="border-b border-border py-[var(--section-padding)]">
      <Container className="max-w-2xl">
        <h2 className="mb-[var(--space-xl)] text-center text-[length:var(--font-size-h2)] font-semibold tracking-[-0.05em]">FAQ</h2>
        <div className="border-y border-border">
          {landingData.faq.map((question, index) => (
            <div className="border-b border-border last:border-b-0" key={question}>
              <button className="flex min-h-14 w-full items-center justify-between gap-[var(--space-md)] text-left font-medium" type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
                <span>{question}</span><span className={`transition-transform ${open === index ? "rotate-45" : ""}`} aria-hidden="true">＋</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ${open === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="pb-[var(--space-md)] text-text-muted">Placeholder answer content for this frequently asked question.</p></div></div>
            </div>
          ))}
        </div>
        <p className="mt-[var(--space-lg)] text-center text-[length:var(--font-size-small)] text-text-muted">Can’t find your answer here? <a className="underline" href="#">Get in touch.</a></p>
      </Container>
    </section>
  );
}
