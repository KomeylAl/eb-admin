import { useUser } from "@/context/UserContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

type LoginCredentials = {
  phone: string;
  password: string;
};

type OtpCredentials = {
  phone: string;
  code: string;
};

type ChangePasswordData = {
  code: string;
  password: string;
  password_confirmation: string;
};

async function postAuth<T>(url: string, data?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  const result = await res.json().catch(() => null);

  if (!res.ok) {
    const validationMessage =
      result?.errors?.code?.[0] ??
      result?.errors?.phone?.[0] ??
      result?.errors?.password?.[0];
    throw new Error(
      result?.message ?? validationMessage ?? "خطا در ارسال اطلاعات!"
    );
  }

  return result as T;
}

export function useLogin(onLogedIn: () => void) {
  const { setUser } = useUser();
  return useMutation({
    mutationFn: (data: LoginCredentials) =>
      postAuth<{ user: unknown }>("/api/auth/login", data),
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: (result) => {
      setUser(result.user);
      toast.success("با موفقیت وارد شدید. لطفا کمی صبر کنید.");
      onLogedIn();
    },
  });
}

export function useRequestLoginOtp() {
  return useMutation({
    mutationFn: (phone: string) =>
      postAuth<{ message?: string }>("/api/auth/otp/request", { phone }),
    onError: (error) => toast.error(error.message),
    onSuccess: (result) =>
      toast.success(result.message ?? "کد ورود برای شما ارسال شد."),
  });
}

export function useVerifyLoginOtp(onLogedIn: () => void) {
  const { setUser } = useUser();
  return useMutation({
    mutationFn: (data: OtpCredentials) =>
      postAuth<{ user: unknown }>("/api/auth/otp/verify", data),
    onError: (error) => toast.error(error.message),
    onSuccess: (result) => {
      setUser(result.user);
      toast.success("با موفقیت وارد شدید. لطفا کمی صبر کنید.");
      onLogedIn();
    },
  });
}

export function useRequestPasswordOtp() {
  return useMutation({
    mutationFn: () =>
      postAuth<{ message?: string }>("/api/auth/password/otp"),
    onError: (error) => toast.error(error.message),
    onSuccess: (result) =>
      toast.success(result.message ?? "کد تغییر رمز برای شما ارسال شد."),
  });
}

export function useChangePassword(onChanged: () => void) {
  return useMutation({
    mutationFn: (data: ChangePasswordData) =>
      postAuth<{ message?: string }>("/api/auth/password", data),
    onError: (error) => toast.error(error.message),
    onSuccess: (result) => {
      toast.success(result.message ?? "رمز عبور با موفقیت تغییر کرد.");
      onChanged();
    },
  });
}

export function useLogout() {
  return useQuery({
    queryKey: ["logout"],
    queryFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.status !== 200) {
        toast.error("خطا در فرایند خروج، لطفا دوباره تلاش کنید.");
      }
      return res.json();
    },
    enabled: false,
  });
}
