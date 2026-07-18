import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function runRestore(path: string, data: any) {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message ?? "خطا در بازگردانی");
  }
  return json;
}

export function useRestoreDoctors() {
  return useMutation({
    mutationKey: ["restoreDoctors"],
    mutationFn: (data: any) => runRestore("/api/restore/doctors", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestoreDoctorResumes() {
  return useMutation({
    mutationKey: ["restoreDoctorResumes"],
    mutationFn: (data: any) => runRestore("/api/restore/doctor-resumes", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestoreClients() {
  return useMutation({
    mutationKey: ["restoreClients"],
    mutationFn: (data: any) => runRestore("/api/restore/clients", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestoreAdmins() {
  return useMutation({
    mutationKey: ["restoreAdmins"],
    mutationFn: (data: any) => runRestore("/api/restore/admins", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestorePosts() {
  return useMutation({
    mutationKey: ["restorePosts"],
    mutationFn: (data: any) => runRestore("/api/restore/posts", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestoreCategories() {
  return useMutation({
    mutationKey: ["restoreCategories"],
    mutationFn: (data: any) => runRestore("/api/restore/categories", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestoreTags() {
  return useMutation({
    mutationKey: ["restoreTags"],
    mutationFn: (data: any) => runRestore("/api/restore/tags", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestoreWorkshops() {
  return useMutation({
    mutationKey: ["restoreWorkshops"],
    mutationFn: (data: any) => runRestore("/api/restore/workshops", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}

export function useRestoreAbout() {
  return useMutation({
    mutationKey: ["restoreAbout"],
    mutationFn: (data: any) => runRestore("/api/restore/about", data),
    onError: (error) => toast.error(`${error.message}`),
    onSuccess: () => toast.success("بازگردانی انجام شد."),
  });
}
