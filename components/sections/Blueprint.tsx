import Link from "next/link";
import { situations } from "@/components/auth/onboarding/config";
import { BlockGlyph } from "@/components/graphics/BlockGlyph";
import { Container } from "@/components/ui/Container";
import { statusLabels, tierLabels } from "@/content/blocks.config";
import { blueprint } from "@/content/landing.config";
import { resolveBlocks } from "@/lib/journey";
import { IntentOption } from "./IntentOption";

// Title, summary, bullets, tier and status all come from content/blocks.config.ts
// (tier via the access rules), so the landing page cannot drift from the product.
const blocks = resolveBlocks();

export function Blueprint() {
  return (
    <section
      className="blueprint border-b border-border pb-[clamp(2rem,4vw,3rem)] pt-[clamp(2rem,4vw,3rem)]"
      id={blueprint.id}
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{blueprint.eyebrow}</p>
          <h2 className="section-title">{blueprint.title}</h2>
          <p className="section-lede section-lede-centered">{blueprint.description}</p>
        </div>

        <ol className="blueprint-grid">
          {blocks.map((block) => (
            <li className="blueprint-card" key={block.slug}>
              <div className="blueprint-card-head">
                <span className="blueprint-index" aria-hidden="true">
                  {String(block.order).padStart(2, "0")}
                </span>
                <span className="blueprint-chips">
                  <span className={`blueprint-tier${block.tier === "free" ? " is-free" : ""}`}>
                    {tierLabels[block.tier]}
                  </span>
                  {block.status === "coming_soon" ? (
                    <span className="blueprint-tier">{statusLabels.coming_soon}</span>
                  ) : null}
                </span>
                <span className="blueprint-glyph">
                  <BlockGlyph block={block.slug} />
                </span>
              </div>
              <h3 className="blueprint-card-title">{block.title}</h3>
              <p className="blueprint-card-summary">{block.summary}</p>
              <dl className="blueprint-points">
                {block.bullets.map((point) => (
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
            {situations.map((option) => (
              <li key={option.id}>
                <IntentOption
                  situation={option.id}
                  href={blueprint.cta.href}
                  label={option.title}
                  detail={option.description}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
