import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useTreatmentPrograms(filters: {
  clientId?: string;
  doctorId?: string;
  status?: string;
  enabled?: boolean;
}) {
  const { clientId = "", doctorId = "", status = "", enabled = true } = filters;
  return useQuery({
    queryKey: ["treatment-programs", clientId, doctorId, status],
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams({ per_page: "100" });
      if (clientId) params.set("client_id", clientId);
      if (doctorId) params.set("doctor_id", doctorId);
      if (status) params.set("status", status);
      const res = await fetch(`/api/treatment-programs?${params}`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت برنامه‌های درمان");
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
