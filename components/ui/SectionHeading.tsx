import type { HTMLAttributes, ReactNode } from "react";

type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
  ...props
}: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${className}`} {...props}>
      {eyebrow ? (
        <p className="mb-[var(--space-sm)] text-[length:var(--font-size-small)] font-medium uppercase tracking-[0.12em] text-text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[length:var(--font-size-h2)] font-semibold leading-[var(--line-height-h2)] tracking-[-0.045em] text-text-primary">
        {title}
      </h1>
      {description ? (
        <p className="mt-[var(--space-md)] max-w-xl text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}
