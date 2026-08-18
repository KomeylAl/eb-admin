import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { appendMediaRef } from "@/lib/mediaForm";

export function useWorksops(
  page: number = 0,
  pageSize: number = 10,
  search: string = "",
  type: string = ""
) {
  return useQuery({
    queryKey: ["workshops", page, pageSize, search, type],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
        search,
      });
      if (type) qs.set("type", type);
      const res = await fetch(`/api/workshops?${qs}`);
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useWorksop(id: string) {
  return useQuery({
    queryKey: ["workshop"],
    queryFn: async () => {
      const res = await fetch(`/api/workshops/${id}`);
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useAddWorkshop(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("title", formData.title);
      newData.append("slug", formData.slug);
      newData.append("type", formData.type || "general");
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);
      newData.append("organizers", formData.organizers);
      newData.append("week_day", formData.week_day);
      newData.append("time", formData.time);
      newData.append("start_date", formData.start_date);
      newData.append("end_date", formData.end_date);

      appendMediaRef(
        newData,
        "image",
        "image_media_id",
        formData.image_media_id || formData.image
      );

      const res = await fetch("/api/workshops/", {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در افزودن کارگاه");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("کارگاه با موفقیت ثبت شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ثبت کارگاه");
    },
  });
}

export function useUpdateWorkshop(id: string, onSuccess: () => void) {
  return useMutation({
    mutationFn: async (data: any) => {
      const newData = new FormData();
      newData.append("title", data.title);
      newData.append("slug", data.slug);
      newData.append("type", data.type || "general");
      newData.append("excerpt", data.excerpt);
      newData.append("content", data.content);
      newData.append("organizers", data.organizers);
      newData.append("week_day", data.week_day);
      newData.append("time", data.time);
      newData.append("start_date", data.start_date);
      newData.append("end_date", data.end_date);

      appendMediaRef(
        newData,
        "image",
        "image_media_id",
        data.image_media_id || data.image
      );

      const res = await fetch(`/api/workshops/${id}`, {
        method: "POST",
        body: newData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویرایش کارگاه");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("کارگاه با موفقیت ویرایش شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در ویرایش کارگاه");
    },
  });
}

export function useDeleteWorkshop(id: string, onDelete: () => void) {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/workshops/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف کارگاه پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("کارگاه با موفقت حذف شد");
      onDelete();
    },
  });
}

export function useAddWorkshopSession(
  workshopId: string,
  onSuccess: () => void
) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/workshops/${workshopId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ثبت جلسه");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("جلسه با موفقیت ثبت شد");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در ثبت جلسه");
    },
  });
}

export function useUpdateWorkshopSession(
  workshopId: string,
  sessionId: string,
  onSuccess: () => void
) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/sessions/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویرایش جلسه");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("جلسه با موفقیت ویرایش شد");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در ویرایش جلسه");
    },
  });
}

export function useDeleteSession(workshopId: string, onSuccess: () => void) {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      return fetch(`/api/workshops/${workshopId}/sessions/${sessionId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("جلسه با موفقیت حذف شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در حذف جلسه");
    },
  });
}

export function useDeleteParticipant(
  workshopId: string,
  onSuccess: () => void
) {
  return useMutation({
    mutationFn: async (participantId: string) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/participants/${participantId}`,
        {
          method: "DELETE",
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "خطا در حذف شرکت کننده");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("شرکت کننده با موفقیت حذف شد");
      onSuccess();
    },
    onError: () => {
      toast.error("خطا در حذف شرکت کننده");
    },
  });
}

export function useWorkshopParticipants(workshopId: string) {
  return useQuery({
    queryKey: ["workshop-participants", workshopId],
    enabled: Boolean(workshopId),
    queryFn: async () => {
      const res = await fetch(`/api/workshops/${workshopId}/participants`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت شرکت‌کنندگان");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useApproveWorkshopParticipant(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async ({
      participantId,
      approved,
    }: {
      participantId: string;
      approved: boolean;
    }) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/participants/${participantId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved }),
        }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || "خطا در تغییر وضعیت تأیید");
      }
      return json;
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در تغییر وضعیت تأیید");
    },
    onSuccess: (_data, vars) => {
      toast.success(vars.approved ? "شرکت‌کننده تأیید شد" : "تأیید لغو شد");
      onSuccess?.();
    },
  });
}

export function useAddWorkshopParticipant(
  workshopId: string,
  onSuccess: () => void
) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/workshops/${workshopId}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          english_name: data.english_name ?? data.name_en,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ثبت شرکت کننده");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("شرکت کننده با موفقیت ثبت شد");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در ثبت شرکت کننده");
    },
  });
}

export function useUpdateWorkshopParticipant(
  workshopId: string,
  participantId: string,
  onSuccess: () => void
) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/participants/${participantId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            english_name: data.english_name ?? data.name_en,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویرایش شرکت کننده");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("شرکت کننده با موفقیت ویرایش شد");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در ویرایش شرکت کننده");
    },
  });
}

export function useWorkshopMaterials(workshopId: string) {
  return useQuery({
    queryKey: ["workshop-materials", workshopId],
    enabled: Boolean(workshopId),
    queryFn: async () => {
      const res = await fetch(`/api/workshops/${workshopId}/materials`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت منابع");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useAddWorkshopMaterial(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/workshops/${workshopId}/materials`, {
        method: "POST",
        body: formData,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ثبت منبع");
      }
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("منبع ثبت شد");
      onSuccess?.();
    },
  });
}

export function useUpdateWorkshopMaterial(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async ({
      materialId,
      formData,
    }: {
      materialId: string;
      formData: FormData;
    }) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/materials/${materialId}`,
        { method: "PATCH", body: formData }
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ویرایش منبع");
      }
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("منبع به‌روزرسانی شد");
      onSuccess?.();
    },
  });
}

export function useDeleteWorkshopMaterial(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async (materialId: string) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/materials/${materialId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "خطا در حذف منبع");
      }
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("منبع حذف شد");
      onSuccess?.();
    },
  });
}

export function useCertificateTemplatePresets() {
  return useQuery({
    queryKey: ["certificate-template-presets"],
    queryFn: async () => {
      const res = await fetch(`/api/certificate-template-presets`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت قالب‌ها");
      }
      return payload;
    },
  });
}

export function useWorkshopCertificateTemplate(workshopId: string) {
  return useQuery({
    queryKey: ["workshop-certificate-template", workshopId],
    enabled: Boolean(workshopId),
    queryFn: async () => {
      const res = await fetch(
        `/api/workshops/${workshopId}/certificate-template`
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت قالب گواهی");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useSaveWorkshopCertificateTemplate(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/certificate-template`,
        { method: "POST", body: formData }
      );
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ذخیره قالب");
      }
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("قالب گواهی ذخیره شد");
      onSuccess?.();
    },
  });
}

export function useWorkshopCertificates(workshopId: string) {
  return useQuery({
    queryKey: ["workshop-certificates", workshopId],
    enabled: Boolean(workshopId),
    queryFn: async () => {
      const res = await fetch(`/api/workshops/${workshopId}/certificates`);
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت گواهی‌ها");
        throw new Error(payload?.message || "خطا");
      }
      return payload;
    },
  });
}

export function useIssueWorkshopCertificates(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async (participantIds: string[]) => {
      const res = await fetch(`/api/workshops/${workshopId}/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_ids: participantIds }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در صدور گواهی");
      }
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("گواهی صادر شد");
      onSuccess?.();
    },
  });
}

export function useUploadWorkshopCertificate(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/workshops/${workshopId}/certificates`, {
        method: "POST",
        body: formData,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || "خطا در آپلود مدرک");
      }
      return payload;
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("فایل مدرک آپلود شد");
      onSuccess?.();
    },
  });
}

export function useDeleteWorkshopCertificate(
  workshopId: string,
  onSuccess?: () => void
) {
  return useMutation({
    mutationFn: async (certificateId: string) => {
      const res = await fetch(
        `/api/workshops/${workshopId}/certificates/${certificateId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "خطا در حذف گواهی");
      }
    },
    onError(e) {
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.success("گواهی حذف شد");
      onSuccess?.();
    },
  });
}

