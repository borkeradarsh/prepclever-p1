// The sidebar's expanded or collapsed state, kept in a cookie so the server
// renders the right width on the first paint and nothing jumps on hydration.
// Dependency-free: the client toggle writes it, the app layout reads it.

export const SIDEBAR_COOKIE = "prepclever-sidebar";

export type SidebarState = "expanded" | "collapsed";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Anything but an exact "collapsed" is the default, expanded. */
export function parseSidebarCookie(raw: string | null | undefined): SidebarState {
  return raw?.trim() === "collapsed" ? "collapsed" : "expanded";
}

/** The `document.cookie` assignment the client toggle makes. */
export function serializeSidebarCookie(state: SidebarState): string {
  return `${SIDEBAR_COOKIE}=${state}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}
