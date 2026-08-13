import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type TreatmentProgramFilters = {
  clientId?: string;
  doctorId?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
};

export function useTreatmentPrograms(filters: TreatmentProgramFilters = {}) {
  const {
    clientId = "",
    doctorId = "",
    status = "",
    search = "",
    page = 1,
    pageSize = 100,
    enabled = true,
  } = filters;

  return useQuery({
    queryKey: [
      "treatment-programs",
      clientId,
      doctorId,
      status,
      search,
      page,
      pageSize,
    ],
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(pageSize),
      });
      if (clientId) params.set("client_id", clientId);
      if (doctorId) params.set("doctor_id", doctorId);
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      const res = await fetch(`/api/treatment-programs?${params}`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت برنامه‌های درمان");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
    placeholderData: (prev) => prev,
  });
}

export function useTreatmentProgram(programId: string) {
  return useQuery({
    queryKey: ["treatment-program", programId],
    enabled: Boolean(programId),
    queryFn: async () => {
      const res = await fetch(`/api/treatment-programs/${programId}`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت برنامه درمان");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useCreateTreatmentProgram(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch("/api/treatment-programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ایجاد برنامه درمان");
      }
      return payload;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("برنامه درمان ایجاد شد");
      onSuccess?.();
    },
  });
}

export function useDeleteTreatmentProgram(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/treatment-programs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "خطا در حذف برنامه درمان");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("برنامه درمان حذف شد");
      onSuccess?.();
    },
  });
}

export function useUpdateTreatmentProgram(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/treatment-programs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ویرایش برنامه");
      }
      return payload;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("برنامه درمان به‌روزرسانی شد");
      onSuccess?.();
    },
  });
}

export function useProgramMedicalRecord(programId: string) {
  return useQuery({
    queryKey: ["program-medical-record", programId],
    enabled: Boolean(programId),
    queryFn: async () => {
      const res = await fetch(
        `/api/treatment-programs/${programId}/medical-record`
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت پرونده");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useSaveProgramMedicalRecord(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      programId,
      formData,
    }: {
      programId: string;
      formData: FormData;
    }) => {
      const res = await fetch(
        `/api/treatment-programs/${programId}/medical-record`,
        { method: "POST", body: formData }
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ذخیره پرونده");
      }
      return payload;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("پرونده ذخیره شد");
      onSuccess?.();
    },
  });
}

export function useUpdateHomework(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/homeworks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در به‌روزرسانی تکلیف");
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("تکلیف به‌روزرسانی شد");
      onSuccess?.();
    },
  });
}
