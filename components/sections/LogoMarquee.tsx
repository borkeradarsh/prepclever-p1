import { Container } from "@/components/ui/Container";
import { logoWall } from "@/content/landing.config";

// Two rows drifting in opposite directions. Each row's list is duplicated so
// the loop has no seam; the duplicate is hidden from assistive technology.
function Row({ companies, reverse }: { companies: string[]; reverse?: boolean }) {
  const renderGroup = (group: "primary" | "duplicate") => (
    <div className="logo-row-group" aria-hidden={group === "duplicate"}>
      {companies.map((company) => (
        <span className="logo-chip" key={`${group}-${company}`}>
          {company}
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
