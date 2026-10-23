"use client";

import { RotateCcw } from "lucide-react";
import type { HTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";

type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
  message: string;
  retryLabel: string;
  onRetry: () => void;
};

/** The inline failure state a widget shows without taking the page down with it. */
export function ErrorState({
  message,
  retryLabel,
  onRetry,
  className = "",
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="status"
      className={`grid justify-items-start gap-[var(--space-sm)] ${className}`}
      {...props}
    >
      <p className="text-danger-ink">{message}</p>
      <Button type="button" variant="secondary" onClick={onRetry}>
        <RotateCcw size={15} strokeWidth={1.8} aria-hidden="true" className="mr-[var(--space-xs)]" />
        {retryLabel}
      </Button>
    </div>
  );
}
