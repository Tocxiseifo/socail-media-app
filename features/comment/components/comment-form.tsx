"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
  COMMENT_TEXT_MAX_LENGTH,
  commentSchema,
} from "@/features/comment/schemas/comment";
import type { CommentDTO } from "@/features/comment/types/comment";
import { addComment } from "@/features/comment/data";
import type { PostAuthor } from "@/features/post/types/post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  postId: string;
  viewer: Pick<PostAuthor, "displayName" | "avatarUrl"> | null;
  onCreated: (created: CommentDTO) => void;
}

export function CommentForm({ postId, viewer, onCreated }: CommentFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!viewer) {
    return (
      <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>{" "}
        to join the conversation.
      </p>
    );
  }

  const canSubmit = text.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    const parsed = commentSchema.safeParse({ text });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid comment");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const created = await addComment({ postId, text: parsed.data.text });
      onCreated(created);
      setText("");
      toast.success("Comment added");
    } catch {
      toast.error("Couldn't post that comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="rounded-xl border bg-card p-4"
    >
      <label htmlFor={`comment-${postId}`} className="sr-only">
        Write a comment
      </label>
      <Textarea
        id={`comment-${postId}`}
        value={text}
        onChange={(event) => {
          setText(event.target.value.slice(0, COMMENT_TEXT_MAX_LENGTH));
          if (error) setError(null);
        }}
        placeholder="Add a quiet remark…"
        rows={2}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `comment-error-${postId}` : undefined}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        {error ? (
          <p
            id={`comment-error-${postId}`}
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {text.length}/{COMMENT_TEXT_MAX_LENGTH}
          </span>
          <Button type="submit" size="sm" disabled={!canSubmit}>
            {submitting ? "Posting…" : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
