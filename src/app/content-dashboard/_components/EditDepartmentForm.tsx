"use client";

import RichTextEditor from "@/components/common/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateDepartment } from "@/hooks/useDepartments";
import { departmentSchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditDepartmentForm = ({
  onCloseModal,
  department,
}: {
  onCloseModal: () => void;
  department: any;
}) => {
  const { mutate: updateDepartment, isPending } = useUpdateDepartment(
    department.slug,
    onCloseModal
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    department.thumbnail || null
  );
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues: {
      title: department.title,
      slug: department.slug,
      excerpt: department.excerpt,
      content: department.content,
      thumbnail: null,
    },
  });

  // Watch for file input changes to show preview
  const watchImage: any = watch("thumbnail");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(department.thumbnail || null);
    }
  }, [watchImage, department.thumbnail]);

  const onSubmit = (data: any) => {
    updateDepartment(data);
  };
  return (
   <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">ویرایش دپارتمان</h2>

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
          <label>اسلاگ</label>
          <Input
            {...register("slug")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.slug && (
            <p className="text-red-500 text-sm">{errors.slug.message}</p>
          )}
        </div>
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
          content={department.content}
          onChange={(content: string) => {
            setContent(content);
            setValue("content", content);
          }}
        />
      </div>

      <div className="w-full">
        <label>تصویر</label>
        <Input
          type="file"
          accept="image/*"
          {...register("thumbnail")}
          className="w-full bg-white py-2 rounded-md  px-2 mt-2"
        />
        {errors.thumbnail && (
          <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
        )}
        {imagePreview && (
          <div className="mt-3">
            <Image
              src={imagePreview}
              alt="Category Preview"
              width={200}
              height={200}
              unoptimized
              className="rounded-md object-cover"
            />
          </div>
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
          {isPending ? "در حال ثبت..." : "ویرایش دپارتمان"}
        </Button>
      </div>
    </form>
  );
};

export default EditDepartmentForm;
