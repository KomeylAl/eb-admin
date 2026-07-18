"use client";

import RichTextEditor from "@/components/common/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStoreTag } from "@/hooks/useTags";
import { tagSchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AddTagForm = ({ onCloseModal }: { onCloseModal: () => void }) => {
  const { mutate: addTag, isPending } = useStoreTag(onCloseModal);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(tagSchema),
  });

  const [content, setContent] = useState("");

  const onSubmit = (data: any) => {
    addTag(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">افزودن دسته بندی</h2>

      <div className="w-full flex items-center gap-4">
        <div className="w-full">
          <label>نام</label>
          <Input
            {...register("name")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
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
          {isPending ? "در حال ثبت..." : "افزودن دسته بندی"}
        </Button>
      </div>
    </form>
  );
};

export default AddTagForm;
