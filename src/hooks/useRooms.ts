import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useRooms(enabled = true, activeOnly = true) {
  return useQuery({
    queryKey: ["rooms", activeOnly],
    enabled,
    queryFn: async () => {
      const qs = new URLSearchParams({ per_page: "100" });
      if (activeOnly) qs.set("is_active", "true");
      const res = await fetch(`/api/rooms?${qs}`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت اتاق‌ها");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useRoomAvailability(date: string) {
  return useQuery({
    queryKey: ["rooms-availability", date],
    enabled: Boolean(date),
    queryFn: async () => {
      const res = await fetch(
        `/api/rooms?availability=1&date=${encodeURIComponent(date)}`
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت وضعیت اتاق‌ها");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useStoreRoom(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در ایجاد اتاق");
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("اتاق ایجاد شد");
      onSuccess?.();
    },
  });
}

export function useUpdateRoom(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.message || "خطا در ویرایش اتاق");
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("اتاق به‌روزرسانی شد");
      onSuccess?.();
    },
  });
}

export function useDeleteRoom(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "خطا در حذف اتاق");
      }
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("اتاق حذف شد");
      onSuccess?.();
    },
  });
}
