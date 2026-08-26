import type {
  CreatePostInput,
  FeedPage,
  PostDTO,
} from "@/features/post/types/post";
import { mockPosts } from "@/features/post/fixtures";

// Flip to verify loading/empty/error UI without a backend:
const SCENARIO: "ok" | "empty" | "error" = "ok";

const PAGE_SIZE = 5;

let store: PostDTO[] = [...mockPosts];

const likedByViewer = new Set(
  mockPosts.filter((post) => post.likedByMe).map((post) => post.id)
);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHomeFeed(options?: {
  cursor?: string;
}): Promise<FeedPage> {
  await delay(250);

  if (SCENARIO === "empty") return { items: [], nextCursor: null };
  if (SCENARIO === "error") throw new Error("Feed unavailable");

  const start = options?.cursor
    ? store.findIndex((post) => post.id === options.cursor) + 1
    : 0;

  if (start < 0 || start >= store.length) {
    return { items: [], nextCursor: null };
  }

  const items = store.slice(start, start + PAGE_SIZE);
  const nextIndex = start + items.length;

  return {
    items,
    nextCursor: nextIndex < store.length ? items[items.length - 1].id : null,
  };
}

export async function toggleLike(
  id: string
): Promise<{ likedByMe: boolean; likeCount: number } | null> {
  await delay(150);

  const post = store.find((item) => item.id === id);
  if (!post) return null;

  const willLike = !likedByViewer.has(id);
  if (willLike) likedByViewer.add(id);
  else likedByViewer.delete(id);

  const likeCount = Math.max(0, post.likeCount + (willLike ? 1 : -1));
  store = store.map((item) =>
    item.id === id ? { ...item, likeCount, likedByMe: willLike } : item
  );

  return { likedByMe: willLike, likeCount };
}

export async function getPostsByAuthor(options?: {
  username: string;
  cursor?: string;
}): Promise<FeedPage> {
  await delay(250);

  const authorPosts = store.filter(
    (post) => post.author.username === options?.username
  );

  const start = options?.cursor
    ? authorPosts.findIndex((post) => post.id === options.cursor) + 1
    : 0;

  if (start < 0 || start >= authorPosts.length) {
    return { items: [], nextCursor: null };
  }

  const items = authorPosts.slice(start, start + PAGE_SIZE);
  const nextIndex = start + items.length;

  return {
    items,
    nextCursor: nextIndex < authorPosts.length ? items[items.length - 1].id : null,
  };
}

export function countPostsByAuthor(username: string): number {
  return store.filter((post) => post.author.username === username).length;
}

export async function adjustCommentCount(
  id: string,
  delta: 1 | -1
): Promise<void> {
  const post = store.find((item) => item.id === id);
  if (!post) return;

  store = store.map((item) =>
    item.id === id
      ? { ...item, commentCount: Math.max(0, item.commentCount + delta) }
      : item
  );
}

export async function getPostById(id: string): Promise<PostDTO | null> {
  await delay(150);
  return store.find((post) => post.id === id) ?? null;
}

export async function createPost(input: CreatePostInput): Promise<PostDTO> {
  const { getCurrentUser } = await import("@/features/auth/data");
  const user = await getCurrentUser();

  if (!user) throw new Error("Authentication required");

  const post: PostDTO = {
    id: crypto.randomUUID(),
    author: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    },
    text: input.text.trim(),
    imageUrl: null,
    likeCount: 0,
    commentCount: 0,
    likedByMe: false,
    createdAt: new Date().toISOString(),
    editedAt: null,
  };

  store = [post, ...store];
  return post;
}

export async function updatePost(
  id: string,
  input: CreatePostInput
): Promise<PostDTO | null> {
  await delay(200);
  const existing = store.find((post) => post.id === id);
  if (!existing) return null;

  const updated: PostDTO = {
    ...existing,
    text: input.text.trim(),
    editedAt: new Date().toISOString(),
  };
  store = store.map((post) => (post.id === id ? updated : post));
  return updated;
}

export async function deletePost(id: string): Promise<void> {
  await delay(200);
  store = store.filter((post) => post.id !== id);
}
