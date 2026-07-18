import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCategories(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["categories", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/categories?page=${page}&size=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    // placeholderData: (prev) => prev,
  });
}

export function useDeleteCategory(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف دسته بندی پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("دسته بندی با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useStoreCategory(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("name", formData.name);
      newData.append("slug", formData.slug);
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);

      if (formData.image && formData.image.length > 0) {
        newData.append("image", formData.image[0]);
      }

      const res = await fetch("/api/categories", {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در افزودن دسته بندی");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("دسته بندی با موفقیت ثبت شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ثبت دسته بندی");
    },
  });
}

export function useUpdateCategory(categoryId: string, onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("name", formData.name);
      newData.append("slug", formData.slug);
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);

      if (formData.image && formData.image.length > 0) {
        newData.append("image", formData.image[0]);
      }

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویراایش دسته بندی");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("دسته بندی با موفقیت ویرایش شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ویرایش دسته بندی");
    },
  });
}
