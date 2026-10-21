import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-border bg-surface p-[var(--space-lg)] shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
