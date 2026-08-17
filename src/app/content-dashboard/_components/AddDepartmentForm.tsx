"use client";

import RichTextEditor from "@/components/common/rich-text-editor";
import MediaPicker from "@/components/common/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStoreDepartment } from "@/hooks/useDepartments";
import { departmentSchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AddDepartmentForm = ({ onCloseModal }: { onCloseModal: () => void }) => {
  const { mutate: addDepartment, isPending } = useStoreDepartment(onCloseModal);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departmentSchema),
  });

  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    addDepartment(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">افزودن دپارتمان</h2>

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
          content={content}
          onChange={(content: string) => {
            setContent(content);
            setValue("content", content);
          }}
        />
      </div>

      <div className="w-full">
        <label>تصویر</label>
        <div className="mt-2">
          <MediaPicker
            collection="departments"
            previewUrl={imagePreview}
            onChange={(media) => {
              setValue("thumbnail_media_id", media?.id ?? null, { shouldDirty: true, shouldValidate: true });
              setImagePreview(media?.url ?? null);
            }}
          />
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
          {isPending ? "در حال ثبت..." : "افزودن دپارتمان"}
        </Button>
      </div>
    </form>
  );
};

export default AddDepartmentForm;
