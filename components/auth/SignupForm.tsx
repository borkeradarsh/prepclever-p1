"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { Button } from "@/components/ui/Button";
import { TurnstileWidget } from "@/components/auth/TurnstileWidget";
import { OnboardingFlow } from "@/components/auth/OnboardingFlow";
import { createPhoneVerifier, requestPhoneCode, sendVerificationEmail, signInWithGoogle, signUpWithEmail, verifyTurnstile } from "@/lib/auth/actions";
import { firebaseAuth } from "@/lib/firebase/client";

type Mode = "email" | "phone";

type Verification = Awaited<ReturnType<typeof requestPhoneCode>>;

function isPhoneIdentifier(value: string) {
  return /^[+\d][\d\s().-]{6,}$/.test(value.trim());
}

export function SignupForm() {
  const [mode, setMode] = useState<Mode>("email");
  const [view, setView] = useState<"auth" | "otp" | "onboarding">("auth");
  const [nameRequired, setNameRequired] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<Verification | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const phoneIdentifier = isPhoneIdentifier(identifier);
  const activeMode: Mode = phoneIdentifier ? "phone" : "email";

  useEffect(() => {
    if (!resendIn) return;
    const timer = window.setTimeout(() => setResendIn((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const enterOtp = (nextMode: Mode, nextConfirmation: Verification | null) => {
    setMode(nextMode); setConfirmation(nextConfirmation); setCode(""); setView("otp"); setResendIn(30);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setStatus(""); setPending(true);
    try {
      if (!(await verifyTurnstile(turnstileToken))) throw new Error("Please complete the security check and try again.");
      setMode(activeMode);
      if (activeMode === "email") {
        if (password.length < 6) throw new Error("Use at least 6 characters for your password.");
        await signUpWithEmail(identifier, password);
        await sendVerificationEmail();
        enterOtp("email", null);
        setStatus("We sent a verification link to your email.");
      } else {
        const verifier = createPhoneVerifier("signup-recaptcha");
        enterOtp("phone", await requestPhoneCode(identifier, verifier));
        setStatus("Enter the six-digit code sent to your phone.");
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to create your account. Please try again."); }
    finally { setPending(false); }
  };

  const verify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setPending(true);
    try {
      if (!/^\d{6}$/.test(code)) throw new Error("Enter the six-digit verification code.");
      if (mode === "phone" && confirmation) await confirmation.confirm(code);
      if (mode === "email") {
        await firebaseAuth?.currentUser?.reload();
        if (!firebaseAuth?.currentUser?.emailVerified) throw new Error("Open the verification link in your email, then try again.");
      }
      setView("onboarding");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "That code could not be verified."); }
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

  if (view === "otp") return <form className="auth-form-card" onSubmit={verify}>
    <button className="auth-back" type="button" onClick={() => { setView("auth"); setError(""); }}><ArrowLeft size={15} /> Edit {mode === "phone" ? "phone number" : "email"}</button>
    <div className="auth-otp-icon"><Check size={18} /></div>
    <h2 className="auth-form-title">Verify your {mode === "phone" ? "phone" : "email"}</h2>
    <p className="auth-form-copy">{mode === "phone" ? `Enter the code sent to ${identifier}.` : `Enter the six-digit code from ${identifier}.`}</p>
    <label className="auth-field"><span>Verification code</span><input autoFocus inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" /></label>
    {status ? <p className="auth-status"><Check size={15} />{status}</p> : null}
    {error ? <p className="auth-error">{error}</p> : null}
    <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Checking..." : "Verify and continue"}<ArrowRight size={15} /></button>
    <button className="auth-resend" type="button" disabled={resendIn > 0 || pending} onClick={() => setStatus("A new code has been requested.")}><RotateCcw size={14} />{resendIn ? `Resend in ${resendIn}s` : "Resend code"}</button>
    <div id="signup-recaptcha" />
  </form>;

  return <form className="auth-form-card" onSubmit={submit}>
    <Button type="button" variant="secondary" className="auth-provider-button" onClick={google} disabled={pending}><GoogleIcon /> Continue with Google</Button>
    <div className="auth-divider"><span>or use your email or phone</span></div>
    <label className="auth-field"><span>Email or phone number</span><input type={phoneIdentifier ? "tel" : "text"} inputMode={phoneIdentifier ? "tel" : "email"} value={identifier} onChange={(event) => { setIdentifier(event.target.value); setError(""); }} placeholder="you@example.com or +1 555 000 0000" required /></label>
    {!phoneIdentifier ? <label className="auth-field"><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" required /></label> : <p className="auth-adaptive-note">Phone signup continues with a one-time verification code.</p>}
    <TurnstileWidget onToken={setTurnstileToken} />
    {error ? <p className="auth-error">{error}</p> : null}
    <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Creating account..." : "Continue"}<ArrowRight size={15} /></button>
    <div id="signup-recaptcha" />
    <p className="auth-switch-link">Already have an account? <a href="/login">Log in</a></p>
  </form>;
}
