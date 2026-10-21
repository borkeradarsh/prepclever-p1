import type { BlockquoteHTMLAttributes, ReactNode } from "react";

type QuoteBlockProps = BlockquoteHTMLAttributes<HTMLQuoteElement> & {
  quote: ReactNode;
  attribution?: ReactNode;
};

export function QuoteBlock({
  quote,
  attribution,
  className = "",
  ...props
}: QuoteBlockProps) {
  return (
    <blockquote
      className={`border-l border-brand px-[var(--space-md)] text-text-primary ${className}`}
      {...props}
    >
      <p className="font-display text-xl italic leading-tight">{quote}</p>
      {attribution ? (
        <footer className="mt-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-muted">
          {attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}
