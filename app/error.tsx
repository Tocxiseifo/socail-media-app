"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for observability once a logging drain exists.
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 text-center"
    >
      <div
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive"
      >
        <TriangleAlertIcon className="size-7" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">
          Something flickered out.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Try again — if it persists, it&apos;s on us.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </div>
  );
}
