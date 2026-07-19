import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDoctors(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["doctors", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/doctors?page=${page}&pageSize=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    // placeholderData: (prev) => prev,
  });
}

export function useGetDoctor(doctorId: string) {
  return useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${doctorId}`);
      if (res.status !== 200) {
        throw new Error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
  });
}

export function useGetDoctorResume(doctorId: string) {
  return useQuery({
    queryKey: ["doctor-resume", doctorId],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${doctorId}/resume`);
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت اطلاعات");
      }

      return payload;
    },
  });
}

export function useSaveDoctorResume(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      doctorId,
    }: {
      formData: Record<string, unknown>;
      doctorId: string;
    }) => {
      const newData = new FormData();
      newData.append("title", String(formData.title ?? ""));
      newData.append("bio", String(formData.bio ?? ""));
      newData.append("content", String(formData.content ?? ""));
      newData.append("specialization", String(formData.specialization ?? ""));
      newData.append(
        "educations",
        JSON.stringify(formData.educations ?? [])
      );
      newData.append(
        "experiences",
        JSON.stringify(formData.experiences ?? [])
      );
      newData.append("skills", JSON.stringify(formData.skills ?? []));
      newData.append(
        "certifications",
        JSON.stringify(formData.certifications ?? [])
      );
      newData.append(
        "social_links",
        JSON.stringify(formData.social_links ?? {})
      );

      const fileValue = formData.file;
      if (fileValue instanceof FileList && fileValue.length > 0) {
        newData.append("file", fileValue[0]);
      } else if (fileValue instanceof File) {
        newData.append("file", fileValue);
      }

      const res = await fetch(`/api/doctors/${doctorId}/resume`, {
        method: "POST",
        body: newData,
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ذخیره رزومه");
      }

      return json;
    },
    onError(error) {
      toast.error(error.message || "خطا در ذخیره رزومه");
    },
    onSuccess: (_data, variables) => {
      toast.success("رزومه با موفقیت ذخیره شد");
      queryClient.invalidateQueries({
        queryKey: ["doctor-resume", variables.doctorId],
      });
      onSuccess();
    },
  });
}

export function useDoctorSevenDays(
  doctorId: string,
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["doctorSevenDays", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/doctors/${doctorId}/sevenDays?page=${page}&size=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useDoctorThirtyDays(
  doctorId: string,
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["doctorThirtyDays", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/doctors/${doctorId}/thirtyDays?page=${page}&size=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useSendTodaySms(doctorId: string) {
  return useQuery({
    queryKey: ["todaySms"],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${doctorId}/todaySms`);
      if (res.status !== 200) {
        const data = await res.json();
        toast.error("خطا در ارسال پیامک");
        console.log(data);
      }
      toast.success("پیامک با موفقیت ارسال شد");
      return res.json();
    },
    enabled: false,
  });
}

export function useSendTomorrowSms(doctorId: string) {
  return useQuery({
    queryKey: ["tomorrowSms"],
    queryFn: async () => {
      const res = await fetch(`/api/doctors/${doctorId}/tomorrowSms`);
      if (res.status !== 200) {
        const data = await res.json();
        toast.error("خطا در ارسال پیامک");
        console.log(data);
      }
      toast.success("پیامک با موفقیت ارسال شد");
      return res.json();
    },
    enabled: false,
  });
}

export function useAddDoctor(onDuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("name", formData.name);
      newData.append("phone", formData.phone);
      newData.append("national_code", formData.national_code);
      newData.append("medical_number", formData.medical_number);
      newData.append("card_number", formData.card_number);
      newData.append("birth_date", formData.birth_date);
      newData.append("email", formData.email);
      newData.append("days", formData?.days ?? "");
      if (formData.department_ids) {
        formData.department_ids.forEach((id: number) => {
          newData.append("department_ids[]", id.toString());
        });
      }

      if (formData.avatar && formData.avatar.length > 0) {
        newData.append("avatar", formData.avatar[0]);
      }

      if (formData.resume && formData.resume.length > 0) {
        newData.append("resume", formData.resume[0]);
      }

      const res = await fetch(`/api/doctors/`, {
        method: "POST",
        body: newData,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در افزودن متخصص");
      }

      return json;
    },
    onError(error) {
      console.log(error);
      toast.error("خطا در افزودن متخصص");
    },
    onSuccess: () => {
      toast.success("متخصص با موفقیت افزوده شد");
      onDuccess();
    },
  });
}

export function useEditDoctor(doctorId: number, onSuccess: () => void) {
  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("name", formData.name);
      newData.append("phone", formData.phone);
      newData.append("national_code", formData.national_code);
      newData.append("medical_number", formData.medical_number);
      newData.append("card_number", formData.card_number);
      newData.append("birth_date", formData.birth_date);
      newData.append("email", formData.email);
      newData.append("days", formData.days);
      formData.department_ids.forEach((id: number) => {
        newData.append("department_ids[]", id.toString());
      });

      if (formData.avatar && formData.avatar.length > 0) {
        newData.append("avatar", formData.avatar[0]);
      }

      if (formData.resume && formData.resume.length > 0) {
        newData.append("resume", formData.resume[0]);
      }

      const res = await fetch(`/api/doctors/${doctorId}`, {
        method: "POST",
        body: newData,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ویرایش متخصص");
      }

      return json;
    },
    onError() {
      toast.error("خطا در ویرایش متخصص");
    },
    onSuccess: () => {
      toast.success("متخصص با موفقیت ویرایش شد");
      onSuccess();
    },
  });
}

export function useDeleteDoctor(onDeletedTenant: () => void) {
  return useMutation({
    mutationFn: async (doctorId: number) => {
      const res = await fetch(`/api/doctors/${doctorId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف متخصص پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("متخصص با موفقیت حذف شد");
      onDeletedTenant();
    },
  });
}

export function useSaveDoctorsPassword(onSuccess: () => void) {
  return useMutation({
    mutationFn: async ({
      doctorId,
      password,
    }: {
      doctorId: string;
      password: string;
    }) => {
      const res = await fetch(`/api/doctors/${doctorId}/password`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(`${error?.message ?? "خطا در ذخیره رمز عبور!"}`);
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("رمز عبور با موفقیت ذخیره شد");
      onSuccess();
    },
  });
}

/** Fetch all doctors (up to API max per_page) ordered by sort_order. */
export function useAllDoctors(enabled: boolean = true) {
  return useQuery({
    queryKey: ["doctors", "all", "sort_order"],
    queryFn: async () => {
      const res = await fetch(
        `/api/doctors?page=1&pageSize=100&sort_by=sort_order&sort_direction=asc`
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message ?? "خطا در دریافت لیست متخصصین");
      }
      return (json?.data ?? []) as any[];
    },
    enabled,
  });
}

export function useReorderDoctors(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const res = await fetch("/api/doctors/reorder", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ordered_ids: orderedIds }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message ?? "خطا در ذخیره ترتیب متخصصین");
      }
      return json;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("ترتیب متخصصین با موفقیت ذخیره شد");
      onSuccess();
    },
  });
}
