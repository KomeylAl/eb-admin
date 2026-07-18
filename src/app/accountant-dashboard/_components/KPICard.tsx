import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KPICard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconBg = "bg-emerald-50",
  iconColor = "text-emerald-600",
  prefix = "$",
}: {
  title: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative";
  icon?: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  iconColor?: string;
  prefix?: string;
}) {
  const formattedValue =
    typeof value === "number"
      ? `${prefix}${value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : value;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">
            {formattedValue}
          </p>
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              {changeType === "positive" ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive"
                    ? "text-emerald-600"
                    : "text-red-600"
                )}
              >
                {change}
              </span>
              <span className="text-xs text-slate-400">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              iconBg
            )}
          >
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
