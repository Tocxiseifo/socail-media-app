"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { FollowState } from "@/features/user/types/user";
import { toggleFollow } from "@/features/user/data";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  username: string;
  initialIsFollowing: boolean;
  onChanged?: (state: FollowState) => void;
}

export function FollowButton({
  username,
  initialIsFollowing,
  onChanged,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [pending, setPending] = useState(false);

  const handleClick = () => {
    const optimistic = !isFollowing;
    setIsFollowing(optimistic);
    setPending(true);

    void toggleFollow(username)
      .then((result) => {
        setIsFollowing(result.isFollowing);
        onChanged?.(result);
      })
      .catch(() => {
        setIsFollowing(!optimistic);
        toast.error("Couldn't update follow");
      })
      .finally(() => setPending(false));
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={isFollowing}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
