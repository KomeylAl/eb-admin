import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type InvoiceItemInput = {
  description: string;
  unit?: string;
  quantity: number;
  unit_price: number;
  appointment_id?: string | null;
  sort_order?: number;
};

export type InvoicePayload = {
  client_id: string;
  issue_date: string;
  due_date?: string | null;
  status?: string;
  number?: string;
  from_date?: string | null;
  to_date?: string | null;
  notes?: string | null;
  items: InvoiceItemInput[];
};

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/invoices");
      if (!res.ok) {
        toast.error("خطا در دریافت فاکتورها");
        throw new Error("Failed to fetch invoices");
      }
      return res.json();
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) {
        toast.error("خطا در دریافت فاکتور");
        throw new Error("Failed to fetch invoice");
      }
      return res.json();
    },
  });
}

export function useSuggestInvoiceItems() {
  return useMutation({
    mutationFn: async (body: {
      client_id: string;
      from_date: string;
      to_date: string;
    }) => {
      const res = await fetch("/api/invoices/suggest-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("خطا در پیشنهاد اقلام از نوبت‌ها");
      }
      return res.json();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateInvoice(onSuccess?: (data?: any) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: InvoicePayload) => {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("خطا در ذخیره فاکتور");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("فاکتور ذخیره شد");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      onSuccess?.(data);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateInvoice(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: InvoicePayload;
    }) => {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("خطا در ویرایش فاکتور");
      }
      return res.json();
    },
    onSuccess: (_data, vars) => {
      toast.success("فاکتور ویرایش شد");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice", vars.id] });
      onSuccess?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteInvoice(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error("خطا در حذف فاکتور");
      }
    },
    onSuccess: () => {
      toast.success("فاکتور حذف شد");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      onSuccess?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
