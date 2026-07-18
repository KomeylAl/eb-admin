import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function usePayments(
  page: number = 0,
  pageSize: number = 10,
  search: string = "",
  clientId: string = ""
) {
  return useQuery({
    queryKey: ["payments", page, pageSize, search, clientId],
    queryFn: async () => {
      const res = await fetch(
        `/api/payments?page=${page}&size=${pageSize}&search=${search}&clientId=${clientId}`
      );
      if (res.status !== 200) {
        toast.error("خطا در دریافت اطلاعات");
      }
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}
