"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { useAbout, useUpdateAbout } from "@/hooks/useAbout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";

// 👇🏻 ولیدیشن
const schema = yup.object().shape({
  title: yup.string().required("عنوان الزامی است"),
  about: yup.string().required("توضیحات الزامی است"),
  address: yup.string().required("آدرس الزامی است"),
  phones: yup.string().required("شماره های تماس الزامی است"),
  mobile_numbers: yup.string().required("شماره همراه الزامی است"),
  lat: yup.string(),
  long: yup.string(),
  image: yup
    .mixed()
    .nullable()
    .test("fileSize", "حجم تصویر نباید بیشتر از 5MB باشد", (value: any) =>
      value ? value.size <= 5 * 1024 * 1024 : true
    ),
});

const About = () => {
  const { data, isLoading } = useAbout();
  const { mutate: updateData, isPending } = useUpdateAbout();

  // فرم
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      about: "",
      address: "",
      mobile_numbers: "",
      phones: "",
      lat: "",
      long: "",
      image: null,
    },
  });

  // وقتی دیتا اومد، فرم رو پر کن
  useEffect(() => {
    if (data) {
      console.log(data);
      reset({
        title: data?.title ?? "",
        about: data?.about ?? "",
        address: data?.address ?? "",
        phones: data?.phones ?? "",
        mobile_numbers: data?.mobile_phones ?? "",
        lat: data?.lat ?? "",
        long: data?.long ?? "",
        image: null,
      });
    }
  }, [data, reset]);

  // فرم سابمیت
  const onSubmit = (formValues: any) => {
    updateData(formValues);
  };

  if (isLoading) {
    return <div className="p-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />

      <div className="w-full flex flex-col p-8">
        <h1 className="font-semibold text-xl">ویرایش بخش درباره</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col mt-8 gap-8"
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-3">
            <h2>عنوان</h2>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} className="w-full bg-white rounded-md p-3" />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h2>متن درباره</h2>
            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <Textarea rows={6} {...field} className="w-full bg-white" />
              )}
            />
            {errors.about && (
              <p className="text-red-500 text-sm">{errors.about.message}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full flex flex-col gap-3">
              <h2>آدرس</h2>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input {...field} className="w-full bg-white" />
                )}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-3">
              <h2>شماره های تماس</h2>
              <Controller
                name="phones"
                control={control}
                render={({ field }) => (
                  <Input {...field} className="w-full bg-white" />
                )}
              />
              {errors.phones && (
                <p className="text-red-500 text-sm">{errors.phones.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2>شماره های همراه</h2>
            <Controller
              name="mobile_numbers"
              control={control}
              render={({ field }) => (
                <Input {...field} className="w-full bg-white" />
              )}
            />
            {errors.mobile_numbers && (
              <p className="text-red-500 text-sm">
                {errors.mobile_numbers.message}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-4">
            <div className="w-full flex flex-col gap-3">
              <h2>تصویر لوگو</h2>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) =>
                      setValue("image", e.target.files?.[0] ?? null)
                    }
                    className="w-full bg-white"
                  />
                )}
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-3">
              <h2>طول جغرافیایی</h2>
              <Controller
                name="lat"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full bg-white rounded-md p-3"
                  />
                )}
              />
              {errors.lat && (
                <p className="text-red-500 text-sm">{errors.lat.message}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-3">
              <h2>عرض جغرافیایی</h2>
              <Controller
                name="long"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full bg-white rounded-md p-3"
                  />
                )}
              />
              {errors.long && (
                <p className="text-red-500 text-sm">{errors.long.message}</p>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "در حال ارسال..." : "ویرایش اطلاعات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default About;
