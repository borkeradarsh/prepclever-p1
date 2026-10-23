import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Any CSS length, e.g. "7rem" or "60%". */
  width?: string;
  height?: string;
  radius?: "sm" | "md" | "pill";
};

const radii = {
  sm: "rounded-[var(--radius-soft-sm)]",
  md: "rounded-[var(--radius-soft-md)]",
  pill: "rounded-[var(--radius-pill)]",
};

/**
 * Loading placeholder. Same muted fill as the onboarding skeleton, and the pulse
 * is motion-safe only, so reduced-motion users get a static block.
 */
export function Skeleton({
  width = "100%",
  height = "1rem",
  radius = "sm",
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-surface-muted ${radii[radius]} motion-safe:animate-pulse ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}

type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  lines?: number;
};

export function SkeletonText({ lines = 3, className = "", ...props }: SkeletonTextProps) {
  return (
    <div className={`grid gap-[var(--space-xs)] ${className}`} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        // Last line short, so it reads as text rather than a block.
        <Skeleton key={index} height="0.8rem" width={index === lines - 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}
