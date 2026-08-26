import type { Metadata } from "next";
import Link from "next/link";
import { MoonStarIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Welcome",
  description:
    "Vesper is social media after dark — curated posts, real conversation, zero noise.",
};

const principles = ["Curated feeds", "No ads, no algorithms", "Dark by design"];

export default function WelcomePage() {
  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center gap-8 py-12 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="relative flex size-14 items-center justify-center rounded-full border bg-card text-primary shadow-glow"
      >
        <MoonStarIcon className="size-6" strokeWidth={1.5} />
      </div>

      <h1 className="relative text-[2rem] font-bold leading-10 tracking-[-0.02em] md:text-5xl md:leading-[3.5rem]">
        A quieter place to share.
      </h1>

      <p className="relative max-w-xl text-base leading-6 text-muted-foreground md:text-lg md:leading-7">
        Vesper is social media after dark — curated posts, real conversation,
        and none of the noise. Built for people who value calm.
      </p>

      <ul className="relative flex flex-wrap items-center justify-center gap-2">
        {principles.map((principle) => (
          <li
            key={principle}
            className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground"
          >
            {principle}
          </li>
        ))}
      </ul>

      <div className="relative flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "px-6")}
        >
          Join Vesper
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
