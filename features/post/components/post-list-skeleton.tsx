import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PostListSkeletonProps {
  count?: number;
  className?: string;
}

export function PostListSkeleton({ count = 3, className }: PostListSkeletonProps) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}
