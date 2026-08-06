"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatMoney } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

export default function ServiceRevenueChart({
  data,
  isLoading,
  title = "درآمد به تفکیک",
}: {
  data: Array<{ name: string; revenue: number }>;
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
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatMoney(value)}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={24}>
              {(data || []).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
