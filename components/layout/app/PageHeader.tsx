import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  subtext?: ReactNode;
  /** Optional right-hand action, e.g. a button or a chip. */
  action?: ReactNode;
};

/**
 * The header every app page starts with, and the only h1 on the page.
 */
export function PageHeader({ title, subtext, action }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-[var(--space-md)] pb-[var(--space-lg)] pt-[var(--space-lg)]">
      <div className="min-w-0">
        <h1 className="font-heading text-[length:var(--font-size-page-title)] leading-[var(--line-height-page-title)] tracking-[-0.02em] text-text-primary text-balance">
          {title}
        </h1>
        {subtext ? <p className="mt-[var(--space-sm)] text-text-subtle">{subtext}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-[var(--space-sm)]">{action}</div> : null}
    </header>
  );
}
