import Link from "next/link";
import type { ReactNode } from "react";

import type { ProfileCardUser } from "@/features/user/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCardProps {
  user: ProfileCardUser;
  action?: ReactNode;
}

function initials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function UserCard({ user, action }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <Link
        href={`/u/${user.username}`}
        className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${user.displayName}'s profile`}
      >
        <Avatar>
          {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
          <AvatarFallback>{initials(user.displayName)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/u/${user.username}`}
          className="block truncate text-sm font-semibold hover:underline"
        >
          {user.displayName}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          @{user.username}
        </p>
        {user.bio ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">{user.bio}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
