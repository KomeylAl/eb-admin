"use client";

import { useEditDoctor } from "@/hooks/useDoctors";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import fa from "react-date-object/locales/persian_fa";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { doctorSchema } from "@/validations";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { MultiCombobox } from "@/components/ui/custom/MultiCombobox";
import { EntityType } from "@/lib/types";
import axios from "axios";
import toast from "react-hot-toast";

interface UpdateDoctorFormProps {
  doctor: any;
  onDoctorEditted: () => void;
  onCloseModal: () => void;
}

const UpdateDoctorForm = ({
  doctor,
  onDoctorEditted,
  onCloseModal,
}: UpdateDoctorFormProps) => {
  const { mutate: updateDoctor, isPending } = useEditDoctor(
    doctor.id,
    onDoctorEditted
  );

  const profile = doctor.doctor_profile ?? {};
  const avatarSrc =
    doctor.avatar_url ?? doctor.avatar ?? profile.avatar_url ?? profile.avatar;
  const [imagePreview, setImagePreview] = useState<string | null>(
    avatarSrc || null
  );
  const [birthDate, setBirhtDate] = useState<any>(null);
  const [departments, setDepartments] = useState<EntityType[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`/api/departments`);
        const entities = response.data.data.map((item: any) => ({
          label: item.title,
          value: item.id.toString(),
        }));
        setDepartments(entities);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    fetchDepartments();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(doctorSchema),
    defaultValues: {
      name: doctor.name,
      phone: doctor.phone,
      national_code: doctor.national_code ?? profile.national_code,
      card_number: doctor.card_number ?? profile.card_number,
      medical_number: doctor.medical_number ?? profile.medical_number,
      birth_date: doctor.birth_date,
      email: doctor.email,
      days: doctor.days ?? profile.days,
      department_ids: (doctor.departments ?? []).map((item: any) =>
        item.id.toString()
      ),
      avatar: null,
      resume: null,
    },
  });

  const watchImage: any = watch("avatar");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(avatarSrc || null);
    }
  }, [watchImage, avatarSrc]);

  const onSubmit = (data: any) => {
    // console.log(data);
    updateDoctor(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">ویرایش متخصص</h2>

      <div className="w-full flex items-center gap-4">
        <div className="w-full">
          <label>نام و نام خانوادگی</label>
          <Input
            {...register("name")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="w-full">
          <label>تلفن</label>
          <Input
            {...register("phone")}
            type="number"
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
        <div className="w-full">
          <label>کد ملی</label>
          <Input
            {...register("national_code")}
            type="number"
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.national_code && (
            <p className="text-red-500 text-sm">
              {errors.national_code.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex items-center gap-4">
        <div className="w-full">
          <label>شماره نظام روانشناسی</label>
          <Input
            {...register("medical_number")}
            type="number"
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.medical_number && (
            <p className="text-red-500 text-sm">
              {errors.medical_number.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <label>شماره کارت</label>
          <Input
            {...register("card_number")}
            type="number"
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.card_number && (
            <p className="text-red-500 text-sm">{errors.card_number.message}</p>
          )}
        </div>
      </div>

      <div className="w-full flex items-center gap-4">
        <div className="w-full">
          <div className="w-full flex flex-col">
            <label>تاریخ تولد</label>
            <DatePicker
              calendar={persian}
              locale={fa}
              format="YYYY-MM-DD"
              value={dateConvert(doctor.birth_date)}
              onChange={(date: any) => {
                setBirhtDate(doctor.birth_date);
                setValue("birth_date", convertBaseDate(date));
              }}
              inputClass="w-full bg-white py-1 shadow-sm rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-2 mt-2"
            />
          </div>
          {errors.medical_number && (
            <p className="text-red-500 text-sm">
              {errors.medical_number.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <label>ایمیل</label>
          <Input
            {...register("email")}
            type="email"
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="w-full flex items-start gap-4">
        <div className="space-y-2 w-full">
          <label className="">دپارتمان</label>
          <Controller
            name="department_ids"
            control={control}
            render={({ field }) => (
              <MultiCombobox
                data={departments}
                placeholder="انتخاب دپارتمان"
                searchPlaceholder="جستجو..."
                dValue={field.value || []}
                onChange={field.onChange}
                isMulti
              />
            )}
          />
          {errors.department_ids && (
            <p className="text-sm text-red-500 mt-1">
              {errors.department_ids.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <label>روزها و ساعات حضور</label>
          <Input
            {...register("days")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.days && (
            <p className="text-red-500 text-sm">{errors.days.message}</p>
          )}
        </div>
      </div>

      <div className="w-full flex items-start gap-4">
        <div className="w-full">
          <label>آواتار</label>
          <Input
            type="file"
            accept="image/*"
            {...register("avatar")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.avatar && (
            <p className="text-red-500 text-sm">{errors.avatar.message}</p>
          )}
          {imagePreview && (
            <div className="mt-3">
              {/* unoptimized: Laravel storage URLs fail via /_next/image optimizer (400) */}
              <Image
                src={imagePreview}
                alt="Avatar Preview"
                width={200}
                height={200}
                unoptimized
                className="rounded-md object-cover"
              />
            </div>
          )}        </div>
        <div className="w-full">
          <label>رزومه</label>
          <Input
            type="file"
            accept="pdf/*"
            {...register("resume")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.resume && (
            <p className="text-red-500 text-sm">{errors.resume.message}</p>
          )}
          <div className="mt-3">
            {doctor.resume ? (
              <iframe
                src={doctor.resume}
                width="100%"
                height="300px"
                className="border rounded-lg"
              />
            ) : (
              <p>رزومه بارگذاری نشده است.</p>
            )}
          </div>
        </div>
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
          {isPending ? "در حال ثبت..." : "ویرایش متخصص"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateDoctorForm;
