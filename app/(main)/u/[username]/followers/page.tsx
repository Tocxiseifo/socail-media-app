import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getCurrentUser } from "@/features/auth/data";
import {
  getProfile,
  getUserFollowers,
} from "@/features/user/data";
import { UserList } from "@/features/user/components/user-list";
import { PageHeader } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FollowerListPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: FollowerListPageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `People following @${username}` };
}

export default async function FollowersPage({ params }: FollowerListPageProps) {
  const { username } = await params;

  const viewer = await getCurrentUser();
  const profile = await getProfile(username, viewer?.username ?? null);
  if (!profile) notFound();

  const followers = await getUserFollowers(
    profile.username,
    viewer?.username ?? null
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Followers of @${profile.username}`}
        description={`${profile.followerCount} ${
          profile.followerCount === 1 ? "person" : "people"
        }`}
        actions={
          <Link
            href={`/u/${profile.username}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeftIcon strokeWidth={1.5} aria-hidden="true" />
            Profile
          </Link>
        }
      />
      <UserList users={followers} viewerUsername={viewer?.username ?? null} />
    </div>
  );
}
