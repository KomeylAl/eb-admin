import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useWorksops(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["workshops", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/workshops?page=${page}&size=${pageSize}&search=${search}`
      );
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
      newData.append("excerpt", formData.excerpt);
      newData.append("content", formData.content);
      newData.append("organizers", formData.organizers);
      newData.append("week_day", formData.week_day);
      newData.append("time", formData.time);
      newData.append("start_date", formData.start_date);
      newData.append("end_date", formData.end_date);

      if (formData.image && formData.image.length > 0) {
        newData.append("image", formData.image[0]);
      }

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
      newData.append("excerpt", data.excerpt);
      newData.append("content", data.content);
      newData.append("organizers", data.organizers);
      newData.append("week_day", data.week_day);
      newData.append("time", data.time);
      newData.append("start_date", data.start_date);
      newData.append("end_date", data.end_date);

      if (data.image && data.image.length > 0) {
        newData.append("image", data.image[0]);
      }

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

      const json = await res.json();

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
        body: JSON.stringify(data),
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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
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
