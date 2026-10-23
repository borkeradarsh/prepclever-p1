// Where the user's display name comes from.
//
// Nothing in the product collects a name today: OnboardingState has no name
// field, and CLAUDE.md section 7 rules out changing that model while the
// dashboard is being built. So this reads what is already available and returns
// null otherwise, and the greeting degrades to "Welcome back" with no name.
// Deriving a name from the email local part is deliberately avoided: it produces
// strings like "Sarvind1652".
// TODO(onboarding): collect a first name, then delete the fallbacks here.

import { cookies } from "next/headers";
import { authEnabled } from "@/lib/auth/config";

const NAME_COOKIE = "prepclever-name";

function firstWord(value: string): string | null {
  const first = value.trim().split(/\s+/)[0];
  return first && first.length > 0 ? first : null;
}

export async function getFirstName(): Promise<string | null> {
  if (authEnabled) {
    const fromSession = await nameFromSupabase();
    if (fromSession) return fromSession;
  }

  const store = await cookies();
  const cookieName = store.get(NAME_COOKIE)?.value;
  return cookieName ? firstWord(decodeURIComponent(cookieName)) : null;
}

/**
 * Reads the name a provider gave us (Google sets user_metadata.full_name).
 * Returns null rather than throwing when Supabase is not configured.
 */
async function nameFromSupabase(): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const { createServerClient } = await import("@supabase/ssr");
    const store = await cookies();
    const client = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => store.getAll(),
        // Read-only: a server component cannot set cookies, and we never need to.
        setAll: () => {},
      },
    });
    const { data } = await client.auth.getUser();
    const metadata = data.user?.user_metadata ?? {};
    const raw = metadata.full_name ?? metadata.name;
    return typeof raw === "string" ? firstWord(raw) : null;
  } catch {
    return null;
  }
}
