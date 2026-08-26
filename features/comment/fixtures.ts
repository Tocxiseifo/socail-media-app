// TEMPORARY (mock data): delete when the comment backend lands.
import type { CommentDTO } from "@/features/comment/types/comment";
import { mockAuthors } from "@/features/post/fixtures";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const mockComments: CommentDTO[] = [
  {
    id: "0198c7a4-0000-7000-8000-000000000001",
    postId: "0198c7a3-0000-7000-8000-000000000001",
    author: mockAuthors.jonas,
    text: "The hallway scene rewired something in me. No notes.",
    createdAt: minutesAgo(12),
  },
  {
    id: "0198c7a4-0000-7000-8000-000000000002",
    postId: "0198c7a3-0000-7000-8000-000000000001",
    author: mockAuthors.mira,
    text: "Watching it with subtitles changes everything — the glances do the talking.",
    createdAt: minutesAgo(8),
  },
  {
    id: "0198c7a4-0000-7000-8000-000000000003",
    postId: "0198c7a3-0000-7000-8000-000000000002",
    author: mockAuthors.aiko,
    text: "Compact camera supremacy. What are you shooting, mostly night streets?",
    createdAt: minutesAgo(40),
  },
  {
    id: "0198c7a4-0000-7000-8000-000000000004",
    postId: "0198c7a3-0000-7000-8000-000000000004",
    author: mockAuthors.felix,
    text: "Violet hour on matte paper — please drop a print run, I'm ready.",
    createdAt: minutesAgo(120),
  },
  {
    id: "0198c7a4-0000-7000-8000-000000000005",
    postId: "0198c7a3-0000-7000-8000-000000000003",
    author: mockAuthors.mira,
    text: "Which four? Asking so I can judge quietly.",
    createdAt: minutesAgo(200),
  },
];
