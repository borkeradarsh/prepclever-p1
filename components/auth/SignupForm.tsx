"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { Button } from "@/components/ui/Button";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";
import { OnboardingFlow } from "@/components/auth/OnboardingFlow";
import { signInWithGoogle, signUpWithEmail, verifyTurnstile } from "@/lib/auth/actions";

export function SignupForm() {
  const [view, setView] = useState<"auth" | "onboarding">("auth");
  const [nameRequired, setNameRequired] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setStatus(""); setPending(true);
    try {
      if (!(await verifyTurnstile(turnstileToken))) throw new Error("Please complete the security check and try again.");
      if (password.length < 6) throw new Error("Use at least 6 characters for your password.");
      const result = await signUpWithEmail(identifier, password);
      if (!result.session) {
        setStatus("Check your email to confirm your account, then log in.");
        return;
      }
      setView("onboarding");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to create your account. Please try again."); }
    finally { setPending(false); }
  };

  const google = async () => {
    setError(""); setPending(true);
    try {
      if (!(await verifyTurnstile(turnstileToken))) throw new Error("Please complete the security check and try again.");
      await signInWithGoogle(); setNameRequired(false); setView("onboarding");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to continue with Google."); }
    finally { setPending(false); }
  };

  if (view === "onboarding") return <OnboardingFlow nameRequired={nameRequired} onComplete={() => window.location.assign("/")} />;

  return <form className="auth-form-card" onSubmit={submit}>
    <Button type="button" variant="secondary" className="auth-provider-button" onClick={google} disabled={pending}><GoogleIcon /> Continue with Google</Button>
    <div className="auth-divider"><span>or use your email</span></div>
    <label className="auth-field"><span>Email</span><input type="email" value={identifier} onChange={(event) => { setIdentifier(event.target.value); setError(""); }} placeholder="you@example.com" required /></label>
    <label className="auth-field"><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" required /></label>
    <TurnstileWidget onToken={setTurnstileToken} />
    {status ? <p className="auth-status">{status}</p> : null}
    {error ? <p className="auth-error">{error}</p> : null}
    <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Creating account..." : "Continue"}<ArrowRight size={15} /></button>
    <p className="auth-switch-link">Already have an account? <a href="/login">Log in</a></p>
  </form>;
}
