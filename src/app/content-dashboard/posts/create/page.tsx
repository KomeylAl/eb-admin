"use client";

import RichTextEditor from "@/components/common/rich-text-editor";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/custom/Combobox";
import { MultiCombobox } from "@/components/ui/custom/MultiCombobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStorePost } from "@/hooks/usePosts";
import { EntityType } from "@/lib/types";
import { postSchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CreatePost = () => {
  const router = useRouter();
  const { mutate: addPost, isPending } = useStorePost(() =>
    router.replace("/dashboard/posts")
  );

  const [categories, setCategories] = useState<EntityType[]>([]);
  const [tags, setTags] = useState<EntityType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/categories`);
        const entities = response.data.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setCategories(entities);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(`/api/tags`);
        const entities = response.data.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setTags(entities);
      } catch (err: any) {
        toast.error(err.message);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(postSchema),
  });

  const [content, setContent] = useState("");

  const onSubmit = (data: any) => {
    addPost(data);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full p-6 sm:p-8 space-y-7"
      >
        <h2 className="text-xl font-semibold">افزودن مطلب</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label>نام</label>
            <Input
              {...register("title")}
              className="mt-2 bg-white"
              placeholder="عنوان مطلب"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label>اسلاگ</label>
            <Input
              {...register("slug")}
              className="mt-2 bg-white"
              placeholder="slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div className="">
            <label>دسته بندی</label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Combobox
                  data={categories}
                  placeholder="انتخاب دسته‌بندی"
                  searchPlaceholder="جستجو..."
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.category_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="">برچسب‌ها</label>
            <Controller
              name="tag_ids"
              control={control}
              render={({ field }) => (
                <MultiCombobox
                  data={tags}
                  placeholder="انتخاب برچسب"
                  searchPlaceholder="جستجو..."
                  dValue={field.value || []}
                  onChange={field.onChange}
                  isMulti
                />
              )}
            />
            {errors.tag_ids && (
              <p className="text-sm text-red-500 mt-1">
                {errors.tag_ids.message}
              </p>
            )}
          </div>

          <div className="-mt-2">
            <label>وضعیت</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  dir="rtl"
                  onValueChange={field.onChange}
                  value={field.value || "draft"}
                >
                  <SelectTrigger className="w-full mt-2 bg-white">
                    <SelectValue placeholder="وضعیت را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">پیش‌نویس</SelectItem>
                    <SelectItem value="archived">آرشیو شده</SelectItem>
                    <SelectItem value="published">منتشر شده</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label>خلاصه</label>
          <Textarea
            {...register("excerpt")}
            className="mt-2 bg-white"
            rows={4}
            placeholder="متن خلاصه..."
          />
          {errors.excerpt && (
            <p className="text-sm text-red-500 mt-1">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        <div>
          <label>محتوا</label>
          <RichTextEditor
            content={content}
            onChange={(val) => {
              setContent(val);
              setValue("content", val);
            }}
          />
        </div>

        <div>
          <label>تصویر شاخص</label>
          <Input
            type="file"
            accept="image/*"
            {...register("thumbnail")}
            className="mt-2"
          />
          {errors.thumbnail && (
            <p className="text-sm text-red-500 mt-1">
              {errors.thumbnail.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 py-6">
          <Link
            href="/dashboard/posts"
            className="bg-white border px-4 py-2 rounded-md text-sm hover:bg-gray-100 dark:bg-gray-800"
          >
            بازگشت
          </Link>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            {isPending ? "در حال ثبت..." : "افزودن مطلب"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
