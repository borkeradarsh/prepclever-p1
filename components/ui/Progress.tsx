import type { HTMLAttributes } from "react";

type ProgressBarProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  value: number;
  max: number;
  /** Required: a bar with no accessible name is noise to a screen reader. */
  label: string;
};

function ratio(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, value / max));
}

/** Matches the onboarding progress bar: a 0.25rem rose-filled track. */
export function ProgressBar({ value, max, label, className = "", ...props }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={`h-1 w-full overflow-hidden rounded-[var(--radius-pill)] bg-surface-muted ${className}`}
      {...props}
    >
      <span
        className="block h-full rounded-[inherit] bg-brand transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${ratio(value, max) * 100}%` }}
      />
    </div>
  );
}

type SegmentedProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  total: number;
  filled: number;
  label: string;
};

/** One cell per session, for the weekly goal. */
export function SegmentedProgress({
  total,
  filled,
  label,
  className = "",
  ...props
}: SegmentedProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
      className={`flex gap-[var(--space-xs)] ${className}`}
      {...props}
    >
      {Array.from({ length: Math.max(0, total) }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 flex-1 rounded-[var(--radius-pill)] ${index < filled ? "bg-brand" : "bg-surface-muted"}`}
        />
      ))}
    </div>
  );
}
