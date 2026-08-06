"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Manual invoices merged into unified /invoices model. */
export default function ManualInvoicesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/accountant-dashboard/invoices");
  }, [router]);
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-slate-500">
      در حال انتقال به صورتحساب‌ها…
    </div>
  );
}
