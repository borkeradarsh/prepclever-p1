// Situation carry-over from the landing page to onboarding (spec sections 3 and 8).
// The landing page writes `prepclever-intent` on the browser; onboarding reads it
// to preselect screen 1, and completing onboarding clears it. The value is
// validated on every read, since anyone can set a cookie.

import { SITUATIONS, type Situation } from "@/components/auth/onboarding/types";

export const INTENT_COOKIE = "prepclever-intent";
const INTENT_MAX_AGE = 60 * 60 * 24;

export function parseIntent(value: string | null | undefined): Situation | null {
  return value && (SITUATIONS as string[]).includes(value) ? (value as Situation) : null;
}

/** Reads the intent out of a `document.cookie` or `Cookie` header string. */
export function intentFromCookieHeader(header: string | null | undefined): Situation | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === INTENT_COOKIE) return parseIntent(decodeURIComponent(rest.join("=")));
  }
  return null;
}

/** The `document.cookie` assignment that records a landing-page choice. */
export function intentCookieAssignment(situation: Situation): string {
  return `${INTENT_COOKIE}=${situation}; path=/; max-age=${INTENT_MAX_AGE}; samesite=lax`;
}
