"use client";

import Link from "next/link";
import { GhostIcon } from "lucide-react";

import type { PostDTO } from "@/features/post/types/post";
import { PostCard } from "@/features/post/components/post-card";
import { PostListSkeleton } from "@/features/post/components/post-list-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";

interface PostFeedProps {
  posts: PostDTO[];
  viewerUsername: string | null;
  nextCursor: string | null;
  loadingMore: boolean;
  loadError: string | null;
  onLoadMore: () => void;
  onLikeToggle: (post: PostDTO) => void;
  onEdited: (post: PostDTO) => void;
  onDeleted: (postId: string) => void;
}

export function PostFeed({
  posts,
  viewerUsername,
  nextCursor,
  loadingMore,
  loadError,
  onLoadMore,
  onLikeToggle,
  onEdited,
  onDeleted,
}: PostFeedProps) {
  if (posts.length === 0 && !loadError && !loadingMore) {
    return (
      <EmptyState
        icon={GhostIcon}
        title="Your feed is quiet"
        description="Follow a few people and their nights will show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          viewerUsername={viewerUsername}
          onLikeToggle={onLikeToggle}
          onEdited={onEdited}
          onDeleted={onDeleted}
        />
      ))}

      {loadError ? (
        <ErrorState
          title="Couldn't load posts"
          description={loadError}
          onRetry={onLoadMore}
          className="py-10"
        />
      ) : null}

      {nextCursor && !loadError ? (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}

      {loadingMore ? <PostListSkeleton count={2} /> : null}

      {!nextCursor && posts.length > 0 ? (
        <p className="pt-2 text-center text-xs text-muted-foreground">
          You&apos;re all caught up. <Link href="/welcome" className="underline underline-offset-4">What is Vesper?</Link>
        </p>
      ) : null}
    </div>
  );
}
