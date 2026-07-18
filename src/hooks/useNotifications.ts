import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetNotifications(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["notifications", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/notifications?page=${page}&pageSize=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useGetUnreadNotifications(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["unreadNotifications", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/notifications/unread?page=${page}&pageSize=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useMarkNotif() {
  return useMutation({
    mutationFn: async (notifId: string) => {
      const res = await fetch(`/api/notifications/${notifId}/read`, {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(`${error.message ?? "خطا در علامت گذاری اعلان!"}`);
      }
    },
    onError: (error) => toast.error(`${error}`),
    onSuccess: () => toast.success("اعلان با موفقت علامت‌گذاری شد"),
  });
}
