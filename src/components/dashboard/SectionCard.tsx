"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

type SectionCardProps = {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function SectionCard({
  title,
  description,
  href,
  linkLabel = "مشاهده همه",
  className,
  children,
  action,
}: SectionCardProps) {
  return (
    <Card className={cn("shadow-sm overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b">
        <div className="space-y-1">
          <CardTitle className="text-base md:text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          {href && (
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {linkLabel}
              <ChevronLeft className="size-4" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-4">{children}</CardContent>
    </Card>
  );
}
