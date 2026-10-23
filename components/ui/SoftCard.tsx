import type { HTMLAttributes, ReactNode } from "react";

type SoftCardTone = "default" | "accent" | "flat";
type SoftCardPadding = "sm" | "md" | "lg";

type SoftCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: SoftCardTone;
  padding?: SoftCardPadding;
};

const tones: Record<SoftCardTone, string> = {
  default: "border-border-soft bg-surface-card shadow-soft",
  // The dominant card on a page: rose top edge and a faint tint.
  accent: "border-border-soft border-t-[3px] border-t-brand bg-brand-soft/25 shadow-soft",
  flat: "border-border-soft bg-background",
};

const paddings: Record<SoftCardPadding, string> = {
  sm: "p-[var(--space-sm)]",
  md: "p-[var(--space-md)]",
  lg: "p-[var(--space-lg)]",
};

/**
 * The app's card surface. Deliberately softer than components/ui/Card, which is
 * the sharp-cornered marketing card: this one continues the onboarding language
 * so the dashboard reads as the same product.
 */
export function SoftCard({
  children,
  tone = "default",
  padding = "md",
  className = "",
  ...props
}: SoftCardProps) {
  return (
    <div
      className={`rounded-[var(--radius-soft-lg)] border ${tones[tone]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
