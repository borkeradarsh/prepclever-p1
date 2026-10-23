import { Lock } from "lucide-react";
import Link from "next/link";
import type { HTMLAttributes } from "react";

type LockAction = { label: string; href: string };

type LockPanelProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  body: string;
  primary: LockAction;
  secondary?: LockAction;
  /** "inline" sits inside another card; "panel" replaces a content area. */
  variant?: "inline" | "panel";
};

const primaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-soft-sm)] border border-button-primary bg-button-primary px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium text-button-primary-text transition-colors duration-200 ease-out hover:bg-text-muted";

/**
 * Locked content is shown, not hidden or blurred (CLAUDE.md section 5): the title
 * and meta stay visible, and this explains what opens it.
 */
export function LockPanel({
  title,
  body,
  primary,
  secondary,
  variant = "inline",
  className = "",
  ...props
}: LockPanelProps) {
  return (
    <div
      className={`grid justify-items-start gap-[var(--space-sm)] rounded-[var(--radius-soft-md)] border border-border-soft bg-surface-muted ${variant === "panel" ? "p-[var(--space-lg)]" : "p-[var(--space-md)]"} ${className}`}
      {...props}
    >
      <p className="flex items-center gap-[var(--space-xs)] font-heading text-base leading-tight text-text-primary">
        <Lock size={15} strokeWidth={1.8} aria-hidden="true" />
        {title}
      </p>
      <p className="max-w-prose text-text-subtle">{body}</p>
      <div className="mt-[var(--space-xs)] flex flex-wrap items-center gap-[var(--space-md)]">
        <Link href={primary.href} className={primaryButton}>
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className="text-accent-ink underline underline-offset-2 hover:text-accent-ink-strong"
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
