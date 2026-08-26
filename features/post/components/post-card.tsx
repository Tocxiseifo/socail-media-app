"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { timeAgo } from "@/lib/time";
import type { PostDTO } from "@/features/post/types/post";
import { PostEditDialog } from "@/features/post/components/post-edit-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostDTO;
  viewerUsername: string | null;
  onLikeToggle?: (post: PostDTO) => void;
  onEdited?: (post: PostDTO) => void;
  onDeleted?: (postId: string) => void;
}

function initials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function PostCard({
  post,
  viewerUsername,
  onLikeToggle,
  onEdited,
  onDeleted,
}: PostCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = post.author.username === viewerUsername;
  const isGuest = viewerUsername === null;

  return (
    <article className="group rounded-xl border bg-card p-4 transition-shadow hover:shadow-glow sm:p-6">
      <div className="flex items-start gap-3">
        <Link
          href={`/u/${post.author.username}`}
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${post.author.displayName}'s profile`}
        >
          <Avatar>
            {post.author.avatarUrl ? (
              <AvatarImage src={post.author.avatarUrl} alt="" />
            ) : null}
            <AvatarFallback>{initials(post.author.displayName)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <Link
              href={`/u/${post.author.username}`}
              className="truncate text-sm font-semibold hover:underline"
            >
              {post.author.displayName}
            </Link>
            <span className="truncate text-xs text-muted-foreground">
              @{post.author.username}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            <time dateTime={post.createdAt} title={new Date(post.createdAt).toLocaleString()}>
              {timeAgo(post.createdAt)}
            </time>
            {post.editedAt ? <span> · edited</span> : null}
          </p>
        </div>

        {isOwner ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Post options for "${post.text.slice(0, 40)}"`}
                  className={cn(
                    "opacity-60 transition-opacity sm:opacity-0 sm:group-hover:opacity-100",
                    "focus-visible:sm:opacity-100 data-popup-open:sm:opacity-100"
                  )}
                />
              }
            >
              <MoreHorizontalIcon strokeWidth={1.5} aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <PencilIcon strokeWidth={1.5} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2Icon strokeWidth={1.5} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <p className="mt-3 whitespace-pre-wrap break-words text-base leading-6 md:text-lg md:leading-7">
        {post.text}
      </p>

      {post.imageUrl ? (
        <div
          aria-hidden="true"
          className="mt-4 aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-primary/30 via-secondary/40 to-background"
        />
      ) : null}

      <div className="mt-3 flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        {isGuest || !onLikeToggle ? (
          <span className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground">
            <HeartIcon
              className={cn("size-4", post.likedByMe && "fill-primary text-primary")}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>{post.likeCount}</span>
            <span className="sr-only">likes</span>
          </span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={post.likedByMe}
            aria-label={post.likedByMe ? "Unlike" : "Like"}
            className={cn(
              "gap-1.5 text-muted-foreground",
              post.likedByMe && "text-primary"
            )}
            onClick={() => onLikeToggle(post)}
          >
            <HeartIcon
              className={cn("size-4", post.likedByMe && "fill-primary")}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {post.likeCount}
          </Button>
        )}

        <Link
          href={`/post/${post.id}`}
          aria-label={`Comments on this post (${post.commentCount})`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1.5 text-muted-foreground"
          )}
        >
          <MessageCircleIcon strokeWidth={1.5} aria-hidden="true" />
          {post.commentCount}
        </Link>
      </div>

      {isOwner ? (
        <>
          <PostEditDialog
            post={post}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSaved={(updated) => {
              setEditOpen(false);
              onEdited?.(updated);
            }}
          />
          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete this post?"
            description="This cannot be undone."
            confirmLabel="Delete"
            destructive
            onConfirm={() => onDeleted?.(post.id)}
          />
        </>
      ) : null}
    </article>
  );
}
