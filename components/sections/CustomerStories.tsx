import { ArrowUpRight, BarChart3, Building2, Database, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";

const stories = [
  {
    company: "Company one",
    icon: Building2,
    title: "One place for insights",
    description: "A placeholder team made the platform the shared place for decisions across data, operations, and leadership.",
  },
  {
    company: "Company two",
    icon: Database,
    title: "Scaling self-serve analytics",
    description: "A placeholder organization gave every team trusted access to answers without adding more reporting overhead.",
  },
  {
    company: "Company three",
    icon: BarChart3,
    title: "Lowering barriers to insight",
    description: "A placeholder data team focused on strategy while the workspace handled the repetitive parts of analysis.",
  },
  {
    company: "Company four",
    icon: MessageCircle,
    title: "Breaking data silos",
    description: "A placeholder business brought trusted insights into the places where teams already work together.",
  },
];

export function CustomerStories() {
  return (
    <section className="customer-stories border-b border-border py-[var(--section-padding)]">
      <Container>
        <div className="customer-stories-heading">
          <span className="customer-stories-corner customer-stories-corner-left" aria-hidden="true" />
          <span className="customer-stories-corner customer-stories-corner-right" aria-hidden="true" />
          <p className="font-display text-[clamp(2rem,5vw,3.7rem)] italic leading-none text-text-primary">Loved by the</p>
          <h2 className="text-[length:var(--font-size-h2)] font-semibold leading-[var(--line-height-h2)] tracking-[-0.06em]">best data teams</h2>
          <p className="mx-auto mt-[var(--space-sm)] max-w-md text-text-muted">Placeholder teams of all sizes do more with their data.</p>
        </div>
        <div className="customer-story-grid">
          {stories.map(({ company, icon: Icon, title, description }) => (
            <a className="customer-story-card group" href="#" key={company}>
              <div className="customer-story-company">
                <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
                <span>{company}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="customer-story-link">Read more <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
