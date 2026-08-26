import { z } from "zod";

export const RESERVED_USERNAMES: ReadonlySet<string> = new Set([
  "admin",
  "administrator",
  "api",
  "root",
  "system",
  "support",
  "help",
  "security",
  "official",
  "team",
  "staff",
  "mod",
  "moderator",
  "login",
  "logout",
  "signin",
  "signup",
  "register",
  "settings",
  "welcome",
  "explore",
  "search",
  "notifications",
  "messages",
  "post",
  "posts",
  "comment",
  "comments",
  "u",
  "user",
  "users",
  "me",
  "about",
  "privacy",
  "terms",
  "static",
  "assets",
]);

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-z][a-z0-9_]*$/,
    "Lowercase letters, numbers, and underscores only"
  )
  .refine((value) => !RESERVED_USERNAMES.has(value), {
    message: "That username is reserved",
  });

export const signupSchema = z.object({
  username: usernameSchema,
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(50, "Display name must be at most 50 characters"),
  email: z.email("Enter a valid email address").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Enter your email or username")
    .max(254),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
