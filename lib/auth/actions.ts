import { supabase, supabaseConfigured } from "@/lib/supabase/client";

function requireSupabase() {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Supabase authentication is not configured yet. Add the Supabase values to .env.local.");
  }
  return supabase;
}

export async function signInWithGoogle() {
  const { error } = await requireSupabase().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyTurnstile(token: string) {
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return true;

  const response = await fetch("/api/turnstile/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const result = (await response.json()) as { success?: boolean };
  return response.ok && result.success === true;
}
