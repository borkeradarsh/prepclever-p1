import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
import { logoWall } from "@/content/landing.config";

export const metadata: Metadata = {
  title: "Companies — PrepClever",
  description: "Global enterprises running capability centres in India that hire AI talent.",
};

export default function CompaniesPage() {
  return (
    <MarketingPage
      eyebrow="Companies"
      title="Who is hiring AI talent from India"
      lede="Global enterprises running their own capability centres here — the employer is the enterprise, not a vendor. The searchable directory, with city, team size and open roles, is the next thing we are building."
    >
      <ul className="marketing-role-list">
        {logoWall.companies.map((company) => (
          <li className="marketing-role-card" key={company}>
            <h2>{company}</h2>
            <p>India capability centre. Role-level detail arrives with the directory.</p>
          </li>
        ))}
      </ul>
      <div className="marketing-note">
        <h2>Want the role-level view now?</h2>
        <p>
          Create a free account and your roadmap names the companies hiring for the role you are
          targeting, with the stages you need to clear first.
        </p>
        <p>
          <Link className="closing-cta-aside-link" href="/signup">
            Get started free
          </Link>
        </p>
      </div>
    </MarketingPage>
  );
}
