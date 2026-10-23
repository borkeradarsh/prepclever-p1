import type { HTMLAttributes } from "react";

type StatProps = HTMLAttributes<HTMLDivElement> & {
  text: string;
  sourceLabel?: string;
  /** Shown in development only, for figures nobody has confirmed yet. */
  unverifiedLabel?: string;
};

export function Stat({
  text,
  sourceLabel,
  unverifiedLabel,
  className = "",
  ...props
}: StatProps) {
  return (
    <div className={`grid gap-[var(--space-xs)] ${className}`} {...props}>
      <p className="text-text-primary">{text}</p>
      {sourceLabel ? (
        <p className="text-[length:var(--font-size-small)] text-text-subtle">
          {sourceLabel}
          {unverifiedLabel ? (
            <span className="ml-[var(--space-xs)] rounded-[var(--radius-pill)] border border-border px-[var(--space-xs)] text-text-subtle">
              {unverifiedLabel}
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
