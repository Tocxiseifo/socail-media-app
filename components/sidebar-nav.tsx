"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUserIcon,
  HomeIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";

import type { SessionUser } from "@/features/auth/types/user";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function memberItems(username: string): NavItem[] {
  return [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Profile", href: `/u/${username}`, icon: CircleUserIcon },
    { label: "Settings", href: "/settings/profile", icon: SettingsIcon },
  ];
}

const guestItems: NavItem[] = [{ label: "Home", href: "/", icon: HomeIcon }];

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:bg-muted/50 focus-visible:text-foreground focus-visible:outline-none",
        active ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary"
        />
      ) : null}
      <Icon className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      {item.label}
    </Link>
  );
}

export function SidebarNav({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const items = user ? memberItems(user.username) : guestItems;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {items.map((item) => (
        <SidebarLink key={item.href} item={item} active={isActive(item.href)} />
      ))}
    </nav>
  );
}
