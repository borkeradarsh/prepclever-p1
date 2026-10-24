// Validates a `returnTo` value before anything redirects to it (spec section 8).
// Only same-site paths pass: a single leading slash, never `//`, no scheme, no
// backslash and no control characters. Anything else gets the fallback.

const PROBE_ORIGIN = "https://prepclever.invalid";

export function safeReturnTo(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;

  // Belt and braces: whatever the browser would resolve it to must stay on site.
  try {
    if (new URL(value, PROBE_ORIGIN).origin !== PROBE_ORIGIN) return fallback;
  } catch {
    return fallback;
  }
  return value;
}
