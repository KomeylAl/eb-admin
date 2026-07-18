"use client";

import { useEffect, useState } from "react";
import {
  useChangePassword,
  useRequestPasswordOtp,
} from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";

type ChangePasswordFormProps = {
  onSuccess?: () => void;
  compact?: boolean;
};

export default function ChangePasswordForm({
  onSuccess,
  compact = false,
}: ChangePasswordFormProps) {
  const { user } = useUser();
  const [otpRequested, setOtpRequested] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    passwordConfirmation: "",
  });
  const { mutate: requestOtp, isPending: isRequesting } =
    useRequestPasswordOtp();
  const { mutate: changePassword, isPending: isChanging } =
    useChangePassword(() => {
      setOtpRequested(false);
      setResendSeconds(0);
      setFormData({ code: "", password: "", passwordConfirmation: "" });
      onSuccess?.();
    });

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = window.setInterval(
      () => setResendSeconds((seconds) => Math.max(0, seconds - 1)),
      1000
    );
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const sendOtp = () => {
    requestOtp(undefined, {
      onSuccess: () => {
        setOtpRequested(true);
        setResendSeconds(60);
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(formData.code)) {
      toast.error("کد شش‌رقمی را وارد کنید.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (formData.password !== formData.passwordConfirmation) {
      toast.error("تکرار رمز عبور با رمز جدید یکسان نیست.");
      return;
    }

    changePassword({
      code: formData.code,
      password: formData.password,
      password_confirmation: formData.passwordConfirmation,
    });
  };

  if (!otpRequested) {
    return (
      <div
        className={
          compact ? "space-y-4" : "space-y-4 rounded-lg border p-5"
        }
      >
        <div className="space-y-1">
          {!compact && <h3 className="font-medium">تغییر رمز عبور</h3>}
          <p className="text-muted-foreground text-sm">
            کد تأیید به شماره {user?.phone ?? "ثبت‌شده حساب شما"} ارسال می‌شود.
          </p>
        </div>
        <Button type="button" onClick={sendOtp} disabled={isRequesting}>
          {isRequesting ? "در حال ارسال..." : "ارسال کد تغییر رمز"}
        </Button>
      </div>
    );
  }

  return (
    <form
      className={
        compact
          ? "space-y-5"
          : "max-w-xl space-y-5 rounded-lg border p-5"
      }
      onSubmit={handleSubmit}
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="change-password-code">کد تأیید</FieldLabel>
          <Input
            id="change-password-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            dir="ltr"
            maxLength={6}
            placeholder="------"
            value={formData.code}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                code: event.target.value.replace(/\D/g, ""),
              }))
            }
          />
          <div className="flex items-center justify-between text-sm">
            <FieldDescription>اعتبار کد ۵ دقیقه است.</FieldDescription>
            <button
              type="button"
              className="text-primary disabled:text-muted-foreground"
              disabled={resendSeconds > 0 || isRequesting}
              onClick={sendOtp}
            >
              {resendSeconds > 0
                ? `ارسال مجدد تا ${resendSeconds} ثانیه`
                : "ارسال مجدد کد"}
            </button>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="new-password">رمز عبور جدید</FieldLabel>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="new-password-confirmation">
            تکرار رمز عبور جدید
          </FieldLabel>
          <Input
            id="new-password-confirmation"
            type="password"
            autoComplete="new-password"
            value={formData.passwordConfirmation}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                passwordConfirmation: event.target.value,
              }))
            }
          />
        </Field>
        <Button type="submit" disabled={isChanging}>
          {isChanging ? "در حال تغییر..." : "تغییر رمز عبور"}
        </Button>
      </FieldGroup>
    </form>
  );
}
