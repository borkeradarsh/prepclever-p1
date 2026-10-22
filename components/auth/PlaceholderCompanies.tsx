import { BarChart3, Building2, Database, MessageCircle } from "lucide-react";

const companies = [
  { label: "Company one", icon: Building2 },
  { label: "Company two", icon: Database },
  { label: "Company three", icon: BarChart3 },
  { label: "Company four", icon: MessageCircle },
  { label: "Company five", icon: Building2 },
  { label: "Company six", icon: Database },
  { label: "Company seven", icon: BarChart3 },
  { label: "Company eight", icon: MessageCircle },
];

export function PlaceholderCompanies() {
  return (
    <div className="auth-companies">
      <div className="auth-companies-label"><span />Trusted by leading data teams<span /></div>
      <div className="auth-company-grid">
        {companies.map(({ label, icon: Icon }) => (
          <div className="auth-company" key={label}><Icon size={25} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></div>
        ))}
      </div>
    </div>
  );
}
