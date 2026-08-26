import type { PostAuthor } from "@/features/post/types/post";

export interface CommentDTO {
  id: string;
  postId: string;
  author: PostAuthor;
  text: string;
  createdAt: string;
}

export interface AddCommentInput {
  postId: string;
  text: string;
}
