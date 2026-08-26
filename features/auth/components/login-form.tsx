"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";

import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/auth";
import { FormActions, FormField } from "@/features/auth/components/form-field";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Logged in (demo) — sessions arrive with the backend");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField
        id="identifier"
        label="Email or username"
        autoComplete="username"
        placeholder="you@example.com"
        registration={register("identifier")}
        error={errors.identifier?.message}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        registration={register("password")}
        error={errors.password?.message}
      />
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </FormActions>
      <p className="text-center text-sm text-muted-foreground">
        New to Vesper?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
