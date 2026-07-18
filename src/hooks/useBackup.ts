import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function runBackup(path: string, downloadName: string) {
  const res = await fetch(path, { cache: "no-store" });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? "خطا در تهیه کپی پشتیبان");
  }
  const url = json?.url ?? json?.data?.url ?? json?.backup?.file_url;
  if (!url) {
    throw new Error("آدرس فایل پشتیبان در پاسخ یافت نشد");
  }
  const link = document.createElement("a");
  link.href = url;
  link.download = downloadName;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
  return json;
}

export function useBackupDoctors() {
  return useMutation({
    mutationKey: ["backupDoctors"],
    mutationFn: () => runBackup("/api/backup/doctors", "doctors_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupDoctorResumes() {
  return useMutation({
    mutationKey: ["backupDoctorResumes"],
    mutationFn: () =>
      runBackup("/api/backup/doctor-resumes", "doctor_resumes_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupClients() {
  return useMutation({
    mutationKey: ["backupClients"],
    mutationFn: () => runBackup("/api/backup/clients", "clients_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupAdmins() {
  return useMutation({
    mutationKey: ["backupAdmins"],
    mutationFn: () => runBackup("/api/backup/admins", "admins_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupPosts() {
  return useMutation({
    mutationKey: ["backupPosts"],
    mutationFn: () => runBackup("/api/backup/posts", "posts_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupCategoties() {
  return useMutation({
    mutationKey: ["backupCategories"],
    mutationFn: () =>
      runBackup("/api/backup/categories", "categories_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupTags() {
  return useMutation({
    mutationKey: ["backupTags"],
    mutationFn: () => runBackup("/api/backup/tags", "tags_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupWorkshops() {
  return useMutation({
    mutationKey: ["backupWorkshops"],
    mutationFn: () =>
      runBackup("/api/backup/workshops", "workshops_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}

export function useBackupAbout() {
  return useMutation({
    mutationKey: ["backupAbout"],
    mutationFn: () => runBackup("/api/backup/about", "about_backup.json"),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("پشتیبان گیری انجام شد."),
  });
}
