import Link from "next/link";
import { CompassIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <div
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full border bg-card text-primary shadow-glow"
      >
        <CompassIcon className="size-7" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Lost in the night.</h1>
        <p className="mt-2 text-muted-foreground">
          This page doesn&apos;t exist — or it drifted away.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
        Back to the feed
      </Link>
    </div>
  );
}
