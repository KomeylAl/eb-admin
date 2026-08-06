import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type PaymentFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  clientId?: string;
  doctorId?: string;
  status?: string;
  method?: string;
  fromDate?: string;
  toDate?: string;
};

export function usePayments(filters: PaymentFilters = {}) {
  const {
    page = 1,
    pageSize = 15,
    search = "",
    clientId = "",
    doctorId = "",
    status = "",
    method = "",
    fromDate = "",
    toDate = "",
  } = filters;

  return useQuery({
    queryKey: [
      "payments",
      page,
      pageSize,
      search,
      clientId,
      doctorId,
      status,
      method,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      });
      if (search) qs.set("search", search);
      if (clientId) qs.set("clientId", clientId);
      if (doctorId) qs.set("doctorId", doctorId);
      if (status) qs.set("status", status);
      if (method) qs.set("method", method);
      if (fromDate) qs.set("fromDate", fromDate);
      if (toDate) qs.set("toDate", toDate);

      const res = await fetch(`/api/payments?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت پرداخت‌ها");
        throw new Error("Failed to fetch payments");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/payments/${id}`);
      if (!res.ok) {
        toast.error("خطا در دریافت پرداخت");
        throw new Error("Failed to fetch payment");
      }
      return res.json();
    },
  });
}
