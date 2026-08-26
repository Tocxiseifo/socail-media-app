import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Log in to your Vesper account.">
      <LoginForm />
    </AuthCard>
  );
}
