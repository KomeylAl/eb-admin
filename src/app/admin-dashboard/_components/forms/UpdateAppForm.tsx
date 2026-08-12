"use client";

import { useEffect, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  AppointmentApiType,
  appointmentType,
} from "../../../../../types/appointmentTypes";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { appointmentUpdateSchema } from "@/validations/appointmentValidations";
import { DateObject } from "react-multi-date-picker";
import { useTreatmentPrograms } from "@/hooks/useTreatmentPrograms";
import { useRooms } from "@/hooks/useRooms";
import { EntityType } from "@/lib/types";
import AppointmentHomeworksPanel from "./AppointmentHomeworksPanel";

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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentUpdateSchema),
    defaultValues: {
      amount: appointment?.amount ?? "",
      amount_status: appointment?.payment_status ?? "",
      client: appointment?.client?.id ?? "",
      date: appointment?.date ?? "",
      doctor: appointment?.doctor?.id ?? "",
      status: appointment?.status ?? "",
      time: appointment?.time ?? "",
      treatment_program_id:
        appointment?.treatment_program_id ??
        (appointment as any)?.treatment_program?.id ??
        "",
      room_id: appointment?.room_id ?? (appointment as any)?.room?.id ?? "",
      session_notes: appointment?.session_notes ?? "",
    },
  });

  const doctorId = useWatch({ control, name: "doctor" });
  const clientId = useWatch({ control, name: "client" });

  const { data: programsPayload, refetch: refetchPrograms } =
    useTreatmentPrograms({
      clientId: clientId || "",
      doctorId: doctorId || "",
      enabled: Boolean(clientId && doctorId),
    });
  const { data: roomsPayload } = useRooms();

  useEffect(() => {
    if (clientId && doctorId) refetchPrograms();
  }, [clientId, doctorId, refetchPrograms]);

  const programOptions: EntityType[] = useMemo(
    () =>
      (programsPayload?.data ?? []).map((p: any) => ({
        label: `${p.title || "برنامه"} (${p.status})`,
        value: String(p.id),
      })),
    [programsPayload]
  );

  const roomOptions: EntityType[] = useMemo(
    () =>
      (roomsPayload?.data ?? []).map((r: any) => ({
        label: r.code ? `${r.name} (${r.code})` : r.name,
        value: String(r.id),
      })),
    [roomsPayload]
  );

  const onSubmit = (data: appointmentType) => {
    storeApp({ data, appId });
  };

  return (
    <div className="w-full h-full p-8 space-y-7 max-h-[85vh] overflow-y-auto">
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
                  onChange={(v) => {
                    field.onChange(v);
                    setValue("treatment_program_id", "");
                  }}
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
                  onChange={(v) => {
                    field.onChange(v);
                    setValue("treatment_program_id", "");
                  }}
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
            <Label>برنامه درمان</Label>
            <Controller
              name="treatment_program_id"
              control={control}
              render={({ field }) => (
                <Combobox
                  data={programOptions}
                  placeholder="انتخاب برنامه"
                  searchPlaceholder="جستجو..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  disabled={!clientId || !doctorId}
                />
              )}
            />
            {errors.treatment_program_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.treatment_program_id.message as string}
              </p>
            )}
          </div>
          <div className="w-full space-y-3">
            <Label>اتاق (اختیاری)</Label>
            <Controller
              name="room_id"
              control={control}
              render={({ field }) => (
                <Combobox
                  data={roomOptions}
                  placeholder="انتخاب اتاق"
                  searchPlaceholder="جستجو..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-full space-y-3">
            <Label>مبلغ این جلسه</Label>
            <Input {...register("amount")} type="number" />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-3">
            <Label>تاریخ جلسه</Label>
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
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>
          <div className="w-full space-y-3">
            <Label>ساعت جلسه</Label>
            <Input {...register("time")} type="text" />
            {errors.time && (
              <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
            )}
          </div>
        </div>

        <div className="flex w-full gap-3">
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
          </div>
        </div>

        <div className="space-y-2">
          <Label>یادداشت جلسه</Label>
          <Textarea rows={4} {...register("session_notes")} />
        </div>

        <AppointmentHomeworksPanel
          appointmentId={String(appointment?.id ?? appId)}
          initialHomeworks={(appointment as any)?.homeworks}
        />

        <div className="w-full flex items-center justify-end gap-3">
          <Button variant="outline" size="lg" onClick={onCloseModal}>
            بازگشت
          </Button>
          <Button
            variant="default"
            size="lg"
            className={isPending ? "bg-blue-400" : "bg-blue-600"}
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
