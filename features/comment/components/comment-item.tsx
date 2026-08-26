"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2Icon } from "lucide-react";

import { timeAgo } from "@/lib/time";
import type { CommentDTO } from "@/features/comment/types/comment";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CommentItemProps {
  comment: CommentDTO;
  viewerUsername: string | null;
  onDeleted?: (commentId: string) => void;
}

function initials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function CommentItem({
  comment,
  viewerUsername,
  onDeleted,
}: CommentItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isOwner = comment.author.username === viewerUsername;

  return (
    <div className="group flex gap-3 rounded-xl border bg-card p-4">
      <Link
        href={`/u/${comment.author.username}`}
        className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${comment.author.displayName}'s profile`}
      >
        <Avatar size="sm">
          {comment.author.avatarUrl ? (
            <AvatarImage src={comment.author.avatarUrl} alt="" />
          ) : null}
          <AvatarFallback>{initials(comment.author.displayName)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/u/${comment.author.username}`}
            className="truncate text-sm font-semibold hover:underline"
          >
            {comment.author.displayName}
          </Link>
          <span className="truncate text-xs text-muted-foreground">
            @{comment.author.username}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <time
            dateTime={comment.createdAt}
            title={new Date(comment.createdAt).toLocaleString()}
            className="text-xs text-muted-foreground"
          >
            {timeAgo(comment.createdAt)}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5">
          {comment.text}
        </p>
      </div>

      {isOwner && onDeleted ? (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete your comment: ${comment.text.slice(0, 40)}`}
            className="shrink-0 opacity-60 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus-visible:sm:opacity-100 hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete this comment?"
            description="This cannot be undone."
            confirmLabel="Delete"
            destructive
            onConfirm={() => onDeleted(comment.id)}
          />
        </>
      ) : null}
    </div>
  );
}
