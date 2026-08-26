import { z } from "zod";

export const COMMENT_TEXT_MAX_LENGTH = 280;

export const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Write something first")
    .max(
      COMMENT_TEXT_MAX_LENGTH,
      `Comments are limited to ${COMMENT_TEXT_MAX_LENGTH} characters`
    ),
});

export type CommentInput = z.infer<typeof commentSchema>;
