import { cn } from "@/lib/utils";

const statusStyles = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unpaid: "bg-amber-50 text-amber-700 border-amber-200",
  partial: "bg-blue-50 text-blue-700 border-blue-200",
  refunded: "bg-red-50 text-red-700 border-red-200",
  draft: "bg-slate-50 text-slate-600 border-slate-200",
  sent: "bg-indigo-50 text-indigo-700 border-indigo-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  no_show: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function StatusBadge({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  const displayStatus = status?.replace(/_/g, " ") || "unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
        statusStyles[status] || "bg-slate-50 text-slate-600 border-slate-200",
        className
      )}
    >
      {displayStatus}
    </span>
  );
}
