"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";

import {
  signupSchema,
  type SignupInput,
} from "@/features/auth/schemas/auth";
import { FormActions, FormField } from "@/features/auth/components/form-field";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: standardSchemaResolver(signupSchema),
    defaultValues: { username: "", displayName: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignupInput) => {
    void values;
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Welcome to Vesper (demo)");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField
        id="displayName"
        label="Display name"
        autoComplete="name"
        placeholder="How should we call you?"
        registration={register("displayName")}
        error={errors.displayName?.message}
      />
      <FormField
        id="username"
        label="Username"
        autoComplete="off"
        placeholder="lowercase, e.g. mira_k"
        registration={register("username")}
        error={errors.username?.message}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        registration={register("email")}
        error={errors.email?.message}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        registration={register("password")}
        error={errors.password?.message}
      />
      <FormActions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </FormActions>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
