import { SignupForm } from "@/components/auth/SignupForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function SignupPage() {
  return <AuthShell title="Create your account"><SignupForm /></AuthShell>;
}
