"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth";
import { FormField } from "@/features/auth/components/form-field";
import { FormActions } from "@/features/auth/components/form-field";
import { useAuth } from "@/features/auth/context";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    try {
      await login(values.identifier, values.password);
      toast.success("Welcome back");
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField
        id="identifier"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("identifier")}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormActions
        submitLabel={isSubmitting ? "Logging in..." : "Log in"}
        submitDisabled={isSubmitting}
        linkHref="/signup"
        linkLabel="Create an account"
      />
    </form>
  );
}
