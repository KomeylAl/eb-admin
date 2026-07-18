"use client";

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { useAllDoctors, useReorderDoctors } from "@/hooks/useDoctors";

interface DoctorReorderModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function DoctorReorderModal({
  onClose,
  onSaved,
}: DoctorReorderModalProps) {
  const { data, isLoading, error, isFetching } = useAllDoctors(true);
  const { mutate: reorder, isPending } = useReorderDoctors(() => {
    onSaved();
    onClose();
  });

  const [items, setItems] = useState<any[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

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

  const handleSave = () => {
    reorder(items.map((d) => String(d.id)));
  };

  return (
    <div className="w-full p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold">تغییر ترتیب نمایش متخصصین</h2>
        <p className="text-sm text-muted-foreground mt-1">
          آیتم‌ها را با درگ و دراپ جابه‌جا کنید، سپس ذخیره را بزنید.
        </p>
      </div>

      {(isLoading || isFetching) && (
        <div className="flex justify-center py-10">
          <PuffLoader size={48} color="#3e86fa" />
        </div>
      )}

      {error && (
        <p className="text-center text-rose-500 py-6">
          خطا در دریافت لیست متخصصین
        </p>
      )}

      {!isLoading && !error && (
        <ul className="max-h-[55vh] overflow-y-auto space-y-2 rounded-md border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/40">
          {items.length === 0 && (
            <li className="text-center text-sm text-muted-foreground py-8">
              متخصصی یافت نشد
            </li>
          )}
          {items.map((doctor, index) => (
            <li
              key={doctor.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(index);
              }}
              onDragLeave={() => setOverIndex((prev) => (prev === index ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(index);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`flex items-center gap-3 rounded-md bg-white dark:bg-gray-800 px-3 py-3 cursor-grab active:cursor-grabbing border transition-colors ${
                dragIndex === index
                  ? "opacity-50 border-blue-400"
                  : overIndex === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                    : "border-transparent shadow-sm"
              }`}
            >
              <GripVertical className="size-5 shrink-0 text-gray-400" />
              <span className="w-7 shrink-0 text-sm text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{doctor.name}</p>
                <p className="text-xs text-muted-foreground truncate" dir="ltr">
                  {doctor.phone}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          انصراف
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending || items.length === 0 || isLoading}
        >
          {isPending ? "در حال ذخیره..." : "ذخیره ترتیب"}
        </Button>
      </div>
    </div>
  );
}
