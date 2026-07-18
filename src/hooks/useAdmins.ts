import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAdmins(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["admins", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/admins?page=${page}&pageSize=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
  });
}

export function useStoreAdmin(onAdminStored: () => void) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/admins/`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("مشکلی در افزودن مدیر پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("مدیر با موفقت افزودن شد");
      onAdminStored();
    },
  });
}

export function useUpdateAdmin(adminId: string, onSuccess: () => void) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/admins/${adminId}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("مشکلی در ویرایش مدیر پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("مدیر با موفقت ویرایش شد");
      onSuccess();
    },
  });
}

export function useDeleteAdmin(onDeletedTenant: () => void) {
  return useMutation({
    mutationFn: async (adminId: string) => {
      const res = await fetch(`/api/admins/${adminId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف مدیر پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("مدیر با موفقیت حذف شد");
      onDeletedTenant();
    },
  });
}
