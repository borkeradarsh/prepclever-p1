import type { HTMLAttributes } from "react";

type AppContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** "app" is the 1120px dashboard width; "reading" is the 720px lesson width. */
  width?: "app" | "reading";
};

const widths = {
  app: "max-w-[var(--app-max-width)]",
  reading: "max-w-[var(--reading-max-width)]",
};

/**
 * The app's page width. Separate from components/ui/Container, which is the
 * 1200px marketing width with much larger gutters.
 */
export function AppContainer({ width = "app", className = "", ...props }: AppContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 md:px-8 ${widths[width]} ${className}`} {...props} />
  );
}
