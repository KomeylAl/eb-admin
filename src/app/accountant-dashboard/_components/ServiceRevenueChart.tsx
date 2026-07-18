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
  title = "Revenue by Service",
}: {
  data: Array<{ name: string; revenue: number }>;
  isLoading: boolean;
  title?: string;
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-sm text-emerald-600 font-semibold">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              content={<CustomTooltip active={true} label="" payload={data} />}
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
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
