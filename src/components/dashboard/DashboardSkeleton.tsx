"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton({ stats = 4 }: { stats?: number }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: stats }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[340px] rounded-xl" />
        <Skeleton className="h-[340px] rounded-xl" />
      </div>
      <Skeleton className="h-[280px] rounded-xl" />
    </div>
  );
}
