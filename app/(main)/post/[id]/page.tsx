import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/features/auth/data";
import { getPostById } from "@/features/post/data";
import { getComments } from "@/features/comment/data";
import { PostDetailScreen } from "@/features/post/components/post-detail-screen";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.author.displayName}: "${post.text.slice(0, 48)}${post.text.length > 48 ? "…" : ""}"`,
    description: post.text.slice(0, 160),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const [post, comments, user] = await Promise.all([
    getPostById(id),
    getComments(id),
    getCurrentUser(),
  ]);

  if (!post) notFound();

  return (
    <PostDetailScreen
      initialPost={post}
      initialComments={comments}
      user={user}
    />
  );
}
