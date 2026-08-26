import { getCurrentUser } from "@/features/auth/data";
import { adjustCommentCount } from "@/features/post/data";
import type {
  AddCommentInput,
  CommentDTO,
} from "@/features/comment/types/comment";
import { mockComments } from "@/features/comment/fixtures";

let store: CommentDTO[] = [...mockComments];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getComments(postId: string): Promise<CommentDTO[]> {
  await delay(150);
  return store
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addComment(input: AddCommentInput): Promise<CommentDTO> {
  const viewer = await getCurrentUser();
  if (!viewer) throw new Error("Authentication required");

  await delay(200);

  const comment: CommentDTO = {
    id: crypto.randomUUID(),
    postId: input.postId,
    author: {
      id: viewer.id,
      username: viewer.username,
      displayName: viewer.displayName,
      avatarUrl: viewer.avatarUrl,
    },
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
  };

  store = [...store, comment];
  await adjustCommentCount(input.postId, 1);
  return comment;
}

export async function deleteComment(commentId: string): Promise<void> {
  const existing = store.find((comment) => comment.id === commentId);
  if (!existing) return;

  await delay(150);
  store = store.filter((comment) => comment.id !== commentId);
  await adjustCommentCount(existing.postId, -1);
}
