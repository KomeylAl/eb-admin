import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

function buildFinanceQs(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v);
  });
  return qs.toString();
}

export function useFinanceSummary({
  from = "",
  to = "",
  doctorId = "",
}: {
  from?: string;
  to?: string;
  doctorId?: string;
} = {}) {
  return useQuery({
    queryKey: ["finance-summary", from, to, doctorId],
    queryFn: async () => {
      const qs = buildFinanceQs({ from, to, doctorId });
      const res = await fetch(`/api/finance/summary?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت خلاصه مالی");
        throw new Error("Failed to fetch finance summary");
      }
      return res.json();
    },
  });
}

export function useFinanceByDoctor({
  from = "",
  to = "",
}: {
  from?: string;
  to?: string;
} = {}) {
  return useQuery({
    queryKey: ["finance-by-doctor", from, to],
    queryFn: async () => {
      const qs = buildFinanceQs({ from, to });
      const res = await fetch(`/api/finance/by-doctor?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت گزارش پزشکان");
        throw new Error("Failed to fetch by-doctor report");
      }
      return res.json();
    },
  });
}

export function useFinanceByDay({
  from = "",
  to = "",
  doctorId = "",
}: {
  from?: string;
  to?: string;
  doctorId?: string;
} = {}) {
  return useQuery({
    queryKey: ["finance-by-day", from, to, doctorId],
    queryFn: async () => {
      const qs = buildFinanceQs({ from, to, doctorId });
      const res = await fetch(`/api/finance/by-day?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت گزارش روزانه");
        throw new Error("Failed to fetch by-day report");
      }
      return res.json();
    },
  });
}

export function useFinanceCompare({
  from = "",
  to = "",
  compareFrom = "",
  compareTo = "",
  doctorId = "",
}: {
  from?: string;
  to?: string;
  compareFrom?: string;
  compareTo?: string;
  doctorId?: string;
} = {}) {
  return useQuery({
    queryKey: [
      "finance-compare",
      from,
      to,
      compareFrom,
      compareTo,
      doctorId,
    ],
    enabled: Boolean(from && to && compareFrom && compareTo),
    queryFn: async () => {
      const qs = buildFinanceQs({
        from,
        to,
        compareFrom,
        compareTo,
        doctorId,
      });
      const res = await fetch(`/api/finance/compare?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت مقایسه مالی");
        throw new Error("Failed to fetch compare report");
      }
      return res.json();
    },
  });
}
