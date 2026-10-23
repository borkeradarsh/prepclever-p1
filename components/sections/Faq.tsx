"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { faq } from "@/content/landing.config";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-b border-border py-[var(--section-padding)]">
      <Container className="max-w-[46rem]">
        <h2 className="section-title mb-[var(--space-xl)] text-center">Questions, answered</h2>
        <div className="faq-list">
          {faq.map((item, index) => {
            const expanded = open === index;
            return (
              <div className="faq-item" key={item.question}>
                <button
                  className="faq-trigger"
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-trigger-${index}`}
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  <span>{item.question}</span>
                  <Plus
                    className={`faq-icon ${expanded ? "is-open" : ""}`}
                    size={16}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`faq-panel ${expanded ? "is-open" : ""}`}
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                >
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
