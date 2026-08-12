import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useComments(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  approved: string = "",
  commentableType: string = ""
) {
  return useQuery({
    queryKey: ["comments", page, pageSize, search, approved, commentableType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      });
      if (search) params.set("search", search);
      if (approved) params.set("approved", approved);
      if (commentableType) params.set("commentable_type", commentableType);

      const res = await fetch(`/api/comments?${params.toString()}`);
      if (!res.ok) {
        toast.error("خطا در دریافت نظرات");
      }
      return res.json();
    },
  });
}

export function useDeleteComment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف نظر پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("نظر با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useApproveComment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comments/${id}/approve`, {
        method: "PATCH",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "خطا در تأیید نظر");
      }
      return json;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("نظر تأیید شد");
      onSuccess();
    },
  });
}

export function useUnapproveComment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comments/${id}/unapprove`, {
        method: "PATCH",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "خطا در لغو تأیید نظر");
      }
      return json;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("تأیید نظر لغو شد");
      onSuccess();
    },
  });
}
