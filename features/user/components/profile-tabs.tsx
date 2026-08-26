"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ProfileTabsProps {
  username: string;
  initialTab: ProfileTab;
  posts: React.ReactNode;
  followers: React.ReactNode;
  following: React.ReactNode;
}

export type ProfileTab = "posts" | "followers" | "following";

const TABS: ProfileTab[] = ["posts", "followers", "following"];

function normalizeTab(value: string | undefined): ProfileTab {
  return TABS.includes(value as ProfileTab) ? (value as ProfileTab) : "posts";
}

export function ProfileTabs({
  username,
  initialTab,
  posts,
  followers,
  following,
}: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = normalizeTab(searchParams.get("tab") ?? initialTab);

  const select = (next: string) => {
    const target = normalizeTab(next);
    router.push(
      target === "posts" ? `/u/${username}` : `/u/${username}?tab=${target}`,
      { scroll: false }
    );
  };

  return (
    <Tabs value={tab} onValueChange={select}>
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="mt-4">
        {posts}
      </TabsContent>
      <TabsContent value="followers" className="mt-4">
        {followers}
      </TabsContent>
      <TabsContent value="following" className="mt-4">
        {following}
      </TabsContent>
    </Tabs>
  );
}
