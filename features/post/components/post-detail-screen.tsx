"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";

import type { PostDTO } from "@/features/post/types/post";
import type { CommentDTO } from "@/features/comment/types/comment";
import type { SessionUser } from "@/features/auth/types/user";
import { deletePost, toggleLike } from "@/features/post/data";
import { PostCard } from "@/features/post/components/post-card";
import { CommentForm } from "@/features/comment/components/comment-form";
import { CommentThread } from "@/features/comment/components/comment-thread";

interface PostDetailScreenProps {
  initialPost: PostDTO;
  initialComments: CommentDTO[];
  user: SessionUser | null;
}

export function PostDetailScreen({
  initialPost,
  initialComments,
  user,
}: PostDetailScreenProps) {
  const router = useRouter();
  const [post, setPost] = useState<PostDTO>(initialPost);
  const [comments, setComments] = useState<CommentDTO[]>(initialComments);
  const [deleting, setDeleting] = useState(false);

  const handleLikeToggle = () => {
    const target = post;
    const optimistic: PostDTO = {
      ...target,
      likedByMe: !target.likedByMe,
      likeCount: target.likeCount + (target.likedByMe ? -1 : 1),
    };
    setPost(optimistic);

    void toggleLike(target.id ,target.likedByMe)
      .then((result) => {
        if (!result) throw new Error();
        setPost({
          ...target,
          likedByMe: result.likedByMe,
          likeCount: result.likeCount,
        });
      })
      .catch(() => {
        setPost(target);
        toast.error("Couldn't save that like");
      });
  };

  const handleCommentCreated = (created: CommentDTO) => {
    setComments((current) => [...current, created]);
    setPost((current) => ({ ...current, commentCount: current.commentCount + 1 }));
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((current) =>
      current.filter((comment) => comment.id !== commentId)
    );
    setPost((current) => ({
      ...current,
      commentCount: Math.max(0, current.commentCount - 1),
    }));
  };

  const handlePostDeleted = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deletePost(initialPost.id);
      toast.success("Post deleted");
      router.push("/");
    } catch {
      toast.error("Couldn't delete post");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeftIcon className="size-4" strokeWidth={1.5} aria-hidden="true" />
        Back to feed
      </Link>

      <PostCard
        post={post}
        viewerUsername={user?.username ?? null}
        onLikeToggle={handleLikeToggle}
        onEdited={setPost}
        onDeleted={() => void handlePostDeleted()}
      />

      <section aria-label="Conversation" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.05em] text-muted-foreground">
          Comments ({post.commentCount})
        </h2>

        <CommentForm
          postId={initialPost.id}
          viewer={user}
          onCreated={handleCommentCreated}
        />

        <CommentThread
          comments={comments}
          viewerUsername={user?.username ?? null}
          onDeleted={handleCommentDeleted}
        />
      </section>
    </div>
  );
}
