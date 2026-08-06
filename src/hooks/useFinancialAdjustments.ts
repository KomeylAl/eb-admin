import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type AdjustmentPayload = {
  type: "discount" | "credit" | "debit";
  amount: number;
  status?: "active" | "void";
  appointment_id?: string | null;
  invoice_id?: string | null;
  reason?: string | null;
};

export function useFinancialAdjustments({
  page = 1,
  pageSize = 15,
  type = "",
  status = "",
  clientId = "",
}: {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
  clientId?: string;
} = {}) {
  return useQuery({
    queryKey: [
      "financial-adjustments",
      page,
      pageSize,
      type,
      status,
      clientId,
    ],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      });
      if (type) qs.set("type", type);
      if (status) qs.set("status", status);
      if (clientId) qs.set("clientId", clientId);

      const res = await fetch(`/api/financial-adjustments?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت تخفیف‌ها و تعدیلات");
        throw new Error("Failed to fetch adjustments");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateAdjustment(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AdjustmentPayload) => {
      const res = await fetch("/api/financial-adjustments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("خطا در ایجاد تعدیل");
      return res.json();
    },
    onSuccess: () => {
      toast.success("تعدیل ثبت شد");
      qc.invalidateQueries({ queryKey: ["financial-adjustments"] });
      onSuccess?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateAdjustment(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: AdjustmentPayload;
    }) => {
      const res = await fetch(`/api/financial-adjustments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("خطا در ویرایش تعدیل");
      return res.json();
    },
    onSuccess: () => {
      toast.success("تعدیل ویرایش شد");
      qc.invalidateQueries({ queryKey: ["financial-adjustments"] });
      onSuccess?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteAdjustment(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/financial-adjustments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("خطا در حذف تعدیل");
      }
    },
    onSuccess: () => {
      toast.success("تعدیل حذف شد");
      qc.invalidateQueries({ queryKey: ["financial-adjustments"] });
      onSuccess?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
