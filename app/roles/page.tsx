import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPage } from "@/components/layout/MarketingPage";
// The same role definitions the onboarding flow uses, so the public page and
// the product can never describe a role differently.
import { roles } from "@/components/auth/onboarding/config";

export const metadata: Metadata = {
  title: "Roles — PrepClever",
  description: "The five AI engineering roles PrepClever builds a roadmap for.",
};

export default function RolesPage() {
  return (
    <MarketingPage
      eyebrow="Roles"
      title="Five routes into AI engineering"
      lede="Every roadmap is built around one of these. Pick the closest fit when you sign up — you can change it at any point, and the stages rebuild around the new target."
    >
      <ul className="marketing-role-list">
        {roles.map((role) => (
          <li className="marketing-role-card" id={role.id} key={role.id}>
            <h2>{role.title}</h2>
            <p>
              <strong>{role.description}</strong>
            </p>
            <p>{role.summary}</p>
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
