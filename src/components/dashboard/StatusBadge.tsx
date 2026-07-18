"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: "پیش‌نویس",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  published: {
    label: "منتشرشده",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  archived: {
    label: "آرشیو",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },
  pending: {
    label: "در انتظار",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  done: {
    label: "انجام‌شده",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  },
  paid: {
    label: "پرداخت‌شده",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  unpaid: {
    label: "پرداخت‌نشده",
    className: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) {
  const key = status || "draft";
  const conf = STATUS_MAP[key] || {
    label: key,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", conf.className, className)}
    >
      {conf.label}
    </Badge>
  );
}
