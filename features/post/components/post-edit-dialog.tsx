"use client";

import { useState } from "react";

import { POST_TEXT_MAX_LENGTH, postSchema } from "@/features/post/schemas/post";
import type { PostDTO } from "@/features/post/types/post";
import { updatePost } from "@/features/post/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PostEditDialogProps {
  post: PostDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (post: PostDTO) => void;
}

export function PostEditDialog({
  post,
  open,
  onOpenChange,
  onSaved,
}: PostEditDialogProps) {
  const [text, setText] = useState(post.text);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setText(post.text);
      setError(null);
    }
  }

  const canSave = text.trim().length > 0 && !saving;

  const handleSave = async () => {
    const parsed = postSchema.safeParse({ text });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid post");
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePost(post.id, parsed.data);
      if (updated) onSaved(updated);
      else setError("This post no longer exists.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>
            Changes are visible to everyone.
          </DialogDescription>
        </DialogHeader>

        <div>
          <label htmlFor={`edit-${post.id}`} className="sr-only">
            Post text
          </label>
          <Textarea
            id={`edit-${post.id}`}
            value={text}
            onChange={(event) => {
              setText(event.target.value.slice(0, POST_TEXT_MAX_LENGTH));
              if (error) setError(null);
            }}
            rows={4}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `edit-${post.id}-error` : undefined}
          />
          <div className="mt-2 flex items-center justify-between">
            {error ? (
              <p
                id={`edit-${post.id}-error`}
                role="alert"
                className="text-xs text-destructive"
              >
                {error}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-muted-foreground">
              {text.length}/{POST_TEXT_MAX_LENGTH}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!canSave} onClick={() => void handleSave()}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
