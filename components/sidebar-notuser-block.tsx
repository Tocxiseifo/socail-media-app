"use client";

import { Link, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "./ui/avatar"

export default function SidebarNotUserBlock() {
    return (
        <>
            <Link href="/login" className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none">
                <Avatar size="default">
                    <AvatarFallback>
                        <UserRound strokeWidth={1.5} />
                    </AvatarFallback>
                </Avatar>    
            </Link>
        </>
    )
}