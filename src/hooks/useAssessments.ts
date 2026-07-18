import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAssessments(
  page: number = 0,
  pageSize: number = 10,
  search: string = "",
  date: string = "",
  clientId: string = ""
) {
  return useQuery({
    queryKey: ["assessments", page, pageSize, search, date, clientId],
    queryFn: async () => {
      const res = await fetch(
        `/api/assessments?page=${page}&size=${pageSize}&search=${search}&date=${date}&clientId=${clientId}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useDeleteAssessment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/assessments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف نویت پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("نویت با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useStoreAssessment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch("/api/assessments", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در افزودن نویت");
      }

      return json;
    },
    onSuccess: () => {
      toast.success("نویت با موفقیت ثبت شد");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function useUpdateAssessment(onSuccess: () => void) {
  return useMutation({
    mutationFn: async ({
      formData,
      assessmentId,
    }: {
      formData: any;
      assessmentId: string;
    }) => {
      const newData = new FormData();
      newData.append("client", formData.client);
      newData.append("doctor_id", formData.doctor_id);
      newData.append("date", formData.date);
      newData.append("time", JSON.stringify(formData.time));
      newData.append("status", JSON.stringify(formData.status));

      if (formData.file && formData.file.length > 0) {
        newData.append("file", formData.file[0]);
      }

      const res = await fetch(`/api/assessments/${assessmentId}`, {
        method: "POST",
        body: newData,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویرایش ارزیابی");
      }

      return json;
    },
    onError(error) {
      console.log(error);
      toast.error("خطا در ویرایش ارزیابی");
    },
    onSuccess: () => {
      toast.success("ارزیابی با موفقیت ویرایش شد");
      onSuccess();
    },
  });
}
