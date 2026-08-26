"use client";

import { UserXIcon } from "lucide-react";

import type { ProfileCardUser } from "@/features/user/types/user";
import { FollowButton } from "@/features/user/components/follow-button";
import { UserCard } from "@/features/user/components/user-card";
import { EmptyState } from "@/components/empty-state";

interface UserListProps {
  users: ProfileCardUser[];
  viewerUsername: string | null;
}

export function UserList({ users, viewerUsername }: UserListProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={UserXIcon}
        title="Nobody here yet"
        description="When someone joins this list, they'll show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          action={
            viewerUsername && user.username !== viewerUsername ? (
              <FollowButton
                username={user.username}
                initialIsFollowing={user.isFollowing}
              />
            ) : undefined
          }
        />
      ))}
    </div>
  );
}
