import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlockGlyph } from "@/components/graphics/BlockGlyph";
import { Container } from "@/components/ui/Container";
import { blueprint } from "@/content/landing.config";

export function Blueprint() {
  return (
    <section className="blueprint border-b border-border py-[var(--section-padding)]" id={blueprint.id}>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{blueprint.eyebrow}</p>
          <h2 className="section-title">{blueprint.title}</h2>
          <p className="section-lede mx-auto">{blueprint.description}</p>
        </div>

        <ol className="blueprint-grid">
          {blueprint.blocks.map((block) => (
            <li className="blueprint-card" key={block.id}>
              <div className="blueprint-card-head">
                <span className="blueprint-index" aria-hidden="true">
                  {block.index}
                </span>
                <span className="blueprint-glyph">
                  <BlockGlyph block={block.id} />
                </span>
              </div>
              <h3 className="blueprint-card-title">{block.title}</h3>
              <p className="blueprint-card-summary">{block.summary}</p>
              <dl className="blueprint-points">
                {block.points.map((point) => (
                  <div key={point.term}>
                    <dt>{point.term}</dt>
                    <dd>{point.detail}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>

        <div className="blueprint-cta">
          <div className="blueprint-cta-copy">
            <p className="blueprint-cta-eyebrow">{blueprint.cta.eyebrow}</p>
            <h3 className="blueprint-cta-title">{blueprint.cta.title}</h3>
            <p className="blueprint-cta-description">{blueprint.cta.description}</p>
            <p className="blueprint-cta-footnote">
              {blueprint.cta.footnote}{" "}
              <Link href={blueprint.cta.footnoteAction.href}>{blueprint.cta.footnoteAction.label}</Link>
            </p>
          </div>
          <ul className="blueprint-cta-options">
            {blueprint.cta.options.map((option) => (
              <li key={option.label}>
                <Link href={blueprint.cta.href}>
                  <span className="blueprint-option-label">{option.label}</span>
                  <span className="blueprint-option-detail">{option.detail}</span>
                  <ArrowRight className="blueprint-option-arrow" size={15} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
