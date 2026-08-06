import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { appointmentType } from "../../types/appointmentTypes";

export function useAppointmentsByDate(date: string = "") {
  return useQuery({
    queryKey: ["appointmentsByDate", date],
    queryFn: async () => {
      const res = await fetch(`/api/appointments?date=${date}`);
      if (!res.ok) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
  });
}

export type AppointmentFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  date?: string;
  clientId?: string;
  doctorId?: string;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
};

export function useAppointments(filters: AppointmentFilters | number = 1, pageSizeArg = 10, searchArg = "", dateArg = "", clientIdArg = "") {
  // Support both object API and legacy positional args used by admin pages
  const isLegacy = typeof filters === "number";
  const page = isLegacy ? filters : (filters.page ?? 1);
  const pageSize = isLegacy ? pageSizeArg : (filters.pageSize ?? 10);
  const search = isLegacy ? searchArg : (filters.search ?? "");
  const date = isLegacy ? dateArg : (filters.date ?? "");
  const clientId = isLegacy ? clientIdArg : (filters.clientId ?? "");
  const doctorId = isLegacy ? "" : (filters.doctorId ?? "");
  const status = isLegacy ? "" : (filters.status ?? "");
  const paymentStatus = isLegacy ? "" : (filters.paymentStatus ?? "");
  const fromDate = isLegacy ? "" : (filters.fromDate ?? "");
  const toDate = isLegacy ? "" : (filters.toDate ?? "");

  return useQuery({
    queryKey: [
      "appointments",
      page,
      pageSize,
      search,
      date,
      clientId,
      doctorId,
      status,
      paymentStatus,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      });
      if (search) qs.set("search", search);
      if (date) qs.set("date", date);
      if (clientId) qs.set("clientId", clientId);
      if (doctorId) qs.set("doctorId", doctorId);
      if (status) qs.set("status", status);
      if (paymentStatus) qs.set("paymentStatus", paymentStatus);
      if (fromDate) qs.set("fromDate", fromDate);
      if (toDate) qs.set("toDate", toDate);

      const res = await fetch(`/api/appointments?${qs}`);
      if (!res.ok) {
        toast.error("خطا در دریافت اطلاعات");
        throw new Error("Failed to fetch appointments");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useDeleteAppointment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف نوبت پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("نوبت با موفقت حذف شد");
      onSuccess();
    },
  });
}

export function useAddAppointment(onAddedAppointment: () => void) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || "مشکلی در افزودن نوبت پیش آمده!");
      }
      return json;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("نوبت با موفقت افزودن شد");
      onAddedAppointment();
    },
  });
}

export function useUpdateAppointment(onUpdateedAppointment: () => void) {
  return useMutation({
    mutationFn: async ({
      data,
      appId,
    }: {
      data: appointmentType;
      appId: string;
    }) => {
      const res = await fetch(`/api/appointments/${appId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || "مشکلی در ویرایش نوبت پیش آمده!");
      }
      return json;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("نوبت با موفقت ویرایش شد");
      onUpdateedAppointment();
    },
  });
}
