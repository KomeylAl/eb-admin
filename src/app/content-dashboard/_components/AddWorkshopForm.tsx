"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddWorkshop } from "@/hooks/useWorkshops";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import fa from "react-date-object/locales/persian_fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { workshopSchema } from "@/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertBaseDate } from "@/lib/utils";
import RichTextEditor from "@/components/common/rich-text-editor";

export default function AddWorkshopForm({
  onCloseModal,
}: {
  onCloseModal: () => void;
}) {
  const { mutate: addWorkshop, isPending } = useAddWorkshop(onCloseModal);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workshopSchema),
  });

  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [content, setContent] = useState("");

  const onSubmit = (data: any) => {
    addWorkshop(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">افزودن کارگاه</h2>

      <div className="w-full flex items-center gap-4">
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
          <label>برگزار کننده / برگزار کنندگان</label>
          <Input
            {...register("organizers")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.organizers && (
            <p className="text-red-500 text-sm">{errors.organizers.message}</p>
          )}
        </div>
      </div>

      <div className="w-full">
        <label>اسلاگ</label>
        <Input
          {...register("slug")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
        {errors.slug && (
          <p className="text-red-500 text-sm">{errors.slug.message}</p>
        )}
      </div>

      <div className="w-full">
        <label>خلاصه</label>
        <Textarea
          {...register("excerpt")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
        {errors.excerpt && (
          <p className="text-red-500 text-sm">{errors.excerpt.message}</p>
        )}
      </div>

      <div className="w-full">
        <label>محتوا</label>
        <RichTextEditor
          content={content}
          onChange={(content: string) => {
            setContent(content);
            setValue("content", content);
          }}
        />
      </div>

      <div className="flex gap-3">
        <div className="w-full">
          <label>روز هفته</label>
          <Input
            {...register("week_day")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
        </div>
        <div className="w-full">
          <label>زمان</label>
          <Input
            {...register("time")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-full flex flex-col">
          <label>تاریخ شروع</label>
          <DatePicker
            calendar={persian}
            locale={fa}
            format="YYYY-MM-DD"
            value={startDate}
            onChange={(date: any) => {
              setStartDate(date);
              setValue("start_date", convertBaseDate(date));
            }}
            inputClass="w-full bg-white py-1 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-2 mt-2"
          />
        </div>
        <div className="w-full flex flex-col">
          <label>تاریخ پایان</label>
          <DatePicker
            calendar={persian}
            locale={fa}
            format="YYYY-MM-DD"
            value={endDate}
            onChange={(date: any) => {
              setEndDate(date);
              setValue("end_date", convertBaseDate(date));
            }}
            inputClass="w-full bg-white py-1 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-2 mt-2"
          />
        </div>
      </div>

      <div className="w-full">
        <label>تصویر</label>
        <Input
          type="file"
          accept="image/*"
          {...register("image")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
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
          {isPending ? "در حال ثبت..." : "افزودن کارگاه"}
        </Button>
      </div>
    </form>
  );
}
