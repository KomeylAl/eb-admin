import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDepartments(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["departments", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/departments?page=${page}&size=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useDeleteDepartment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/departments/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف دپارتمان پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("دپارتمان با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useStoreDepartment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("title", formData.title);
      newData.append("slug", formData.slug);
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);

      if (formData.thumbnail && formData.thumbnail.length > 0) {
        newData.append("thumbnail", formData.thumbnail[0]);
      }

      const res = await fetch("/api/departments", {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در افزودن دپارتمان");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("دپارتمان با موفقیت ثبت شد");
      onSuccess();
    },
    onError: (error) => {
      console.log(error);
      toast.error("خطا در ثبت دپارتمان");
    },
  });
}

export function useUpdateDepartment(slug: string, onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("title", formData.title);
      newData.append("slug", formData.slug);
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);

      if (formData.thumbnail && formData.thumbnail.length > 0) {
        newData.append("thumbnail", formData.thumbnail[0]);
      }

      const res = await fetch(`/api/departments/${slug}`, {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویراایش دپارتمان");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("دپارتمان با موفقیت ویرایش شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ویرایش دپارتمان");
    },
  });
}
