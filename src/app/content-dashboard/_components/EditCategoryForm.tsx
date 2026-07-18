"use client";

import RichTextEditor from "@/components/common/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCategory } from "@/hooks/useCategories";
import { categorySchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditCategoryForm = ({
  onCloseModal,
  category,
}: {
  onCloseModal: () => void;
  category: any;
}) => {
  const { mutate: updateCategory, isPending } = useUpdateCategory(
    category.id,
    onCloseModal
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image || null
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
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      excerpt: category.excerpt,
      content: category.content,
      image: null,
    },
  });

  // Watch for file input changes to show preview
  const watchImage: any = watch("image");

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(category.image || null);
    }
  }, [watchImage, category.image]);

  const onSubmit = (data: any) => {
    updateCategory(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">ویرایش دسته بندی</h2>

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
          content={category.content}
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
          {isPending ? "در حال ثبت..." : "ویرایش دسته بندی"}
        </Button>
      </div>
    </form>
  );
};

export default EditCategoryForm;
