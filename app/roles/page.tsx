import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
// The same role definitions onboarding and the dashboard use, so the public page
// and the product can never describe a role differently.
import { roles } from "@/content/roles.config";

export const metadata: Metadata = {
  title: "Roles — PrepClever",
  description: "The seven AI engineering roles PrepClever builds a roadmap for.",
};

export default function RolesPage() {
  return (
    <MarketingPage
      eyebrow="Roles"
      title="Seven routes into AI engineering"
      lede="Every roadmap is built around one of these. Pick the closest fit when you sign up — you can change it at any point, and the roadmap rebuilds around the new target."
    >
      <ul className="marketing-role-list">
        {roles.map((role) => (
          <li className="marketing-role-card" id={role.id} key={role.id}>
            <h2>{role.title}</h2>
            <p>
              <strong>{role.cardDescription}</strong>
            </p>
            <p>{role.shortDescription}</p>
            <p>Typical background: {role.typicalBackground}.</p>
          </li>
        ))}
      </ul>
      <div className="marketing-note">
        <h2>Not sure which one?</h2>
        <p>
          Answer three questions at sign-up and PrepClever suggests the role that fits your
          background, with the reasoning shown.
        </p>
        <p>
          <Link className="closing-cta-aside-link" href="/signup">
            Find my role
          </Link>
        </p>
      </div>
    </MarketingPage>
  );
}
