import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { appendMediaRef } from "@/lib/mediaForm";

export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const res = await fetch(`/api/about`);
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
  });
}

export function useUpdateAbout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: any) => {
      const newData = new FormData();
      newData.append("title", formData.title);
      newData.append("about", formData.about);
      newData.append("address", formData.address);
      newData.append("phones", formData.phones);
      newData.append("mobile_phones", formData.mobile_numbers);
      newData.append("latitude", formData.lat ?? formData.latitude ?? "");
      newData.append("longitude", formData.long ?? formData.longitude ?? "");
      appendMediaRef(
        newData,
        "logo",
        "logo_media_id",
        formData.logo_media_id || formData.image
      );

      console.log(newData)

      const response = await fetch('/api/about', {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: newData
      });

      if (!response.ok) {
        // لاراول همیشه JSON میفرسته
        const errorData = await response.json();
        console.log(errorData);
        throw errorData;
      }

      return response.json();
    },

    onSuccess: () => {
      toast.success("اطلاعات با موفقیت بروزرسانی شد");
      router.push("/dashboard");
    },

    onError: (error: any) => {
      console.error(error);
      if (error?.errors) {
        // چندتا خطا
        Object.values(error.errors).forEach((errMsgs: any) => {
          errMsgs.forEach((msg: string) => toast.error(msg));
        });
      } else {
        toast.error(error?.message || "خطا در بروزرسانی اطلاعات");
      }
    }
  });
}
