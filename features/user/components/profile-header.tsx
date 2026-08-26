import type { ReactNode } from "react";

import type { UserProfile } from "@/features/user/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  profile: UserProfile;
  action?: ReactNode;
}

function initials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function ProfileHeader({ profile, action }: ProfileHeaderProps) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar className="size-20 shrink-0">
          {profile.avatarUrl ? (
            <AvatarImage src={profile.avatarUrl} alt="" />
          ) : null}
          <AvatarFallback className="text-xl">
            {initials(profile.displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-[-0.01em]">
                {profile.displayName}
              </h1>
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
            </div>
            {action ? (
              <div className="shrink-0">{action}</div>
            ) : null}
          </div>

          {profile.bio ? (
            <p className="mt-3 max-w-prose text-sm leading-6 text-muted-foreground">
              {profile.bio}
            </p>
          ) : null}

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">
            <div className="flex gap-1.5">
              <dt>Posts</dt>
              <dd className="text-foreground">{profile.postCount}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Followers</dt>
              <dd className="text-foreground">{profile.followerCount}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Following</dt>
              <dd className="text-foreground">{profile.followingCount}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
