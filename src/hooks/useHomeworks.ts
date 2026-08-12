import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAppointmentHomeworks(appointmentId: string) {
  return useQuery({
    queryKey: ["admin-appointment-homeworks", appointmentId],
    enabled: Boolean(appointmentId),
    queryFn: async () => {
      const res = await fetch(`/api/appointments/${appointmentId}/homeworks`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت تکالیف");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}
