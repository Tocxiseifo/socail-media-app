"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { PostDTO } from "@/features/post/types/post";
import { deletePost, toggleLike } from "@/features/post/data";

interface UsePostListOptions {
  initialItems: PostDTO[];
}

export function usePostList({ initialItems }: UsePostListOptions) {
  const [posts, setPosts] = useState<PostDTO[]>(initialItems);

  function applyUpdate(updated: PostDTO) {
    setPosts((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
  }

  function likeToggle(target: PostDTO) {
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
  }

  function edited(updated: PostDTO) {
    applyUpdate(updated);
    toast.success("Post updated");
  }

  function deleted(postId: string) {
    setPosts((current) => current.filter((post) => post.id !== postId));
    void deletePost(postId).catch(() => toast.error("Couldn't delete post"));
    toast.success("Post deleted");
  }

  function prepend(item: PostDTO) {
    setPosts((current) => [item, ...current]);
  }

  // function append(items: PostDTO[]) {
  //   setPosts((current) => [
  //     ...current,
  //     ...items.filter(
  //       (item) => !current.some((existing) => existing.id === item.id)
  //     ),
  //   ]);
  // }

  return { posts, likeToggle, edited, deleted, prepend };
}
