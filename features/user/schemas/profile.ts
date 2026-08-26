import { z } from "zod";

export const BIO_MAX_LENGTH = 160;

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(50, "Display name must be at most 50 characters"),
  bio: z
    .string()
    .trim()
    .max(BIO_MAX_LENGTH, `Bio must be at most ${BIO_MAX_LENGTH} characters`),
});

export type ProfileInput = z.infer<typeof profileSchema>;
