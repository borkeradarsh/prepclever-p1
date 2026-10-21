import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "border-button-primary bg-button-primary text-button-primary-text hover:bg-text-muted"
      : "border-border bg-button-secondary text-text-primary hover:border-border-strong hover:bg-surface-muted";

  return (
    <button
      className={`inline-flex min-h-9 items-center justify-center rounded-[var(--radius-button)] border px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}
      {...props}
    />
  );
}
