"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetDoctor, useSaveDoctorsPassword } from "@/hooks/useDoctors";
import { useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import UpdateDoctorForm from "../forms/UpdateDoctorForm";

const DoctorInfo = ({ doctorId }: { doctorId: string }) => {
  const [password, setPassword] = useState("");
  const { mutate: savePassword, isPending } = useSaveDoctorsPassword(() =>
    setPassword("")
  );
  const { data, isLoading, error, refetch } = useGetDoctor(doctorId);
  const doctor = data?.data ?? null;

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <PuffLoader size={60} color="#3e86fa" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-10">
        <p className="text-rose-500 text-sm">خطا در دریافت اطلاعات متخصص</p>
        <Button variant="outline" onClick={() => refetch()}>
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl border bg-card">
        <UpdateDoctorForm
          key={String(doctor.updated_at ?? doctor.id)}
          doctor={doctor}
          embedded
          onCloseModal={() => {}}
          onDoctorEditted={() => refetch()}
        />
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-3 max-w-xl">
        <h3 className="font-semibold">تغییر رمز عبور</h3>
        <div className="space-y-1">
          <Label>رمز عبور جدید</Label>
          <Input
            type="password"
            value={password}
            placeholder="رمز عبور جدید"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button
          disabled={isPending}
          onClick={() => {
            if (!password) {
              toast.error("رمز عبور را وارد کنید");
              return;
            }
            savePassword({ doctorId, password });
          }}
        >
          {isPending ? "در حال ذخیره..." : "ذخیره رمز عبور"}
        </Button>
      </div>
    </div>
  );
};

export default DoctorInfo;
