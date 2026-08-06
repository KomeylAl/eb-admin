import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function usePaymentTransactions({
  page = 1,
  pageSize = 15,
  paymentId = "",
  clientId = "",
  fromDate = "",
  toDate = "",
}: {
  page?: number;
  pageSize?: number;
  paymentId?: string;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
} = {}) {
  return useQuery({
    queryKey: [
      "payment-transactions",
      page,
      pageSize,
      paymentId,
      clientId,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      });
      if (paymentId) qs.set("paymentId", paymentId);
      if (clientId) qs.set("clientId", clientId);
      if (fromDate) qs.set("fromDate", fromDate);
      if (toDate) qs.set("toDate", toDate);

      const res = await fetch(`/api/payment-transactions?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت لاگ تراکنش‌ها");
        throw new Error("Failed to fetch transactions");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}
