// Link-styled-as-button classes for the jobs pages. The Button primitive is a
// <button>, and these are navigations, so they stay links with the same look.

const base =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] border px-[var(--space-md)] text-[length:var(--font-size-small)] font-medium transition-colors duration-200 ease-out motion-reduce:transition-none";

export const primaryLink = `${base} border-button-primary bg-button-primary text-button-primary-text hover:bg-text-muted`;
export const secondaryLink = `${base} border-border bg-button-secondary text-text-primary hover:border-border-strong hover:bg-surface-muted`;
export const textLink = "text-accent-ink underline underline-offset-2 hover:text-accent-ink-strong";
