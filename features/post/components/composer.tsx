"use client";

import { useState } from "react";
import { Loader2Icon, SendHorizontalIcon } from "lucide-react";
import { toast } from "sonner";

import { POST_TEXT_MAX_LENGTH, postSchema } from "@/features/post/schemas/post";
import type { PostDTO } from "@/features/post/types/post";
import { createPost } from "@/features/post/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface ComposerProps {
  displayName: string;
  avatarUrl: string | null;
  onCreated: (post: PostDTO) => void;
}

function initials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function Composer({ displayName, avatarUrl, onCreated }: ComposerProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0 && !submitting;

  const handleSubmit = async () => {
    const parsed = postSchema.safeParse({ text });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid post");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const post = await createPost(parsed.data);
      onCreated(post);
      setText("");
      toast.success("Posted");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-label="Create a post" className="rounded-xl border bg-card p-4 sm:p-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        className="flex gap-3"
      >
        <Avatar className="mt-1 hidden size-10 sm:flex">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback>{initials(displayName)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <label htmlFor="composer-text" className="sr-only">
            What is happening in your night?
          </label>
          <Textarea
            id="composer-text"
            value={text}
            onChange={(event) => {
              setText(event.target.value.slice(0, POST_TEXT_MAX_LENGTH));
              if (error) setError(null);
            }}
            placeholder="Say something worth keeping…"
            rows={3}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? "composer-error" : "composer-counter"
            }
            className="text-base"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            {error ? (
              <p id="composer-error" role="alert" className="text-xs text-destructive">
                {error}
              </p>
            ) : (
              <span className="text-xs text-muted-foreground">Share it before dawn.</span>
            )}
            <div className="flex items-center gap-3">
              <span
                id="composer-counter"
                className={
                  text.length > POST_TEXT_MAX_LENGTH - 60
                    ? "text-xs font-medium text-destructive"
                    : "text-xs text-muted-foreground"
                }
              >
                {text.length}/{POST_TEXT_MAX_LENGTH}
              </span>
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
              >
                {submitting ? (
                  <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <SendHorizontalIcon strokeWidth={1.5} aria-hidden="true" />
                )}
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
