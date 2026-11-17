"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signupSchema, type SignupInput } from "@/features/auth/schemas/auth";
import { FormField } from "@/features/auth/components/form-field";
import { FormActions } from "@/features/auth/components/form-actions";
import { useAuth } from "@/features/auth/context";

export function SignupForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupInput) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        email: values.email,
        username: values.username,
        displayName: values.displayName,
        password: values.password,
      });
      toast.success("Account created");
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign up failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        registration={register("identifier")}
      />
      <FormField
        id="username"
        label="Username"
        autoComplete="username"
        placeholder="mira"
        error={errors.username?.message}
        {...register("username")}
      />
      <FormField
        id="displayName"
        label="Display name"
        autoComplete="name"
        placeholder="Mira"
        error={errors.displayName?.message}
        {...register("displayName")}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <FormActions
        submitLabel={isSubmitting ? "Creating account..." : "Sign up"}
        submitDisabled={isSubmitting}
        linkHref="/login"
        linkLabel="Log in"
      />
    </form>
  );
}
