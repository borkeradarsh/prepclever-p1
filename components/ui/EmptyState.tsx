import type { HTMLAttributes, ReactNode } from "react";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  body?: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  title,
  body,
  action,
  compact = false,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={`grid justify-items-start gap-[var(--space-sm)] rounded-[var(--radius-soft-md)] border border-dashed border-border-soft-strong ${compact ? "p-[var(--space-md)]" : "p-[var(--space-lg)]"} ${className}`}
      {...props}
    >
      <p className="font-heading text-base leading-tight text-text-primary">{title}</p>
      {body ? <p className="max-w-prose text-text-subtle">{body}</p> : null}
      {action}
    </div>
  );
}
