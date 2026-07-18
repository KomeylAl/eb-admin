"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSaveDoctorsPassword } from "@/hooks/useDoctors";
import { useState } from "react";
import toast from "react-hot-toast";

interface DoctorInfoProps {
  doctorId: string;
  doctor: any;
}

const DoctorInfo = ({ doctorId, doctor }: DoctorInfoProps) => {
  const [password, setPassword] = useState("");
  const { mutate: savePassword, isPending } = useSaveDoctorsPassword(() => {});
  return (
    <div className="w-full p-4 space-y-3">
      <Input
        placeholder="رمز عبور جدید"
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        disabled={isPending}
        onClick={() => {
          if (!password) toast.error("رمز عبور را وارد کنید");
          savePassword({ doctorId, password });
        }}
      >
        دخیره رمز عبور
      </Button>
    </div>
  );
};

export default DoctorInfo;
