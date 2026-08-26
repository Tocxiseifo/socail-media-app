"use client";

import { useState } from "react";

import { usePostList } from "@/features/post/hooks/use-post-list";
import { getPostsByAuthor } from "@/features/post/data";
import { PostCard } from "@/features/post/components/post-card";
import { PostListSkeleton } from "@/features/post/components/post-list-skeleton";
import { Button } from "@/components/ui/button";

interface ProfilePostsProps {
  username: string;
  viewerUsername: string | null;
  initialPage: Awaited<ReturnType<typeof getPostsByAuthor>>;
}

export function ProfilePosts({
  username,
  viewerUsername,
  initialPage,
}: ProfilePostsProps) {
  const { posts, likeToggle, edited, deleted, append } = usePostList({
    initialItems: initialPage.items,
  });
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialPage.nextCursor
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    setLoadError(null);
    try {
      const page = await getPostsByAuthor({ username, cursor: nextCursor });
      append(page.items);
      setNextCursor(page.nextCursor);
    } catch {
      setLoadError("Couldn't load more posts.");
    } finally {
      setLoadingMore(false);
    }
  };

  if (posts.length === 0 && !loadError && !loadingMore) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          viewerUsername={viewerUsername}
          onLikeToggle={likeToggle}
          onEdited={edited}
          onDeleted={deleted}
        />
      ))}

      {nextCursor || loadError ? (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => void loadMore()}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}

      {loadingMore ? <PostListSkeleton count={2} /> : null}
    </div>
  );
}
