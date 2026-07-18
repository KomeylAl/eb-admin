import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user");
      if (res.status !== 200) {
        toast.error("خطا در احراز هویت. لطفا مجددا وارد شوید.");
      }
      return res.json();
    },
  });
}
