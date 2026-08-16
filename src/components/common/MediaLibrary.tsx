"use client";

import { useMemo, useState } from "react";
import { FolderPlus, Images, Pencil, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateMediaFolder,
  useDeleteMedia,
  useDeleteMediaFolder,
  useMediaCollections,
  useMediaFolders,
  useMediaList,
  useUpdateMedia,
  useUploadMedia,
} from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

export default function MediaLibrary() {
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState("");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [folderName, setFolderName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const { data: collections } = useMediaCollections();
  const { data: folders } = useMediaFolders();
  const { data, isLoading } = useMediaList({
    page,
    perPage: 24,
    search,
    collection: collection || undefined,
    folderId,
  });
  const upload = useUploadMedia();
  const updateMedia = useUpdateMedia();
  const deleteMedia = useDeleteMedia();
  const createFolder = useCreateMediaFolder();
  const deleteFolder = useDeleteMediaFolder();

  const items = data?.data ?? [];
  const meta = data?.meta;
  const collectionOptions = collections ?? [];
  const folderList = folders ?? [];

  const currentFolder = useMemo(
    () => folderList.find((folder) => folder.id === folderId),
    [folderList, folderId]
  );

  return (
    <div className="flex h-full w-full flex-col">
      <Header isShowSearch={false} searchFn={() => {}} />
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">مدیریت رسانه</h2>
            <p className="mt-1 text-sm text-gray-500">
              فایل‌ها را آپلود کنید، نام بگذارید و در پوشه دسته‌بندی کنید.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            <Images className="size-4" />
            آپلود فایل
            <input
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                upload.mutate({
                  file,
                  collection: collection || "library",
                  folderId,
                });
                event.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="space-y-4 rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500">پوشه‌ها</p>
              <button
                type="button"
                onClick={() => setFolderId(null)}
                className={cn(
                  "mb-1 w-full rounded-md px-3 py-2 text-right text-sm",
                  folderId === null ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 dark:hover:bg-gray-900"
                )}
              >
                همه فایل‌ها
              </button>
              {folderList.map((folder) => (
                <div key={folder.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setFolderId(folder.id)}
                    className={cn(
                      "flex-1 rounded-md px-3 py-2 text-right text-sm",
                      folderId === folder.id
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50 dark:hover:bg-gray-900"
                    )}
                  >
                    {folder.name}
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-gray-400 hover:text-rose-500"
                    onClick={() => {
                      if (confirm("این پوشه حذف شود؟")) deleteFolder.mutate(folder.id);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="نام پوشه جدید"
                className="bg-white"
              />
              <Button
                type="button"
                size="icon"
                disabled={!folderName.trim() || createFolder.isPending}
                onClick={() => {
                  createFolder.mutate({ name: folderName.trim() });
                  setFolderName("");
                }}
              >
                <FolderPlus className="size-4" />
              </Button>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="جستجو..."
                className="max-w-xs bg-white"
              />
              <select
                value={collection}
                onChange={(event) => {
                  setCollection(event.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-md border bg-white px-3 text-sm dark:bg-gray-950"
              >
                <option value="">همه مجموعه‌ها</option>
                {collectionOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              {currentFolder ? (
                <span className="self-center text-sm text-gray-500">پوشه: {currentFolder.name}</span>
              ) : null}
            </div>

            {isLoading ? (
              <p className="py-16 text-center text-gray-500">در حال بارگذاری...</p>
            ) : items.length === 0 ? (
              <p className="py-16 text-center text-gray-500">فایلی پیدا نشد.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-950"
                  >
                    {item.is_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.name} className="h-36 w-full object-cover" />
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-gray-100 text-sm text-gray-500">
                        {item.mime || "فایل"}
                      </div>
                    )}
                    <div className="space-y-2 p-3">
                      {renamingId === item.id ? (
                        <div className="flex gap-1">
                          <Input
                            value={renameValue}
                            onChange={(event) => setRenameValue(event.target.value)}
                            className="h-8 bg-white text-xs"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              updateMedia.mutate({ id: item.id, name: renameValue });
                              setRenamingId(null);
                            }}
                          >
                            ثبت
                          </Button>
                        </div>
                      ) : (
                        <p className="truncate text-sm font-medium">{item.name}</p>
                      )}
                      <p className="truncate text-[11px] text-gray-400">{item.collection}</p>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => {
                            setRenamingId(item.id);
                            setRenameValue(item.name);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="text-rose-500"
                          onClick={() => {
                            if (confirm("این فایل حذف شود؟")) deleteMedia.mutate(item.id);
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {meta && meta.last_page > 1 ? (
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  قبلی
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((current) => current + 1)}
                >
                  بعدی
                </Button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
