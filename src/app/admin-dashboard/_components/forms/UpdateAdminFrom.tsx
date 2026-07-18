"use client";

import { useUpdateAdmin } from "@/hooks/useAdmins";
import { roleOptions } from "@/lib/selectOptions";
import { useState } from "react";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminSchema } from "@/validations";
import { Combobox } from "@/components/ui/custom/Combobox";

interface UpdateAdminFormProps {
  admin: any;
  onAdminUpdated: () => void;
  onCloseModal: () => void;
}

const UpdateAdminForm = ({
  admin,
  onAdminUpdated,
  onCloseModal,
}: UpdateAdminFormProps) => {
  const { mutate: updateAdmin, isPending } = useUpdateAdmin(
    admin.id,
    onAdminUpdated
  );

  const [setBirhtDate] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adminSchema),
    defaultValues: {
      name: admin.name,
      phone: admin.phone,
      role: admin.admin_role ?? admin.role,
      birth_date: admin.birth_date,
      password: admin.password,
    },
  });

  const onSubmit = (data: any) => {
    updateAdmin(data);
  };

  return (
    <div className="w-full h-full p-8 space-y-7">
      <h2 className="text-xl font-semibold">ویرایش مدیر</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex gap-3 mt-9">
          <div className="w-full">
            <label>نام و نام خانوادگی</label>
            <Input
              {...register("name")}
              type="text"
              className="w-full bg-white"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full">
            <label>نقش</label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Combobox
                  data={roleOptions}
                  placeholder="انتخاب نفش"
                  searchPlaceholder="جستجو..."
                  value={field?.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>
        </div>
        <div className="w-full flex gap-3 mt-9">
          <div className="w-full">
            <label>شماره تلفن</label>
            <Input
              {...register("phone")}
              type="number"
              className="w-full bg-white"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label>تاریخ تولد</label>
            <div className="w-full">
              <CustomDatePicker
                value={dateConvert(admin.birth_date)}
                onChange={(date: any) => {
                  setBirhtDate(admin.birth_date);
                  setValue("birth_date", convertBaseDate(date));
                }}
              />
              {errors.birth_date && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.birth_date.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full">
            <label>رمز عبور</label>
            <Input
              {...register("password")}
              type="text"
              className="w-full bg-white text-left"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-3 mt-6">
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer"
            onClick={onCloseModal}
          >
            بازگشت
          </Button>
          <Button
            variant="default"
            size="lg"
            className={`cursor-pointer ${
              isPending ? "bg-blue-400" : "bg-blue-600"
            }`}
            type="submit"
          >
            {isPending ? "در حال ویرایش..." : "ویرایش مدیر"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAdminForm;
