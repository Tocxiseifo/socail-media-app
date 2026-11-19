
import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth/data";
import { getHomeFeed } from "@/features/post/data";
import { HomeFeedScreen } from "@/features/post/components/home-feed-screen";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  // const [user, initialPage] = await Promise.all([
  //   getCurrentUser(),
  //   getHomeFeed(),
  // ]);
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home"
        description={user ? "Posts from people you follow." : undefined}
      />
      <HomeFeedScreen  initialPage={{
        items: [],
        nextCursor: null,
        }}
        user={user}
       />
    </div>
  );
}
