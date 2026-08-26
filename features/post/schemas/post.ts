import { z } from "zod";

export const POST_TEXT_MAX_LENGTH = 500;

export const postSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Write something first")
    .max(
      POST_TEXT_MAX_LENGTH,
      `Posts are limited to ${POST_TEXT_MAX_LENGTH} characters`
    ),
});

export type PostInput = z.infer<typeof postSchema>;
