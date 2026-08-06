"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatMoney } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export default function RevenueChart({
  data,
  isLoading,
  title = "روند درآمد",
}: {
  data: { name: string; revenue: number }[];
  isLoading: boolean;
  title?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const axisColor = isDark ? "#94a3b8" : "#94a3b8";
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-slate-400 dark:text-slate-500">
            در حال بارگذاری…
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-right">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
            {label}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
            {formatMoney(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
        {title}
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatMoney(value)}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
