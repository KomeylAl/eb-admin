import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
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
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Revenue Overview
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={
                <CustomTooltip active={isLoading} payload={data} label={""} />
              }
            />
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
