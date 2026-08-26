import type { Metadata } from "next";
import { GhostIcon } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Home" />
      <EmptyState
        icon={GhostIcon}
        title="Your feed is quiet for now"
        description="The feed lands with the next milestone. Follow a few people to fill this space."
        action={
          <Button variant="outline" size="sm">
            Explore
          </Button>
        }
      />
    </div>
  );
}
