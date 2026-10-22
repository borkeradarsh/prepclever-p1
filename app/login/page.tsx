import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  return <AuthShell title="Welcome back"><LoginForm /></AuthShell>;
}
