import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { appendMediaRef } from "@/lib/mediaForm";

function unwrapList(payload: any): any[] {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function useHero() {
  return useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const res = await fetch("/api/hero");
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت هیرو");
      }
      return payload;
    },
  });
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const res = await fetch("/api/hero/slides");
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت اسلایدها");
      }
      return unwrapList(payload);
    },
  });
}

export function useUpdateHeroSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (form: {
      autoplay_ms?: number;
      background_media_id?: string | null;
    }) => {
      const body = new FormData();
      if (form.autoplay_ms != null) {
        body.append("autoplay_ms", String(form.autoplay_ms));
      }
      appendMediaRef(
        body,
        "background",
        "background_media_id",
        form.background_media_id
      );

      const res = await fetch("/api/hero/settings", {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: () => {
      toast.success("تنظیمات هیرو ذخیره شد");
      qc.invalidateQueries({ queryKey: ["hero"] });
    },
    onError: (error: any) => {
      if (error?.errors) {
        Object.values(error.errors).forEach((msgs: any) =>
          (msgs as string[]).forEach((m) => toast.error(m))
        );
      } else {
        toast.error(error?.message || "خطا در ذخیره تنظیمات");
      }
    },
  });
}

export type HeroSlideForm = {
  title: string;
  body?: string;
  button_text?: string;
  button_link?: string;
  is_active?: boolean;
  image_media_id?: string | null;
};

function slideToFormData(form: HeroSlideForm) {
  const body = new FormData();
  body.append("title", form.title || "");
  body.append("body", form.body || "");
  body.append("button_text", form.button_text || "");
  body.append("button_link", form.button_link || "");
  body.append("is_active", form.is_active === false ? "0" : "1");
  appendMediaRef(body, "image", "image_media_id", form.image_media_id);
  return body;
}

export function useCreateHeroSlide(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (form: HeroSlideForm) => {
      const res = await fetch("/api/hero/slides", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: slideToFormData(form),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: () => {
      toast.success("اسلاید افزوده شد");
      qc.invalidateQueries({ queryKey: ["hero"] });
      qc.invalidateQueries({ queryKey: ["hero-slides"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      if (error?.errors) {
        Object.values(error.errors).forEach((msgs: any) =>
          (msgs as string[]).forEach((m) => toast.error(m))
        );
      } else {
        toast.error(error?.message || "خطا در ایجاد اسلاید");
      }
    },
  });
}

export function useUpdateHeroSlide(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: string;
      form: HeroSlideForm;
    }) => {
      const res = await fetch(`/api/hero/slides/${id}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: slideToFormData(form),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: () => {
      toast.success("اسلاید به‌روزرسانی شد");
      qc.invalidateQueries({ queryKey: ["hero"] });
      qc.invalidateQueries({ queryKey: ["hero-slides"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      if (error?.errors) {
        Object.values(error.errors).forEach((msgs: any) =>
          (msgs as string[]).forEach((m) => toast.error(m))
        );
      } else {
        toast.error(error?.message || "خطا در ویرایش اسلاید");
      }
    },
  });
}

export function useDeleteHeroSlide() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/hero/slides/${id}`, { method: "DELETE" });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: () => {
      toast.success("اسلاید حذف شد");
      qc.invalidateQueries({ queryKey: ["hero"] });
      qc.invalidateQueries({ queryKey: ["hero-slides"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در حذف اسلاید");
    },
  });
}

export function useReorderHeroSlides(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const res = await fetch("/api/hero/slides/reorder", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ordered_ids: orderedIds }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: () => {
      toast.success("ترتیب اسلایدها ذخیره شد");
      qc.invalidateQueries({ queryKey: ["hero"] });
      qc.invalidateQueries({ queryKey: ["hero-slides"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در ذخیره ترتیب");
    },
  });
}
