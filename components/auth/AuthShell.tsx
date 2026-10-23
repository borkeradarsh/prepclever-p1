import type { ReactNode } from "react";
import Link from "next/link";
import { marketingNavCopy } from "@/content/marketing-nav.config";

type AuthShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  aside?: ReactNode;
  showLegal?: boolean;
  contentClassName?: string;
};

export function AuthShell({ children, title, subtitle, aside, showLegal = true, contentClassName = "" }: AuthShellProps) {
  return (
    <main className="auth-page">
      <Link className="auth-brand" href="/" aria-label="Return to homepage">
        {marketingNavCopy.brand}
      </Link>
      <div className={`auth-content ${contentClassName}`.trim()}>
        <section className="auth-form-column">
          {title ? <header className="auth-heading">
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </header> : null}
          {children}
          {showLegal ? <footer className="auth-legal">
            By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
          </footer> : null}
        </section>
        {aside ? <aside className="auth-aside">{aside}</aside> : null}
      </div>
    </main>
  );
}
