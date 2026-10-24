// Display helpers for jobs. Pure, so the card, the detail page and the tests
// all word a job the same way.

/** "20 Oct 2026". UTC, so the server and the browser never disagree by a day. */
export function formatJobDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** "3–6 years", "5+ years", "Up to 2 years", or null when the posting gives none. */
export function experienceRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) return min === max ? `${min} years` : `${min}–${max} years`;
  if (min !== null) return `${min}+ years`;
  if (max !== null) return `Up to ${max} years`;
  return null;
}

/** Hosts we can name. Anything else is shown as its bare hostname. */
const KNOWN_HOSTS: Record<string, string> = { "linkedin.com": "LinkedIn" };

/**
 * Where the apply link goes. Most research postings are LinkedIn listings, and
 * calling those the company's careers site would be untrue, so only links that
 * are not a known job board count as `careers`.
 */
export function applyTarget(url: string): { kind: "careers" } | { kind: "board"; siteName: string } {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return { kind: "board", siteName: "the original site" };
  }
  for (const [domain, siteName] of Object.entries(KNOWN_HOSTS)) {
    if (host === domain || host.endsWith(`.${domain}`)) return { kind: "board", siteName };
  }
  return { kind: "careers" };
}

const HOUR_MS = 60 * 60 * 1000;
/** The spec's freshness rule: warn when the last successful run is older than this. */
export const STALE_AFTER_HOURS = 48;

/** "just now", "5 hours ago", "1 day ago", "3 days ago". */
export function relativeTime(iso: string, now: Date): string {
  const hours = Math.floor((now.getTime() - new Date(iso).getTime()) / HOUR_MS);
  if (hours < 1) return "just now";
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function isStale(iso: string, now: Date): boolean {
  return now.getTime() - new Date(iso).getTime() > STALE_AFTER_HOURS * HOUR_MS;
}
