import { AuthDisabledFlow } from "@/components/auth/AuthDisabledFlow";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { authEnabled } from "@/lib/auth/config";

export default function LoginPage() {
  if (!authEnabled) return <AuthDisabledFlow />;
  return <AuthShell title="Welcome back"><LoginForm /></AuthShell>;
}
