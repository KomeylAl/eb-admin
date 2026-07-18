"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackupButton from "./BackupButton";
import toast from "react-hot-toast";

function extractRestoreRecords(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.items)) return json.data.items;
  return [];
}

export default function BackupRestoreSection({
  title,
  backupHook,
  restoreHook,
}: {
  title: string;
  backupHook: any;
  restoreHook: any;
}) {
  const { mutate: backup, isPending: isBackingUp } = backupHook();
  const { mutate: restore, isPending: isRestoring } = restoreHook();

  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const records = extractRestoreRecords(json);
      if (!records.length) {
        toast.error("فایل JSON معتبر نیست یا رکوردی ندارد.");
        setData([]);
        return;
      }
      setData(records);
    } catch {
      toast.error("خواندن فایل JSON با خطا مواجه شد.");
      setData([]);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-white dark:bg-gray-800">
      <h3 className="font-bold text-lg">{title}</h3>

      <BackupButton
        text={`تهیه پشتیبان از ${title}`}
        isLoading={isBackingUp}
        backupFn={backup}
      />

      <div className="flex items-center justify-between gap-4">
        <Input
          type="file"
          accept="application/json"
          onChange={handleFileUpload}
        />
        <Button
          disabled={!data.length || isRestoring}
          onClick={() => restore(data)}
        >
          {isRestoring ? "در حال بازگردانی..." : `بازگردانی ${title}`}
        </Button>
      </div>
    </div>
  );
}
