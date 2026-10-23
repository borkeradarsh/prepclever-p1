import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  selected?: boolean;
  icon?: ReactNode;
  className?: string;
} & (
  | ({ as?: "span" } & Omit<HTMLAttributes<HTMLSpanElement>, "children" | "className">)
  | ({ as: "button" } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">)
);

const base =
  "inline-flex items-center gap-[var(--space-xs)] rounded-[var(--radius-pill)] border px-[var(--space-sm)] text-[length:var(--font-size-small)] font-medium transition-colors duration-200 ease-out";
const tones = {
  selected: "border-focus bg-brand-soft text-text-primary",
  unselected: "border-border bg-background text-text-primary",
};

/** Interactive chips get a 44px tap target; static labels stay compact. */
export function Chip({
  children,
  selected = false,
  icon,
  className = "",
  as = "span",
  ...rest
}: ChipProps) {
  const tone = selected ? tones.selected : tones.unselected;

  if (as === "button") {
    return (
      <button
        type="button"
        aria-pressed={selected}
        className={`${base} ${tone} min-h-11 hover:border-focus hover:bg-brand-soft ${className}`}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {icon}
        {children}
      </button>
    );
  }

  return (
    <span
      className={`${base} ${tone} py-[var(--space-xs)] ${className}`}
      {...(rest as HTMLAttributes<HTMLSpanElement>)}
    >
      {icon}
      {children}
    </span>
  );
}
