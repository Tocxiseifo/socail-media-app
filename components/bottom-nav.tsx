"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUserIcon,
  HomeIcon,
  LogInIcon,
  PlusIcon,
  type LucideIcon,
} from "lucide-react";

import type { SessionUser } from "@/features/auth/types/user";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function BottomLink({ item, active }: { item: BottomNavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-2 text-[11px] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function BottomNav({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();

  const items: BottomNavItem[] = user
    ? [
        { label: "Home", href: "/", icon: HomeIcon },
        { label: "New post", href: "/", icon: PlusIcon },
        {
          label: "Profile",
          href: `/u/${user.username}`,
          icon: CircleUserIcon,
        },
      ]
    : [
        { label: "Home", href: "/", icon: HomeIcon },
        { label: "Log in", href: "/login", icon: LogInIcon },
      ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-3 border-t bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {items.map((item) => (
        <BottomLink key={item.label} item={item} active={isActive(item.href)} />
      ))}
    </nav>
  );
}
