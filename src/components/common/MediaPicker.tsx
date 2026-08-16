"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Upload, FolderOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMediaList,
  useUploadMedia,
} from "@/hooks/useMedia";
import type { MediaItem } from "@/lib/media";
import { cn } from "@/lib/utils";

type MediaPickerProps = {
  collection: string;
  valueId?: string | null;
  previewUrl?: string | null;
  onChange: (media: MediaItem | null) => void;
  label?: string;
  accept?: string;
  disabled?: boolean;
};

export default function MediaPicker({
  collection,
  valueId,
  previewUrl,
  onChange,
  label = "انتخاب فایل",
  accept = "image/*",
  disabled = false,
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { data, isLoading } = useMediaList({
    page: 1,
    perPage: 24,
    search,
    collection,
    mime: accept.startsWith("image") ? "image" : undefined,
  });
  const upload = useUploadMedia();

  const items = data?.data ?? [];
  const displayUrl = localPreview || previewUrl;

  const fileHint = useMemo(() => {
    if (!file) return "یک فایل انتخاب کنید یا اینجا رها کنید";
    return file.name;
  }, [file]);

  const handleFile = (next: File | null) => {
    setFile(next);
    setCustomName(next ? next.name.replace(/\.[^.]+$/, "") : "");
    setLocalPreview(next && next.type.startsWith("image/") ? URL.createObjectURL(next) : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const media = await upload.mutateAsync({
      file,
      collection,
      name: customName || undefined,
    });
    onChange(media);
    setOpen(false);
    handleFile(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-blue-500 bg-gray-50 text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900"
        >
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs">
              <ImagePlus className="size-6" />
              {label}
            </span>
          )}
        </button>
        <div className="space-y-2">
          <Button type="button" variant="outline" disabled={disabled} onClick={() => setOpen(true)}>
            انتخاب از گالری یا آپلود
          </Button>
          {valueId || previewUrl ? (
            <Button
              type="button"
              variant="ghost"
              className="text-rose-500"
              disabled={disabled}
              onClick={() => {
                onChange(null);
                setLocalPreview(null);
              }}
            >
              حذف انتخاب
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>کتابخانه رسانه</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="upload">
            <TabsList className="w-full">
              <TabsTrigger value="upload" className="flex-1">
                آپلود جدید
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex-1">
                انتخاب از گالری
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4 pt-4">
              <label
                className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/40 p-6 text-sm text-blue-700 dark:bg-blue-950/20"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFile(event.dataTransfer.files?.[0] ?? null);
                }}
              >
                <Upload className="mb-2 size-8" />
                {fileHint}
                <input
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
                />
              </label>
              {file ? (
                <>
                  <div>
                    <label className="text-sm">نام فایل</label>
                    <Input
                      value={customName}
                      onChange={(event) => setCustomName(event.target.value)}
                      className="mt-2 bg-white"
                    />
                  </div>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={upload.isPending}
                    onClick={handleUpload}
                  >
                    {upload.isPending ? "در حال آپلود..." : "آپلود و انتخاب"}
                  </Button>
                </>
              ) : null}
            </TabsContent>
            <TabsContent value="gallery" className="space-y-4 pt-4">
              <Input
                placeholder="جستجوی فایل..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="bg-white"
              />
              {isLoading ? (
                <p className="py-10 text-center text-sm text-gray-500">در حال بارگذاری...</p>
              ) : items.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">فایلی در این مجموعه نیست.</p>
              ) : (
                <div className="grid max-h-[22rem] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                  {items.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        onChange(item);
                        setLocalPreview(item.url);
                        setOpen(false);
                      }}
                      className={cn(
                        "overflow-hidden rounded-lg border bg-white text-right transition hover:ring-2 hover:ring-blue-500 dark:bg-gray-900",
                        valueId === item.id && "ring-2 ring-blue-600"
                      )}
                    >
                      {item.is_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt={item.name} className="h-24 w-full object-cover" />
                      ) : (
                        <div className="flex h-24 items-center justify-center bg-gray-100">
                          <FolderOpen className="size-6 text-gray-500" />
                        </div>
                      )}
                      <p className="truncate px-2 py-1 text-xs">{item.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          <button
            type="button"
            className="absolute top-4 left-4 text-gray-400"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
