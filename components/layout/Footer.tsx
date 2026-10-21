import { Container } from "@/components/ui/Container";

const columns = [
  { title: "Platform", links: ["AI and agents", "Notebooks", "Conversational analytics", "Data apps", "Hex CLI"] },
  { title: "Resources", links: ["Pricing", "Switching", "Enterprise", "Customer stories", "Blog"] },
  { title: "Company", links: ["About", "Careers", "Customers", "Solutions", "Contact"] },
  { title: "Connect", links: ["Request a demo", "Technical support", "Contact us", "LinkedIn", "YouTube"] },
];

export function Footer() {
  return (
    <footer>
      <Container className="grid gap-[var(--space-xl)] py-[var(--section-padding)] sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div><p className="text-xl font-black tracking-[-0.12em]">PREPCLEVER</p><p className="mt-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-muted">Made with data and ✦.</p></div>
        {columns.map((column) => <div key={column.title}><h2 className="text-[length:var(--font-size-small)] font-semibold uppercase tracking-[0.12em]">{column.title}</h2><ul className="mt-[var(--space-sm)] space-y-[var(--space-xs)]">{column.links.map((link) => <li key={link}><a className="text-[length:var(--font-size-small)] text-text-muted hover:text-text-primary" href="#">{link}</a></li>)}</ul></div>)}
      </Container>
      <div className="border-t border-border"><Container className="flex flex-wrap justify-between gap-[var(--space-sm)] py-[var(--space-md)] text-[length:var(--font-size-small)] text-text-muted"><span>© 2026 PrepClever</span><span>Privacy · Terms · Accessibility</span></Container></div>
    </footer>
  );
}
