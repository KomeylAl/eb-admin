"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { PuffLoader } from "react-spinners";
import Header from "@/components/layout/Header";
import MediaPicker from "@/components/common/MediaPicker";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useCreateHeroSlide,
  useDeleteHeroSlide,
  useHero,
  useHeroSlides,
  useReorderHeroSlides,
  useUpdateHeroSettings,
  useUpdateHeroSlide,
  type HeroSlideForm,
} from "@/hooks/useHero";
import { cn } from "@/lib/utils";

const settingsSchema = yup.object({
  autoplay_ms: yup
    .number()
    .typeError("عدد معتبر وارد کنید")
    .min(2000, "حداقل ۲۰۰۰ میلی‌ثانیه")
    .max(60000, "حداکثر ۶۰۰۰۰ میلی‌ثانیه")
    .required(),
  background_media_id: yup.mixed().nullable(),
});

const slideSchema = yup.object({
  title: yup.string().required("عنوان الزامی است").max(255),
  body: yup.string().nullable(),
  button_text: yup.string().nullable().max(255),
  button_link: yup.string().nullable().max(500),
  is_active: yup.boolean().default(true),
  image_media_id: yup.mixed().nullable(),
});

type SlideItem = {
  id: string;
  title: string;
  body?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export default function HeroPage() {
  const { data: heroPayload, isLoading: heroLoading } = useHero();
  const { data: slidesData, isLoading: slidesLoading } = useHeroSlides();
  const updateSettings = useUpdateHeroSettings();
  const createSlide = useCreateHeroSlide(() => setSlideModalOpen(false));
  const updateSlide = useUpdateHeroSlide(() => setSlideModalOpen(false));
  const deleteSlide = useDeleteHeroSlide();
  const reorderSlides = useReorderHeroSlides();

  const settings = heroPayload?.data?.settings ?? heroPayload?.settings;
  const [items, setItems] = useState<SlideItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [editing, setEditing] = useState<SlideItem | null>(null);
  const [slideImagePreview, setSlideImagePreview] = useState<string | null>(
    null
  );

  const settingsForm = useForm({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      autoplay_ms: 5000,
      background_media_id: null as any,
    },
  });

  const slideForm = useForm({
    resolver: yupResolver(slideSchema),
    defaultValues: {
      title: "",
      body: "",
      button_text: "",
      button_link: "",
      is_active: true,
      image_media_id: null as any,
    },
  });

  useEffect(() => {
    if (settings) {
      settingsForm.reset({
        autoplay_ms: settings.autoplay_ms ?? 5000,
        background_media_id: null,
      });
      setBgPreview(settings.background_url || null);
    }
  }, [settings, settingsForm]);

  useEffect(() => {
    if (slidesData) setItems(slidesData);
  }, [slidesData]);

  const openCreate = () => {
    setEditing(null);
    slideForm.reset({
      title: "",
      body: "",
      button_text: "",
      button_link: "",
      is_active: true,
      image_media_id: null,
    });
    setSlideImagePreview(null);
    setSlideModalOpen(true);
  };

  const openEdit = (slide: SlideItem) => {
    setEditing(slide);
    slideForm.reset({
      title: slide.title || "",
      body: slide.body || "",
      button_text: slide.button_text || "",
      button_link: slide.button_link || "",
      is_active: slide.is_active !== false,
      image_media_id: null,
    });
    setSlideImagePreview(slide.image_url || null);
    setSlideModalOpen(true);
  };

  const onSaveSettings = settingsForm.handleSubmit((values) => {
    updateSettings.mutate({
      autoplay_ms: Number(values.autoplay_ms),
      background_media_id: values.background_media_id as any,
    });
  });

  const onSaveSlide = slideForm.handleSubmit((values) => {
    const form: HeroSlideForm = {
      title: values.title,
      body: values.body || "",
      button_text: values.button_text || "",
      button_link: values.button_link || "",
      is_active: values.is_active !== false,
      image_media_id: values.image_media_id as any,
    };

    if (editing) {
      updateSlide.mutate({ id: editing.id, form });
    } else {
      createSlide.mutate(form);
    }
  });

  const moveItem = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleDrop = (toIndex: number) => {
    if (dragIndex === null) return;
    moveItem(dragIndex, toIndex);
    setDragIndex(null);
    setOverIndex(null);
  };

  const loading = heroLoading || slidesLoading;

  return (
    <div className="flex h-screen flex-1 flex-col overflow-y-auto">
      <Header searchFn={() => {}} isShowSearch={false} />

      <div className="flex w-full flex-col gap-8 p-4 sm:p-6 md:p-8">
        <div>
          <h1 className="text-xl font-semibold">مدیریت هیرو صفحه اصلی</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تصویر زمینه، اسلایدها و ترتیب نمایش آن‌ها را از اینجا مدیریت کنید.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={48} color="#3e86fa" />
          </div>
        )}

        {!loading && (
          <>
            <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
              <h2 className="mb-4 text-lg font-semibold">تنظیمات کلی</h2>
              <form onSubmit={onSaveSettings} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>فاصله تعویض اسلاید (میلی‌ثانیه)</Label>
                    <Controller
                      name="autoplay_ms"
                      control={settingsForm.control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          className="bg-white"
                        />
                      )}
                    />
                    {settingsForm.formState.errors.autoplay_ms && (
                      <p className="text-sm text-red-500">
                        {settingsForm.formState.errors.autoplay_ms.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>تصویر زمینه اصلی</Label>
                    <Controller
                      name="background_media_id"
                      control={settingsForm.control}
                      render={({ field }) => (
                        <MediaPicker
                          collection="hero"
                          valueId={
                            typeof field.value === "string" ? field.value : null
                          }
                          previewUrl={bgPreview}
                          label="انتخاب تصویر زمینه"
                          onChange={(media) => {
                            field.onChange(media?.id ?? null);
                            setBgPreview(media?.url || null);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending
                    ? "در حال ذخیره..."
                    : "ذخیره تنظیمات"}
                </Button>
              </form>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">اسلایدها</h2>
                  <p className="text-sm text-muted-foreground">
                    با درگ‌و‌دراپ ترتیب را عوض کنید و سپس ذخیره ترتیب را بزنید.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={reorderSlides.isPending || items.length === 0}
                    onClick={() =>
                      reorderSlides.mutate(items.map((s) => String(s.id)))
                    }
                  >
                    {reorderSlides.isPending
                      ? "در حال ذخیره..."
                      : "ذخیره ترتیب"}
                  </Button>
                  <Button type="button" onClick={openCreate}>
                    <Plus className="ml-1 size-4" />
                    اسلاید جدید
                  </Button>
                </div>
              </div>

              <ul className="space-y-2">
                {items.length === 0 && (
                  <li className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                    هنوز اسلایدی ثبت نشده است.
                  </li>
                )}
                {items.map((slide, index) => (
                  <li
                    key={slide.id}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOverIndex(index);
                    }}
                    onDragLeave={() =>
                      setOverIndex((prev) => (prev === index ? null : prev))
                    }
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(index);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setOverIndex(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border bg-gray-50 px-3 py-3 transition-colors dark:bg-gray-900/40",
                      dragIndex === index && "opacity-60",
                      overIndex === index &&
                        dragIndex !== index &&
                        "border-blue-400"
                    )}
                  >
                    <GripVertical className="size-5 shrink-0 cursor-grab text-gray-400 active:cursor-grabbing" />
                    {slide.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={slide.image_url}
                        alt=""
                        className="size-14 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500 dark:bg-gray-800">
                        بدون تصویر
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{slide.title}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {slide.body || "بدون متن"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {slide.is_active === false ? "غیرفعال" : "فعال"}
                        {slide.button_text
                          ? ` · دکمه: ${slide.button_text}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(slide)}
                      >
                        <Pencil className="size-4 text-blue-500" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={deleteSlide.isPending}
                        onClick={() => {
                          if (confirm("این اسلاید حذف شود؟")) {
                            deleteSlide.mutate(slide.id);
                          }
                        }}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>

      <Modal
        isOpen={slideModalOpen}
        onClose={() => setSlideModalOpen(false)}
        className="max-w-[700px] max-h-[85vh] overflow-y-auto bg-white p-6"
      >
        <h2 className="mb-4 text-lg font-semibold">
          {editing ? "ویرایش اسلاید" : "اسلاید جدید"}
        </h2>
        <form onSubmit={onSaveSlide} className="space-y-4">
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Controller
              name="title"
              control={slideForm.control}
              render={({ field }) => <Input {...field} className="bg-white" />}
            />
            {slideForm.formState.errors.title && (
              <p className="text-sm text-red-500">
                {slideForm.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>متن</Label>
            <Controller
              name="body"
              control={slideForm.control}
              render={({ field }) => (
                <Textarea rows={4} {...field} value={field.value || ""} className="bg-white" />
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>متن دکمه</Label>
              <Controller
                name="button_text"
                control={slideForm.control}
                render={({ field }) => (
                  <Input {...field} value={field.value || ""} className="bg-white" />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>لینک دکمه</Label>
              <Controller
                name="button_link"
                control={slideForm.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="/appointment یا https://..."
                    className="bg-white"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>تصویر اسلاید (سمت راست)</Label>
            <Controller
              name="image_media_id"
              control={slideForm.control}
              render={({ field }) => (
                <MediaPicker
                  collection="hero"
                  valueId={
                    typeof field.value === "string" ? field.value : null
                  }
                  previewUrl={slideImagePreview}
                  label="انتخاب تصویر اسلاید"
                  onChange={(media) => {
                    field.onChange(media?.id ?? null);
                    setSlideImagePreview(media?.url || null);
                  }}
                />
              )}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Controller
              name="is_active"
              control={slideForm.control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value !== false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            فعال باشد
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSlideModalOpen(false)}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={createSlide.isPending || updateSlide.isPending}
            >
              {createSlide.isPending || updateSlide.isPending
                ? "در حال ذخیره..."
                : "ذخیره اسلاید"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
