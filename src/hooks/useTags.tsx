import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useTags(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["tags", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/tags?page=${page}&size=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    // placeholderData: (prev) => prev,
  });
}

export function useDeleteTag(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (tagId: string) => {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف برچسب پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("برچسب با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useStoreTag(onSuccess: () => void) {
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

      const res = await fetch("/api/tags", {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در افزودن برچسب");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("برچسب با موفقیت ثبت شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ثبت برچسب");
    },
  });
}

export function useUpdateTag(tagId: string, onSuccess: () => void) {
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

      const res = await fetch(`/api/tags/${tagId}`, {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویراایش برچسب");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("برچسب با موفقیت ویرایش شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ویرایش برچسب");
    },
  });
}
