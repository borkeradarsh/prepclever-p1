import { Container } from "@/components/ui/Container";
import { logoWall } from "@/content/landing.config";

const logoSlugs: Record<string, string> = {
  Walmart: "walmart",
  Target: "target",
  "Goldman Sachs": "goldmansachs",
  Shell: "shell",
  "Wells Fargo": "wellsfargo",
  Ericsson: "ericsson",
  DAZN: "dazn",
  "McDonald's": "mcdonalds",
  "Southwest Airlines": "southwestairlines",
};

// Two rows drifting in opposite directions. Each row's list is duplicated so
// the loop has no seam; the duplicate is hidden from assistive technology.
function Row({ companies, reverse }: { companies: string[]; reverse?: boolean }) {
  const renderGroup = (group: "primary" | "duplicate") => (
    <div className="logo-row-group" aria-hidden={group === "duplicate"}>
      {companies.map((company) => (
        <span className="logo-chip" key={`${group}-${company}`}>
          {logoSlugs[company] ? (
            <span
              className="logo-mark"
              role="img"
              aria-label={company}
              style={{
                backgroundImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${logoSlugs[company]}.svg)`,
              }}
            />
          ) : (
            <span className="logo-chip-text">{company}</span>
          )}
          <span className="sr-only">{company}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="logo-row">
      <div className={`logo-track ${reverse ? "logo-track-reverse" : ""}`}>
        {renderGroup("primary")}
        {renderGroup("duplicate")}
      </div>
    </div>
  );
}

export function LogoMarquee() {
  const half = Math.ceil(logoWall.companies.length / 2);

  return (
    <section className="logo-wall border-b border-border py-[clamp(2.5rem,5vw,4rem)]">
      <Container>
        <p className="mb-[var(--space-lg)] text-center text-[length:var(--font-size-small)] uppercase tracking-[0.16em] text-text-subtle">
          {logoWall.label}
        </p>
      </Container>
      <Row companies={logoWall.companies.slice(0, half)} />
      <Row companies={logoWall.companies.slice(half)} reverse />
    </section>
  );
}
