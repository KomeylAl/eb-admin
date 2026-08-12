"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddAppointment } from "@/hooks/useAppointments";
import { amountStatusOptions, statusOptions } from "@/lib/selectOptions";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import { Combobox } from "@/components/ui/custom/Combobox";
import ClientCombobox from "@/components/ui/custom/ClientCombobox";
import DoctorCombobox from "@/components/ui/custom/DoctorCombobox";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appointmentType } from "../../../../../types/appointmentTypes";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { appointmentSchema } from "@/validations/appointmentValidations";
import { DateObject } from "react-multi-date-picker";
import { useTreatmentPrograms } from "@/hooks/useTreatmentPrograms";
import { useRoomAvailability, useRooms } from "@/hooks/useRooms";
import { EntityType } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

interface StoreAppFormProps {
  onCloseModal: () => void;
  onAddedAppointment: () => void;
}

const StoreAppForm = ({
  onCloseModal,
  onAddedAppointment,
}: StoreAppFormProps) => {
  const [date, setDate] = useState<string>("");

  const { mutate: storeApp, isPending } = useAddAppointment(() => {
    onAddedAppointment();
    onCloseModal();
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      create_treatment_program: false,
      program_title: "برنامه درمان",
    },
  });

  const doctorId = useWatch({ control, name: "doctor" });
  const clientId = useWatch({ control, name: "client" });
  const createProgram = useWatch({ control, name: "create_treatment_program" });
  const selectedDate = useWatch({ control, name: "date" });
  const selectedTime = useWatch({ control, name: "time" });
  const selectedRoomId = useWatch({ control, name: "room_id" });

  const { data: programsPayload, refetch: refetchPrograms } =
    useTreatmentPrograms({
      clientId: clientId || "",
      doctorId: doctorId || "",
      enabled: Boolean(clientId && doctorId),
    });

  const { data: roomsPayload } = useRooms();
  const { data: availabilityPayload } = useRoomAvailability(
    selectedDate || ""
  );

  useEffect(() => {
    setValue("treatment_program_id", "");
    if (clientId && doctorId) refetchPrograms();
  }, [clientId, doctorId, refetchPrograms, setValue]);

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

  const roomConflict = useMemo(() => {
    if (!selectedRoomId || !selectedTime || !selectedDate) return null;
    const rooms = availabilityPayload?.data?.rooms ?? [];
    const match = rooms.find(
      (item: any) => String(item.room?.id) === String(selectedRoomId)
    );
    const slot = (match?.occupied_slots ?? []).find(
      (s: any) => String(s.time) === String(selectedTime)
    );
    return slot || null;
  }, [availabilityPayload, selectedDate, selectedRoomId, selectedTime]);

  const onSubmit = (data: appointmentType) => {
    storeApp(data);
  };

  return (
    <div className="w-full h-full p-8 space-y-7 max-h-[85vh] overflow-y-auto">
      <h2 className="text-xl font-semibold">افزودن نوبت</h2>
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
                />
              )}
            />
            {errors.doctor && (
              <p className="text-sm text-red-500 mt-1">{errors.doctor.message}</p>
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
                />
              )}
            />
            {errors.client && (
              <p className="text-sm text-red-500 mt-1">{errors.client.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <div className="flex items-center gap-2">
            <Controller
              name="create_treatment_program"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(v) => {
                    field.onChange(Boolean(v));
                    if (v) setValue("treatment_program_id", "");
                  }}
                />
              )}
            />
            <Label>ایجاد برنامه درمان جدید</Label>
          </div>

          {createProgram ? (
            <div className="space-y-2">
              <Label>عنوان برنامه</Label>
              <Input {...register("program_title")} placeholder="برنامه درمان" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>برنامه درمان</Label>
              <Controller
                name="treatment_program_id"
                control={control}
                render={({ field }) => (
                  <Combobox
                    data={programOptions}
                    placeholder={
                      clientId && doctorId
                        ? "انتخاب برنامه"
                        : "ابتدا مراجع و درمانگر را انتخاب کنید"
                    }
                    searchPlaceholder="جستجو..."
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={!clientId || !doctorId}
                  />
                )}
              />
            </div>
          )}
          {(errors as any).treatment_program_id && (
            <p className="text-sm text-red-500">
              {(errors as any).treatment_program_id.message}
            </p>
          )}
        </div>

        <div className="w-full flex gap-3">
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
            {roomConflict && (
              <p className="text-sm text-amber-600">
                این اتاق در این تاریخ/ساعت اشغال است (
                {roomConflict.client?.name || "مراجع"}). ثبت ممکن است رد شود.
              </p>
            )}
          </div>
          <div className="w-full space-y-3">
            <Label>مبلغ این جلسه</Label>
            <Input {...register("amount")} type="number" />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-full space-y-3">
            <Label>تاریخ جلسه</Label>
            <CustomDatePicker
              value={dateConvert(date)}
              onChange={(d: DateObject | null) => {
                setDate(d!.toString());
                setValue("date", convertBaseDate(d!));
              }}
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
            {isPending ? "در حال افزودن..." : "افزودن نوبت"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoreAppForm;
