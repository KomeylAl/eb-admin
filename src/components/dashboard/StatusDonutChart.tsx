"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { NamedCount } from "@/lib/dashboard";

const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type Props = {
  data: NamedCount[];
  colors?: string[];
};

export function StatusDonutChart({ data, colors = DEFAULT_COLORS }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color || colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--card-foreground)",
            }}
            formatter={(value, name) => [
              Number(value).toLocaleString("fa-IR"),
              String(name),
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs text-muted-foreground">مجموع</p>
        <p className="text-xl font-bold tabular-nums">
          {total.toLocaleString("fa-IR")}
        </p>
      </div>
    </div>
  );
}
