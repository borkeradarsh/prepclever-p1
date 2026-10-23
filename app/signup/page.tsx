import { AuthDisabledFlow } from "@/components/auth/AuthDisabledFlow";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { authEnabled } from "@/lib/auth/config";

export default function SignupPage() {
  if (!authEnabled) return <AuthDisabledFlow />;
  return <AuthShell title="Create your account"><SignupForm /></AuthShell>;
}
