import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSendSingleSms(onSuccess: () => void) {
  return useMutation({
    mutationFn: async ({ text, phone }: { text: string; phone: string }) => {
      const res = await fetch("/api/sms/single", {
        method: "POST",
        body: JSON.stringify({ phone, text }),
      });
      if (!res.ok) {
        throw new Error("مشکلی در ارسال پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("ارسال با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useSendMultiSms(onSuccess: () => void) {
  return useMutation({
    mutationFn: async ({ text, phones }: { text: string; phones: string[] }) => {
      const res = await fetch("/api/sms/multi", {
        method: "POST",
        body: JSON.stringify({ phones, text }),
      });
      if (!res.ok) {
        throw new Error("مشکلی در ارسال پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("ارسال با موفقیت حذف شد");
      onSuccess();
    },
  });
}
