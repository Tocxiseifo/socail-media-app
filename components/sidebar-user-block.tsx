"use client";

import Link from "next/link";
import { CircleUserIcon, LogOut, SettingsIcon } from "lucide-react";

import type { SessionUser } from "@/features/auth/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import SidebarNotUserBlock from "./sidebar-notuser-block";

function initials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function SidebarUserBlock({ user }: { user: SessionUser }) {
  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger
  //       render={
  //         <button
  //           type="button"
  //           className={cn(
  //             "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
  //           )}
  //           aria-label={`Account menu for ${user.displayName}`}
  //         />
  //       }
  //     >
  //       <Avatar size="default">
  //         {user.avatarUrl ? (
  //           <AvatarImage src={user.avatarUrl} alt="" />
  //         ) : null}
  //         <AvatarFallback>{initials(user.displayName)}</AvatarFallback>
  //       </Avatar>
  //       <span className="min-w-0 flex-1">
  //         <span className="block truncate text-sm font-medium">
  //           {user.displayName}
  //         </span>
  //         <span className="block truncate text-xs text-muted-foreground">
  //           @{user.username}
  //         </span>
  //       </span>
  //     </DropdownMenuTrigger>
  //     <DropdownMenuContent side="top" align="start" className="w-56">
  //       <DropdownMenuItem render={<Link href={`/u/${user.username}`} />}>
  //         <CircleUserIcon strokeWidth={1.5} />
  //         Profile
  //       </DropdownMenuItem>
  //       <DropdownMenuItem render={<Link href="/settings/profile" />}>
  //         <SettingsIcon strokeWidth={1.5} />
  //         Settings
  //       </DropdownMenuItem>
  //       <DropdownMenuItem render={<Link href="/settings/profile" />} className="text-red-400 ">
  //         <LogOut strokeWidth={1.5} />
  //         Logout
  //       </DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // );
  return(
    <>
      <SidebarNotUserBlock />
    </>
  )
}
