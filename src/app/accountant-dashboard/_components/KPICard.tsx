import React from "react";
import { cn, formatMoney } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KPICard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconBg = "bg-emerald-50 dark:bg-emerald-500/15",
  iconColor = "text-emerald-600 dark:text-emerald-400",
}: {
  title: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  iconColor?: string;
}) {
  const formattedValue =
    typeof value === "number" ? formatMoney(value) : value;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-none transition-shadow duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
            {formattedValue}
          </p>
          {change && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {changeType === "positive" ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : changeType === "negative" ? (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              ) : null}
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive" &&
                    "text-emerald-600 dark:text-emerald-400",
                  changeType === "negative" &&
                    "text-red-600 dark:text-red-400",
                  changeType === "neutral" &&
                    "text-slate-500 dark:text-slate-400"
                )}
              >
                {change}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                نسبت به دوره قبل
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
              iconBg
            )}
          >
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
