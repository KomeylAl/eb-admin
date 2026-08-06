"use client";

import { Button } from "@/components/ui/button";
import { useUpdateAppointment } from "@/hooks/useAppointments";
import { amountStatusOptions, statusOptions } from "@/lib/selectOptions";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import { Combobox } from "@/components/ui/custom/Combobox";
import ClientCombobox from "@/components/ui/custom/ClientCombobox";
import DoctorCombobox from "@/components/ui/custom/DoctorCombobox";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AppointmentApiType,
  appointmentType,
} from "../../../../../types/appointmentTypes";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { appointmentSchema } from "@/validations/appointmentValidations";
import { DateObject } from "react-multi-date-picker";

interface UpdateAppFormProps {
  onCloseModal: () => void;
  appointment: AppointmentApiType;
  appId: string;
}

const UpdateAppForm = ({
  onCloseModal,
  appointment,
  appId,
}: UpdateAppFormProps) => {
  const { mutate: storeApp, isPending } = useUpdateAppointment(() =>
    onCloseModal()
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      amount: appointment?.amount ?? "",
      amount_status: appointment?.payment_status ?? "",
      client: appointment?.client.id ?? "",
      date: appointment?.date ?? "",
      doctor: appointment?.doctor.id ?? "",
      status: appointment?.status ?? "",
      time: appointment?.time ?? "",
    },
  });

  const onSubmit = (data: appointmentType) => {
    storeApp({ data, appId });
  };

  return (
    <div className="w-full h-full p-8 space-y-7">
      <h2 className="text-xl font-semibold">ویرایش نوبت</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="w-full flex gap-3">
          <div className="w-full space-y-3">
            <Label>انتخاب متخصص</Label>
            <Controller
              name="doctor"
              control={control}
              render={({ field }) => (
                <DoctorCombobox
                  value={String(field?.value ?? "")}
                  onChange={field.onChange}
                  selectedLabel={appointment?.doctor?.name}
                />
              )}
            />
            {errors.doctor && (
              <p className="text-sm text-red-500 mt-1">
                {errors.doctor.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-3">
            <Label>انتخاب مراجع</Label>
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <ClientCombobox
                  value={String(field?.value ?? "")}
                  onChange={field.onChange}
                  selectedLabel={appointment?.client?.name}
                />
              )}
            />
            {errors.client && (
              <p className="text-sm text-red-500 mt-1">
                {errors.client.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex gap-3">
          <div className="w-full space-y-3">
            <Label>مبلغ این جلسه</Label>
            <Input {...register("amount")} type="number" className="" />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-3">
            <Label>تاریخ جلسه</Label>
            <div className="w-full">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value ? dateConvert(field.value) : undefined}
                    onChange={(date: DateObject | null) => {
                      field.onChange(convertBaseDate(date!));
                    }}
                  />
                )}
              />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full space-y-3">
            <Label>ساعت جلسه</Label>
            <div className="w-full space-y-3">
              <Input {...register("time")} type="text" className="" />
              {errors.time && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full gap-3 mt-9">
          <div className="w-full space-y-3">
            <Label>وضعیت</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Combobox
                  data={statusOptions}
                  placeholder="وضعیت"
                  searchPlaceholder="جستجو..."
                  value={field?.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-3">
            <Label>وضعیت پرداخت</Label>
            <Controller
              name="amount_status"
              control={control}
              render={({ field }) => (
                <Combobox
                  data={amountStatusOptions}
                  placeholder="وضعیت پرداخت"
                  searchPlaceholder="جستجو..."
                  value={field?.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.amount_status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.amount_status.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-3">
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
            {isPending ? "در حال ویرایش..." : "ویرایش نوبت"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAppForm;
