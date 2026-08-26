import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-xl border bg-card p-6",
        className
      )}
    >
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-[-0.01em]">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
