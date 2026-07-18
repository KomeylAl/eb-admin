import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function usePosts(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["posts", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/posts?page=${page}&size=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    // placeholderData: (prev) => prev,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${slug}`);
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
  });
}

export function useDeletePost(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف مطلب پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("مطلب با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useStorePost(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("title", formData.title);
      newData.append("slug", formData.slug);
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);
      newData.append("status", formData.status);
      if (formData.status === "published") {
        newData.append("published_at", new Date().toISOString());
      }
      newData.append("category_id", formData.category_id);
      formData.tag_ids.forEach((id: number) => {
        newData.append("tag_ids[]", id.toString());
      });

      if (formData.thumbnail && formData.thumbnail.length > 0) {
        newData.append("thumbnail", formData.thumbnail[0]);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در افزودن مطلب");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("مطلب با موفقیت ثبت شد");
      onSuccess();
    },
    onError: (error) => {
      console.log(error);
      toast.error("خطا در ثبت مطلب");
    },
  });
}

export function useUpdatePost(slug: string, onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("title", formData.title);
      newData.append("slug", formData.slug);
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);
      newData.append("status", formData.status);
      if (formData.status === "published") {
        newData.append("published_at", new Date().toISOString());
      }
      newData.append("category_id", formData.category_id);
      formData.tag_ids.forEach((id: number) => {
        newData.append("tag_ids[]", id.toString());
      });

      if (formData.thumbnail && formData.thumbnail.length > 0) {
        newData.append("thumbnail", formData.thumbnail[0]);
      }

      const res = await fetch(`/api/posts/${slug}`, {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویراایش مطلب");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("مطلب با موفقیت ویرایش شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ویرایش مطلب");
    },
  });
}
