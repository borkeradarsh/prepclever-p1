import { IndiaMapGraphic } from "@/components/graphics/IndiaMapGraphic";
import { Container } from "@/components/ui/Container";
import { growth } from "@/content/landing.config";

export function GrowthStory() {
  return (
    <section className="growth-story border-b border-border py-[var(--section-padding)]" id="growth">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{growth.eyebrow}</p>
          <h2 className="section-title">{growth.title}</h2>
          <p className="section-lede mx-auto">{growth.description}</p>
        </div>

        <dl className="growth-stats">
          {growth.stats.map((stat) => (
            <div className="growth-stat" key={stat.label}>
              <dt className="growth-stat-value">
                {stat.value}
                {stat.unit ? <span className="growth-stat-unit">{stat.unit}</span> : null}
              </dt>
              <dd className="growth-stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className="growth-map">
          <div className="growth-map-copy">
            <h3 className="growth-map-title">{growth.map.title}</h3>
            <p className="growth-map-description">{growth.map.description}</p>
            <ul className="growth-city-list">
              {growth.map.hotspots
                .filter((spot) => spot.share > 0)
                .sort((a, b) => b.share - a.share)
                .map((spot) => (
                  <li key={spot.city}>
                    <span className="growth-city-name">{spot.city}</span>
                    <span className="growth-city-bar" aria-hidden="true">
                      <span style={{ width: `${(spot.share / 30) * 100}%` }} />
                    </span>
                    <span className="growth-city-share">
                      {spot.share}%{spot.growth ? <em> {spot.growth}</em> : null}
                    </span>
                  </li>
                ))}
            </ul>
            <ul className="growth-legend">
              {growth.map.legend.map((entry) => (
                <li key={entry.label}>
                  <span
                    className={`growth-legend-dot growth-legend-dot-${entry.kind}`}
                    aria-hidden="true"
                  />
                  {entry.label}
                </li>
              ))}
            </ul>
          </div>
          <IndiaMapGraphic map={growth.map} />
        </div>

        <p className="growth-source">{growth.source}</p>
      </Container>
    </section>
  );
}
