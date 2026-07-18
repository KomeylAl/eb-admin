"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayCount } from "@/lib/dashboard";

type Props = {
  data: DayCount[];
  dataKey?: string;
  color?: string;
  valueLabel?: string;
};

export function TrendAreaChart({
  data,
  dataKey = "count",
  color = "var(--chart-1)",
  valueLabel = "تعداد",
}: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          width={32}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--card-foreground)",
          }}
          formatter={(value) => [Number(value).toLocaleString("fa-IR"), valueLabel]}
          labelFormatter={(label) => String(label)}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
