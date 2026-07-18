"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWorkshopSession } from "@/hooks/useWorkshops";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import { workshopSessionSchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import fa from "react-date-object/locales/persian_fa";

interface EditWorkshopSessionFormProps {
  onCloseModal: () => void;
  workshopId: string;
  session: any;
}

const EditWorkshopSession = ({
  onCloseModal,
  workshopId,
  session,
}: EditWorkshopSessionFormProps) => {
  const { mutate: updateSession, isPending } = useUpdateWorkshopSession(
    workshopId,
    session.id,
    onCloseModal
  );
  const [sessionDate, setSessionDate] = useState<any>(
    session.session_date || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workshopSessionSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (session) {
      reset(session);
    }
  }, [session, reset]);

  const onSubmit = (data: any) => {
    updateSession(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">ویرایش جلسه</h2>

      <div className="w-full">
        <label>عنوان</label>
        <Input
          {...register("title")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="w-full">
        <label>توضیحات</label>
        <Textarea
          {...register("description")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="w-full flex flex-col">
          <label>تاریخ برگزاری</label>
          <DatePicker
            calendar={persian}
            locale={fa}
            format="YYYY-MM-DD"
            value={dateConvert(sessionDate)}
            onChange={(date: any) => {
              setSessionDate(date);
              setValue("session_date", convertBaseDate(date));
            }}
            inputClass="w-full bg-white py-1 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-2 mt-2"
          />
          {errors.session_date && (
            <p className="text-red-500 text-sm">
              {errors.session_date.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <label>ساعت شروع</label>
          <Input
            {...register("start_time")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.start_time && (
            <p className="text-red-500 text-sm">{errors.start_time.message}</p>
          )}
        </div>
        <div className="w-full">
          <label>ساعت پایان</label>
          <Input
            {...register("end_time")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.end_time && (
            <p className="text-red-500 text-sm">{errors.end_time.message}</p>
          )}
        </div>
      </div>

      <div className="w-full">
        <label>مکان برگزاری</label>
        <Input
          {...register("location")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
      </div>

      <div className="w-full">
        <label>لینک</label>
        <Input
          {...register("link")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="outline" onClick={onCloseModal} type="button">
          بازگشت
        </Button>
        <Button
          type="submit"
          className={`${isPending ? "bg-blue-400" : "bg-blue-600"}`}
          disabled={isPending}
        >
          {isPending ? "در حال ثبت..." : "ویرایش جلسه"}
        </Button>
      </div>
    </form>
  );
};

export default EditWorkshopSession;
