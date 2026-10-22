import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  sendEmailVerification,
  type ConfirmationResult,
} from "firebase/auth";
import { firebaseAuth, firebaseConfigured } from "@/lib/firebase/client";

export function requireFirebaseAuth() {
  if (!firebaseConfigured || !firebaseAuth) {
    throw new Error("Firebase authentication is not configured yet. Add the Firebase values to .env.local.");
  }
  return firebaseAuth;
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

export async function signInWithGoogle() {
  const auth = requireFirebaseAuth();
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(requireFirebaseAuth(), email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(requireFirebaseAuth(), email, password);
}

export async function sendVerificationEmail() {
  const user = requireFirebaseAuth().currentUser;
  if (!user) throw new Error("Your account session expired. Please start again.");
  return sendEmailVerification(user);
}

export function createPhoneVerifier(containerId: string) {
  return new RecaptchaVerifier(requireFirebaseAuth(), containerId, { size: "invisible" });
}

export async function requestPhoneCode(phone: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(requireFirebaseAuth(), phone, verifier);
}
