export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isSelf: boolean;
}

export interface ProfileCardUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isFollowing: boolean;
}

export interface FollowState {
  isFollowing: boolean;
  followerCount: number;
}
