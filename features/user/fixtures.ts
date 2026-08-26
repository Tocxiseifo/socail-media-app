// TEMPORARY (mock data): delete when the user/follow backend lands.
import { mockAuthors } from "@/features/post/fixtures";

export interface MockUser extends Record<string, unknown> {
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
}

export const mockUsers: MockUser[] = [
  {
    username: "mira",
    displayName: "Mira Kova",
    bio: "Night-shift photographer. Printing the violet hour.",
    avatarUrl: null,
  },
  {
    username: "jonas",
    displayName: "Jonas Reinholt",
    bio: "Compact cameras, long walks, strong opinions about page 50.",
    avatarUrl: null,
  },
  {
    username: "aiko",
    displayName: "Aiko Tanabe",
    bio: "5am city walker. Films before coffee.",
    avatarUrl: null,
  },
  {
    username: "felix",
    displayName: "Felix Aranda",
    bio: "Design systems by day, deleting apps by night.",
    avatarUrl: null,
  },
];

// Directed edges: [followerUsername, followingUsername]
export const mockFollows: Array<readonly [string, string]> = [
  ["jonas", "mira"],
  ["aiko", "mira"],
  ["mira", "jonas"],
  ["mira", "aiko"],
  ["felix", "aiko"],
  ["jonas", "felix"],
];

export function mockAvatarFor(username: string): string | null {
  return mockAuthors[username]?.avatarUrl ?? null;
}
