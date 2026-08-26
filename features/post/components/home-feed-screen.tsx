"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { FeedPage, PostDTO } from "@/features/post/types/post";
import {
  deletePost,
  getHomeFeed,
  toggleLike,
} from "@/features/post/data";
import type { SessionUser } from "@/features/auth/types/user";
import { Composer } from "@/features/post/components/composer";
import { PostFeed } from "@/features/post/components/post-feed";

interface HomeFeedScreenProps {
  initialPage: FeedPage;
  user: SessionUser | null;
}

export function HomeFeedScreen({ initialPage, user }: HomeFeedScreenProps) {
  const [posts, setPosts] = useState<PostDTO[]>(initialPage.items);
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
      setPosts((current) => [
        ...current,
        ...page.items.filter(
          (item) => !current.some((existing) => existing.id === item.id)
        ),
      ]);
      setNextCursor(page.nextCursor);
    } catch {
      setLoadError("Couldn't load more posts.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCreated = (post: PostDTO) => {
    setPosts((current) => [post, ...current]);
  };

  const handleLikeToggle = (target: PostDTO) => {
    const optimistic: PostDTO = {
      ...target,
      likedByMe: !target.likedByMe,
      likeCount: target.likeCount + (target.likedByMe ? -1 : 1),
    };
    applyUpdate(optimistic);

    void toggleLike(target.id)
      .then((result) => {
        if (!result) throw new Error();
        applyUpdate({
          ...target,
          likedByMe: result.likedByMe,
          likeCount: result.likeCount,
        });
      })
      .catch(() => {
        applyUpdate(target);
        toast.error("Couldn't save that like");
      });
  };

  const handleEdited = (updated: PostDTO) => {
    applyUpdate(updated);
    toast.success("Post updated");
  };

  const handleDeleted = (postId: string) => {
    setPosts((current) => current.filter((post) => post.id !== postId));
    void deletePost(postId).catch(() =>
      toast.error("Couldn't delete post")
    );
    toast.success("Post deleted");
  };

  function applyUpdate(post: PostDTO) {
    setPosts((current) =>
      current.map((item) => (item.id === post.id ? post : item))
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {user ? (
        <Composer
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          onCreated={handleCreated}
        />
      ) : null}
      <PostFeed
        posts={posts}
        viewerUsername={user?.username ?? null}
        nextCursor={nextCursor}
        loadingMore={loadingMore}
        loadError={loadError}
        onLoadMore={() => void loadMore()}
        onLikeToggle={handleLikeToggle}
        onEdited={handleEdited}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
