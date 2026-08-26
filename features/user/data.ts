import { getCurrentUser } from "@/features/auth/data";
import { countPostsByAuthor } from "@/features/post/data";
import type {
  FollowState,
  ProfileCardUser,
  UserProfile,
} from "@/features/user/types/user";
import type { ProfileInput } from "@/features/user/schemas/profile";
import { mockFollows, mockUsers } from "@/features/user/fixtures";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findUser(username: string) {
  const target = username.toLowerCase();
  return mockUsers.find((user) => user.username === target);
}

function followerCountOf(username: string): number {
  const target = username.toLowerCase();
  return mockFollows.filter(([, following]) => following === target).length;
}

function isFollowingUser(viewerUsername: string | null, username: string): boolean {
  if (!viewerUsername) return false;
  const target = username.toLowerCase();
  return mockFollows.some(
    ([source, following]) => source === viewerUsername && following === target
  );
}

export async function getProfile(
  username: string,
  viewerUsername: string | null
): Promise<UserProfile | null> {
  await delay(200);

  const user = findUser(username);
  if (!user) return null;

  return {
    id: `usr-${user.username}`,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    postCount: countPostsByAuthor(user.username),
    followerCount: followerCountOf(user.username),
    followingCount: mockFollows.filter(
      ([source]) => source === user.username
    ).length,
    isFollowing: isFollowingUser(viewerUsername, user.username),
    isSelf: viewerUsername === user.username,
  };
}

async function toCardUsers(
  usernames: string[],
  viewerUsername: string | null
): Promise<ProfileCardUser[]> {
  return usernames
    .map((username) => findUser(username))
    .filter((user): user is NonNullable<typeof user> => Boolean(user))
    .map((user) => ({
      id: `usr-${user.username}`,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isFollowing: isFollowingUser(viewerUsername, user.username),
    }));
}

export async function getUserFollowers(
  username: string,
  viewerUsername: string | null
): Promise<ProfileCardUser[]> {
  await delay(150);
  const target = username.toLowerCase();
  const followerNames = mockFollows
    .filter(([, following]) => following === target)
    .map(([follower]) => follower);
  return toCardUsers(followerNames, viewerUsername);
}

export async function getUserFollowing(
  username: string,
  viewerUsername: string | null
): Promise<ProfileCardUser[]> {
  await delay(150);
  const target = username.toLowerCase();
  const followingNames = mockFollows
    .filter(([follower]) => follower === target)
    .map(([, following]) => following);
  return toCardUsers(followingNames, viewerUsername);
}

export async function updateProfile(
  input: ProfileInput
): Promise<UserProfile | null> {
  const viewer = await getCurrentUser();
  if (!viewer) throw new Error("Authentication required");

  await delay(200);

  const user = findUser(viewer.username);
  if (!user) return null;

  user.displayName = input.displayName;
  user.bio = input.bio.length > 0 ? input.bio : null;

  return getProfile(user.username, viewer.username);
}

export async function toggleFollow(username: string): Promise<FollowState> {
  await delay(150);

  const viewer = await getCurrentUser();
  if (!viewer) throw new Error("Authentication required");

  const target = username.toLowerCase();
  if (viewer.username === target) {
    throw new Error("You cannot follow yourself");
  }

  const edgeIndex = mockFollows.findIndex(
    ([source, following]) => source === viewer.username && following === target
  );

  let isFollowing: boolean;
  if (edgeIndex >= 0) {
    mockFollows.splice(edgeIndex, 1);
    isFollowing = false;
  } else {
    mockFollows.push([viewer.username, target]);
    isFollowing = true;
  }

  return { isFollowing, followerCount: followerCountOf(target) };
}
