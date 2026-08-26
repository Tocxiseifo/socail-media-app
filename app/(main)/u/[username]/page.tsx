import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileTextIcon, PencilIcon } from "lucide-react";

import { getCurrentUser } from "@/features/auth/data";
import { getPostsByAuthor } from "@/features/post/data";
import {
  getProfile,
  getUserFollowers,
  getUserFollowing,
} from "@/features/user/data";
import { ProfileHeader } from "@/features/user/components/profile-header";
import { FollowButton } from "@/features/user/components/follow-button";
import { ProfileTabs } from "@/features/user/components/profile-tabs";
import { ProfilePosts } from "@/features/user/components/profile-posts";
import { UserList } from "@/features/user/components/user-list";
import {
  EmptyState,
} from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username, null);
  if (!profile) return { title: "Profile not found" };
  return {
    title: `${profile.displayName} (@${profile.username})`,
    description: profile.bio ?? undefined,
  };
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const [{ username }, { tab }] = await Promise.all([params, searchParams]);

  const viewer = await getCurrentUser();
  const profile = await getProfile(username, viewer?.username ?? null);
  if (!profile) notFound();

  const [postsPage, followers, following] = await Promise.all([
    getPostsByAuthor({ username: profile.username }),
    getUserFollowers(profile.username, viewer?.username ?? null),
    getUserFollowing(profile.username, viewer?.username ?? null),
  ]);

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        action={
          profile.isSelf ? (
            <Link
              href="/settings/profile"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <PencilIcon strokeWidth={1.5} aria-hidden="true" />
              Edit profile
            </Link>
          ) : viewer ? (
            <FollowButton
              username={profile.username}
              initialIsFollowing={profile.isFollowing}
            />
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Follow
            </Link>
          )
        }
      />

      <ProfileTabs
        username={profile.username}
        initialTab={tab === "followers" || tab === "following" ? tab : "posts"}
        posts={
          postsPage.items.length === 0 ? (
            <EmptyState
              icon={FileTextIcon}
              title={profile.isSelf ? "You haven't posted yet" : "No posts yet"}
              description={
                profile.isSelf
                  ? "Share your first thought from the home feed."
                  : "When they post, it will show up here."
              }
              action={
                profile.isSelf ? (
                  <Link
                    href="/"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Go to feed
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <ProfilePosts
              username={profile.username}
              viewerUsername={viewer?.username ?? null}
              initialPage={postsPage}
            />
          )
        }
        followers={<UserList users={followers} viewerUsername={viewer?.username ?? null} />}
        following={<UserList users={following} viewerUsername={viewer?.username ?? null} />}
      />
    </div>
  );
}
