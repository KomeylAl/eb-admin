import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { MediaCollection, MediaFolder, MediaItem } from "@/lib/media";

type MediaListParams = {
  page?: number;
  perPage?: number;
  search?: string;
  collection?: string;
  folderId?: string | null;
  mime?: string;
};

function buildMediaQuery(params: MediaListParams) {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("per_page", String(params.perPage ?? 24));
  if (params.search) query.set("search", params.search);
  if (params.collection) query.set("collection", params.collection);
  if (params.folderId) query.set("folder_id", params.folderId);
  if (params.mime) query.set("mime", params.mime);
  return query.toString();
}

function mediaErrorMessage(payload: any, fallback: string) {
  const fieldErrors = payload?.errors ?? payload?.details?.errors;
  if (fieldErrors && typeof fieldErrors === "object") {
    const first = Object.values(fieldErrors).flat().find((item) => typeof item === "string");
    if (typeof first === "string" && first.trim()) return first;
  }

  const message = payload?.message ?? payload?.details?.message;
  if (typeof message === "string" && message.trim()) return message;

  return fallback;
}

export function useMediaList(params: MediaListParams) {
  const qs = buildMediaQuery(params);

  return useQuery({
    queryKey: ["media", qs],
    queryFn: async () => {
      const res = await fetch(`/api/media?${qs}`);
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت رسانه");
      }
      return payload as { data: MediaItem[]; meta: any };
    },
  });
}

export function useMediaCollections() {
  return useQuery({
    queryKey: ["media-collections"],
    queryFn: async () => {
      const res = await fetch("/api/media/collections");
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت مجموعه‌ها");
      }
      return (payload?.data ?? payload) as MediaCollection[];
    },
  });
}

export function useMediaFolders() {
  return useQuery({
    queryKey: ["media-folders"],
    queryFn: async () => {
      const res = await fetch("/api/media/folders?all=1");
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت پوشه‌ها");
      }
      return (payload?.data ?? []) as MediaFolder[];
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      file: File;
      collection: string;
      name?: string;
      folderId?: string | null;
    }) => {
      const body = new FormData();
      body.append("file", input.file);
      body.append("collection", input.collection);
      if (input.name) body.append("name", input.name);
      if (input.folderId) body.append("folder_id", input.folderId);

      const res = await fetch("/api/media", { method: "POST", body });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(mediaErrorMessage(payload, "خطا در آپلود فایل"));
      }
      const media = (payload?.data?.data ?? payload?.data ?? payload) as MediaItem;
      if (!media?.id) {
        throw new Error("پاسخ آپلود نامعتبر بود");
      }
      return media;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("فایل با موفقیت آپلود شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      folderId,
    }: {
      id: string;
      name?: string;
      folderId?: string | null;
    }) => {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...(name !== undefined ? { name } : {}),
          ...(folderId !== undefined ? { folder_id: folderId } : {}),
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ویرایش فایل");
      }
      return (payload?.data ?? payload) as MediaItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("فایل به‌روزرسانی شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "خطا در حذف فایل");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("فایل حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCreateMediaFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; parentId?: string | null }) => {
      const res = await fetch("/api/media/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: input.name,
          parent_id: input.parentId ?? null,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ساخت پوشه");
      }
      return (payload?.data ?? payload) as MediaFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-folders"] });
      toast.success("پوشه ساخته شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteMediaFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/folders/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "خطا در حذف پوشه");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-folders"] });
      toast.success("پوشه حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
