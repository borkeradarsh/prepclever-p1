import type { ReactNode } from "react";
import { AiStackGraphic } from "@/components/graphics/AiStackGraphic";
import { OwnershipGraphic } from "@/components/graphics/OwnershipGraphic";
import { RewardsGraphic } from "@/components/graphics/RewardsGraphic";
import { Container } from "@/components/ui/Container";
import { pillars, pillarsIntro, type PillarGraphic } from "@/content/landing.config";

const graphics: Record<PillarGraphic, () => ReactNode> = {
  ownership: OwnershipGraphic,
  "ai-stack": AiStackGraphic,
  rewards: RewardsGraphic,
};

export function WhyGcc() {
  return (
    <section className="why-gcc border-b border-border py-[var(--section-padding)]" id="why-gcc">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{pillarsIntro.eyebrow}</p>
          <h2 className="section-title">{pillarsIntro.title}</h2>
          <p className="section-lede section-lede-centered">{pillarsIntro.description}</p>
        </div>

        <div className="pillar-list">
          {pillars.map((pillar) => {
            const Graphic = graphics[pillar.graphic];
            return (
              <article className="pillar-row" id={pillar.id} key={pillar.id}>
                <div className="pillar-copy">
                  <p className="section-eyebrow">{pillar.eyebrow}</p>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <dl className="pillar-points">
                    {pillar.points.map((point) => (
                      <div key={point.term}>
                        <dt>{point.term}</dt>
                        <dd>{point.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="pillar-figure">
                  <Graphic />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
