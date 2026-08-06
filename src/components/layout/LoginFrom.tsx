"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import imagePlaceholder from "../../../public/images/login_placeholder.jpg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useLogin,
  useRequestLoginOtp,
  useVerifyLoginOtp,
} from "@/hooks/useAuth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    code: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  const { mutate: login, isPending } = useLogin();
  const { mutate: requestOtp, isPending: isRequestingOtp } =
    useRequestLoginOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyLoginOtp();

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = window.setInterval(
      () => setResendSeconds((seconds) => Math.max(0, seconds - 1)),
      1000
    );
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const isPhoneValid = /^09\d{9}$/.test(formData.phone);

  const sendOtp = () => {
    if (!isPhoneValid) {
      toast.error("شماره موبایل معتبر وارد کنید.");
      return;
    }
    requestOtp(formData.phone, {
      onSuccess: () => {
        setOtpSent(true);
        setResendSeconds(60);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneValid) {
      toast.error("شماره موبایل معتبر وارد کنید.");
      return;
    }

    if (loginMode === "password") {
      if (!formData.password) {
        toast.error("رمز عبور را وارد کنید.");
        return;
      }
      login({ phone: formData.phone, password: formData.password });
      return;
    }

    if (!otpSent) {
      sendOtp();
      return;
    }
    if (!/^\d{6}$/.test(formData.code)) {
      toast.error("کد شش‌رقمی را وارد کنید.");
      return;
    }
    verifyOtp({ phone: formData.phone, code: formData.code });
  };

  const pending = isPending || isRequestingOtp || isVerifyingOtp;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">خوش برگشتین</h1>
                <p className="text-muted-foreground text-balance">
                  ورود به پنل مدیریت کلینیک ابراز
                </p>
              </div>
              <Tabs
                value={loginMode}
                onValueChange={(value) => {
                  setLoginMode(value as "password" | "otp");
                  setOtpSent(false);
                  setResendSeconds(0);
                  setFormData((current) => ({ ...current, code: "" }));
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="password">ورود با رمز</TabsTrigger>
                  <TabsTrigger value="otp">ورود با کد</TabsTrigger>
                </TabsList>
                <TabsContent value="password" className="space-y-5 pt-3">
                  <Field>
                    <FieldLabel htmlFor="phone-password">
                      شماره موبایل
                    </FieldLabel>
                    <Input
                      id="phone-password"
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      placeholder="09123456789"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </TabsContent>
                <TabsContent value="otp" className="space-y-5 pt-3">
                  <Field>
                    <FieldLabel htmlFor="phone-otp">شماره موبایل</FieldLabel>
                    <Input
                      id="phone-otp"
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      placeholder="09123456789"
                      value={formData.phone}
                      disabled={otpSent}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  {otpSent && (
                    <Field>
                      <FieldLabel htmlFor="otp-code">کد ورود</FieldLabel>
                      <Input
                        id="otp-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        dir="ltr"
                        maxLength={6}
                        placeholder="------"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            code: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                      />
                      <div className="flex items-center justify-between text-sm">
                        <button
                          type="button"
                          className="text-primary underline-offset-4 hover:underline"
                          onClick={() => {
                            setOtpSent(false);
                            setResendSeconds(0);
                          }}
                        >
                          ویرایش شماره
                        </button>
                        <button
                          type="button"
                          className="text-primary disabled:text-muted-foreground"
                          disabled={resendSeconds > 0 || isRequestingOtp}
                          onClick={sendOtp}
                        >
                          {resendSeconds > 0
                            ? `ارسال مجدد تا ${resendSeconds} ثانیه`
                            : "ارسال مجدد کد"}
                        </button>
                      </div>
                      <FieldDescription>
                        کد تا ۵ دقیقه اعتبار دارد.
                      </FieldDescription>
                    </Field>
                  )}
                </TabsContent>
              </Tabs>
              <Field>
                <Button type="submit" disabled={pending}>
                  {loginMode === "otp" && !otpSent ? "دریافت کد" : "ورود"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                یا
              </FieldSeparator>
              <Field>
                <Button variant="ghost" asChild>
                  <Link href="/">بازگشت به سایت</Link>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                در صورت بروز مشکل در ورود به مدیر سایت اطلاع دهید.
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={imagePlaceholder}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
