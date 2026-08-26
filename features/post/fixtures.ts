// TEMPORARY (mock data): delete when the post backend lands.
import type { PostAuthor, PostDTO } from "./types/post";

export const mockAuthors: Record<string, PostAuthor> = {
  mira: {
    id: "0198c7a2-7b6a-7d5f-9f3e-2b1d4a6c8e10",
    username: "mira",
    displayName: "Mira Kova",
    avatarUrl: null,
  },
  jonas: {
    id: "0198c7a2-7b6a-7d5f-9f3e-2b1d4a6c8e11",
    username: "jonas",
    displayName: "Jonas Reinholt",
    avatarUrl: null,
  },
  aiko: {
    id: "0198c7a2-7b6a-7d5f-9f3e-2b1d4a6c8e12",
    username: "aiko",
    displayName: "Aiko Tanabe",
    avatarUrl: null,
  },
  felix: {
    id: "0198c7a2-7b6a-7d5f-9f3e-2b1d4a6c8e13",
    username: "felix",
    displayName: "Felix Aranda",
    avatarUrl: null,
  },
};

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const mockPosts: PostDTO[] = [
  {
    id: "0198c7a3-0000-7000-8000-000000000001",
    author: mockAuthors.aiko,
    text: "Rewatched In the Mood for Love tonight. Every frame is a painting you have to sit very still to see.",
    imageUrl: null,
    likeCount: 24,
    commentCount: 3,
    likedByMe: false,
    createdAt: minutesAgo(18),
    editedAt: null,
  },
  {
    id: "0198c7a3-0000-7000-8000-000000000002",
    author: mockAuthors.jonas,
    text: "Hot take: the best camera is the one small enough to always be in your coat pocket. Shot this whole series on a compact.",
    imageUrl: "fixture-gradient",
    likeCount: 132,
    commentCount: 12,
    likedByMe: true,
    createdAt: minutesAgo(95),
    editedAt: null,
  },
  {
    id: "0198c7a3-0000-7000-8000-000000000003",
    author: mockAuthors.felix,
    text: "Uninstalled four apps from my phone this week. My attention span sent a thank-you note.",
    imageUrl: null,
    likeCount: 87,
    commentCount: 5,
    likedByMe: false,
    createdAt: minutesAgo(260),
    editedAt: minutesAgo(200),
  },
  {
    id: "0198c7a3-0000-7000-8000-000000000004",
    author: mockAuthors.mira,
    text: "Late-night studio session. New print series is almost there — violet hour on matte paper hits different.",
    imageUrl: "fixture-gradient",
    likeCount: 56,
    commentCount: 8,
    likedByMe: false,
    createdAt: minutesAgo(420),
    editedAt: null,
  },
  {
    id: "0198c7a3-0000-7000-8000-000000000005",
    author: mockAuthors.jonas,
    text: "Reading rule I keep coming back to: if a book hasn't earned page 50 by page 50, it never will.",
    imageUrl: null,
    likeCount: 41,
    commentCount: 9,
    likedByMe: false,
    createdAt: minutesAgo(900),
    editedAt: null,
  },
  {
    id: "0198c7a3-0000-7000-8000-000000000006",
    author: mockAuthors.aiko,
    text: "The city at 5am belongs to bakers, runners, and people who forgot to sleep. Tonight I was two of those.",
    imageUrl: null,
    likeCount: 73,
    commentCount: 4,
    likedByMe: true,
    createdAt: minutesAgo(1500),
    editedAt: null,
  },
  {
    id: "0198c7a3-0000-7000-8000-000000000007",
    author: mockAuthors.felix,
    text: "Portfolio advice nobody asks for: your best work is the piece you almost didn't publish.",
    imageUrl: null,
    likeCount: 210,
    commentCount: 17,
    likedByMe: false,
    createdAt: minutesAgo(2600),
    editedAt: null,
  },
  {
    id: "0198c7a3-0000-7000-8000-000000000008",
    author: mockAuthors.mira,
    text: "Reminder that 'curated' just means caring enough to choose. Choose fewer things, better.",
    imageUrl: null,
    likeCount: 98,
    commentCount: 6,
    likedByMe: false,
    createdAt: minutesAgo(4300),
    editedAt: null,
  },
];
