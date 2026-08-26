"use client";

import type { CommentDTO } from "@/features/comment/types/comment";
import { CommentItem } from "@/features/comment/components/comment-item";
import { EmptyState } from "@/components/empty-state";
import { MessagesSquareIcon } from "lucide-react";

interface CommentThreadProps {
  comments: CommentDTO[];
  viewerUsername: string | null;
  onDeleted: (commentId: string) => void;
}

export function CommentThread({
  comments,
  viewerUsername,
  onDeleted,
}: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquareIcon}
        title="No comments yet"
        description="Be the first to leave a quiet remark."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          viewerUsername={viewerUsername}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}
