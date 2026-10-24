import { Container } from "@/components/ui/Container";
import { logoWall } from "@/content/landing.config";

const logoDomains: Record<string, string> = {
  Walmart: "walmart.com",
  Target: "target.com",
  "JPMorgan Chase": "jpmorganchase.com",
  "Goldman Sachs": "goldmansachs.com",
  Shell: "shell.com",
  "Lowe's": "lowes.com",
  "Wells Fargo": "wellsfargo.com",
  UBS: "ubs.com",
  Vanguard: "vanguard.com",
  Costco: "costco.com",
  "Eli Lilly": "lilly.com",
  Medtronic: "medtronic.com",
  "Best Buy": "bestbuy.com",
  Ericsson: "ericsson.com",
  Zeiss: "zeiss.com",
  DAZN: "dazn.com",
  "McDonald's": "mcdonalds.com",
  Truist: "truist.com",
  "Southwest Airlines": "southwest.com",
  ArcelorMittal: "arcelormittal.com",
};

// Two rows drifting in opposite directions. Each row's list is duplicated so
// the loop has no seam; the duplicate is hidden from assistive technology.
function Row({ companies, reverse }: { companies: string[]; reverse?: boolean }) {
  const renderGroup = (group: "primary" | "duplicate") => (
    <div className="logo-row-group" aria-hidden={group === "duplicate"}>
      {companies.map((company) => (
        <span className="logo-chip" key={`${group}-${company}`}>
          <span
            className="logo-mark"
            aria-hidden="true"
            style={{
              backgroundImage: `url(https://www.google.com/s2/favicons?domain=${logoDomains[company]}&sz=128)`,
            }}
          />
          <span className="logo-name">{company}</span>
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
