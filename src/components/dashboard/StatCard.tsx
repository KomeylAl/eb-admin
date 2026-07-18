"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  iconClassName?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  iconClassName,
}: StatCardProps) {
  const formatted =
    typeof value === "number" ? value.toLocaleString("fa-IR") : value;

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl tabular-nums">{formatted}</CardTitle>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary",
              iconClassName
            )}
          >
            <Icon className="size-5" />
          </div>
        )}
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      )}
    </Card>
  );
}
