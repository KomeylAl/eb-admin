import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useClients(
  page: number = 0,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["clients", page, pageSize, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/clients?page=${page}&pageSize=${pageSize}&search=${search}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useClient(clientId: string = "") {
  return useQuery({
    queryKey: ["client"],
    queryFn: async () => {
      const res = await fetch(`/api/clients/${clientId}`);
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useSaveClientRecord(onSuccess: () => void) {
  return useMutation({
    mutationFn: async ({
      formData,
      clientId,
    }: {
      formData: any;
      clientId: string;
    }) => {
      const res = await fetch(`/api/clients/${clientId}/record`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(`${error?.message ?? "خطا در ذخیره پرونده"}`);
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("پرونده با موفقیت ذخیره شد");
      onSuccess();
    },
  });
}

export function useDeleteClient(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (clientId: string) => {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("مشکلی در حذف مراجع پیش آمده!");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("مراجع با موفقیت حذف شد");
      onSuccess();
    },
  });
}

export function useStoreClient(onClientStored: () => void) {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/clients/`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          `${error?.message ?? "مشکلی در افزودن مراجع پیش آمده!"}`
        );
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("مراجع با موفقت افزودن شد");
      onClientStored();
    },
  });
}

export function useUpdateClient(onClientUpdated: () => void) {
  return useMutation({
    mutationFn: async ({ data, clientId }: { data: any; clientId: string }) => {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          `${error?.message ?? "مشکلی در ویرایش مراجع پیش آمده!"}`
        );
      }
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("مراجع با موفقت ویرایش شد");
      onClientUpdated();
    },
  });
}
