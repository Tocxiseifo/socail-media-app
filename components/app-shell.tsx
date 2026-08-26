import type { ReactNode } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { getCurrentUser } from "@/features/auth/data";
import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarUserBlock } from "@/components/sidebar-user-block";
import { BottomNav } from "@/components/bottom-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Wordmark() {
  return (
    <Link
      href="/"
      className="px-4 text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-md"
    >
      Vesper<span className="text-primary">.</span>
    </Link>
  );
}

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-popover focus:px-4 focus:py-2 focus:text-sm focus:text-popover-foreground focus:ring-1 focus:ring-border"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col gap-6 bg-sidebar px-4 py-6 lg:flex">
        <Wordmark />

        {user ? (
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            <PlusIcon strokeWidth={1.5} aria-hidden="true" />
            New post
          </Link>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Join Vesper
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Log in
            </Link>
          </div>
        )}

        <SidebarNav user={user} />

        <div className="mt-auto">
          {user ? <SidebarUserBlock user={user} /> : null}
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1200px] px-5 pt-6 pb-28 focus:outline-none lg:px-12 lg:pt-10 lg:pb-16"
        >
          {children}
        </main>
      </div>

      <BottomNav user={user} />
    </div>
  );
}
