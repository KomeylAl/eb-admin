"use client";

import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ChartCardProps = {
  title: string;
  description?: string;
  isLoading?: boolean;
  empty?: boolean;
  emptyText?: string;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function ChartCard({
  title,
  description,
  isLoading,
  empty,
  emptyText = "داده‌ای برای نمایش وجود ندارد",
  className,
  children,
  action,
}: ChartCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base md:text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-[240px] w-full rounded-xl" />
          </div>
        ) : empty ? (
          <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          <div className="h-[260px] w-full">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
