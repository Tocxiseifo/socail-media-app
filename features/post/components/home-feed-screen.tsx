"use client";

import { useState } from "react";

import type { FeedPage } from "@/features/post/types/post";
import { usePostList } from "@/features/post/hooks/use-post-list";
import { getHomeFeed } from "@/features/post/data";
import type { SessionUser } from "@/features/auth/types/user";
import { Composer } from "@/features/post/components/composer";
import { PostFeed } from "@/features/post/components/post-feed";

interface HomeFeedScreenProps {
  initialPage: FeedPage;
  user: SessionUser | null;
}

export function HomeFeedScreen({ initialPage, user }: HomeFeedScreenProps) {
  const { posts, likeToggle, edited, deleted, prepend } = usePostList({
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
      const page = await getHomeFeed({ cursor: nextCursor });
      // append(page.items);
      setNextCursor(page.nextCursor);
    } catch {
      setLoadError("Couldn't load more posts.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {user ? (
        <Composer
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          onCreated={prepend}
        />
      ) : null}
      <PostFeed
        posts={posts}
        viewerUsername={user?.username ?? null}
        nextCursor={nextCursor}
        loadingMore={loadingMore}
        loadError={loadError}
        onLoadMore={() => void loadMore()}
        onLikeToggle={likeToggle}
        onEdited={edited}
        onDeleted={deleted}
      />
    </div>
  );
}
