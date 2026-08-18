"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/custom/Combobox";
import {
  useAddWorkshopMaterial,
  useDeleteWorkshopMaterial,
  useUpdateWorkshopMaterial,
  useWorkshopMaterials,
} from "@/hooks/useWorkshops";
import { PuffLoader } from "react-spinners";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";

const typeOptions = [
  { value: "file", label: "فایل" },
  { value: "link", label: "لینک" },
];

const WorkshopMaterialsPanel = ({ workshopId }: { workshopId: string }) => {
  const { data, isLoading, refetch } = useWorkshopMaterials(workshopId);
  const materials = data?.data ?? [];

  const [title, setTitle] = useState("");
  const [type, setType] = useState("file");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState("");

  const resetForm = () => {
    setTitle("");
    setType("file");
    setDescription("");
    setLink("");
    setFile(null);
    setEditingId(null);
  };

  const { mutate: addMaterial, isPending: adding } = useAddWorkshopMaterial(
    workshopId,
    () => {
      resetForm();
      refetch();
    }
  );
  const { mutate: updateMaterial, isPending: updating } =
    useUpdateWorkshopMaterial(workshopId, () => {
      resetForm();
      refetch();
    });
  const { mutate: deleteMaterial, isPending: deleting } =
    useDeleteWorkshopMaterial(workshopId, () => {
      closeDelete();
      refetch();
    });

  const {
    isOpen: deleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    if (description) formData.append("description", description);
    if (type === "link" && link) formData.append("link", link);
    if (type === "file" && file) formData.append("file", file);

    if (editingId) {
      updateMaterial({ materialId: editingId, formData });
    } else {
      addMaterial(formData);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setType(item.type || "file");
    setDescription(item.description || "");
    setLink(item.link || "");
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-4">
        <h3 className="font-semibold">
          {editingId ? "ویرایش منبع" : "افزودن منبع"}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>نوع</Label>
            <Combobox
              data={typeOptions}
              placeholder="نوع"
              searchPlaceholder="جستجو..."
              value={type}
              onChange={(v) => setType(String(v))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>توضیح</Label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {type === "link" ? (
          <div className="space-y-2">
            <Label>لینک</Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label>فایل (pdf, pptx, docx, zip, تصویر…)</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        )}
        <div className="flex gap-2">
          <Button
            disabled={adding || updating || !title || (type === "link" ? !link : !editingId && !file)}
            onClick={onSubmit}
          >
            {editingId
              ? updating
                ? "در حال ذخیره..."
                : "ذخیره تغییرات"
              : adding
                ? "در حال ثبت..."
                : "افزودن منبع"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>
              انصراف
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">منابع ثبت‌شده</h3>
        {isLoading && <PuffLoader size={40} color="#3e86fa" />}
        {!isLoading && materials.length === 0 && (
          <p className="text-sm text-muted-foreground">
            هنوز منبعی ثبت نشده است. این فایل‌ها فقط برای شرکت‌کنندگان تأییدشده
            قابل مشاهده خواهند بود.
          </p>
        )}
        {materials.map((item: any) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 dark:bg-gray-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                نوع: {item.type === "link" ? "لینک" : "فایل"}
                {item.original_name ? ` · ${item.original_name}` : ""}
              </p>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {item.description}
                </p>
              )}
              {item.type === "link" && item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  باز کردن لینک
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {item.type === "file" && item.has_file && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`/api/workshops/${workshopId}/materials/${item.id}/download`}
                  >
                    دانلود
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                ویرایش
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setDeleteId(item.id);
                  openDelete();
                }}
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteMaterial(deleteId)}
          isDeleting={deleting}
          onCancel={closeDelete}
          description="این منبع برای شرکت‌کنندگان تأییدشده دیگر قابل دسترسی نخواهد بود."
        />
      </Modal>
    </div>
  );
};

export default WorkshopMaterialsPanel;
