import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Badge({ children, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-brand-soft px-[var(--space-sm)] py-[var(--space-xs)] text-[length:var(--font-size-small)] font-medium text-text-primary ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
