"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { Button } from "@/components/ui/Button";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth/actions";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const finish = () => window.location.assign("/");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setPending(true);
    try { await signInWithEmail(email, password); finish(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to log in. Please try again."); }
    finally { setPending(false); }
  };

  const google = async () => {
    setError(""); setPending(true);
    try { await signInWithGoogle(); finish(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to continue with Google."); }
    finally { setPending(false); }
  };

  return <form className="auth-form-card" onSubmit={submit}>
    <Button type="button" variant="secondary" className="auth-provider-button" onClick={google} disabled={pending}><GoogleIcon /> Continue with Google</Button>
    <div className="auth-divider"><span>or continue with email</span></div>
    <label className="auth-field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
    <label className="auth-field"><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required /></label>
    <a className="auth-forgot" href="#forgot-password">Forgot password?</a>
    {error ? <p className="auth-error">{error}</p> : null}
    <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Logging in..." : "Log in"}<ArrowRight size={15} /></button>
    <p className="auth-switch-link">Don&apos;t have an account? <a href="/signup">Sign up</a></p>
  </form>;
}
