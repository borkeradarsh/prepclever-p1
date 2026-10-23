import { User } from "lucide-react";
import type { HTMLAttributes } from "react";

type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** Null is the normal case today: nothing collects a name yet. */
  name: string | null;
  size?: "sm" | "md";
};

const sizes = { sm: "size-7 text-[length:var(--font-size-small)]", md: "size-9" };

export function Avatar({ name, size = "sm", className = "", ...props }: AvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`inline-grid place-items-center rounded-[var(--radius-pill)] border border-border-soft bg-brand-soft font-medium text-text-primary ${sizes[size]} ${className}`}
      {...props}
    >
      {initial ?? <User size={15} strokeWidth={1.8} />}
    </span>
  );
}
