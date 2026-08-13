import { Metadata } from "next";

import { Toaster } from "react-hot-toast";
import DashboardShell from "@/components/layout/DashboardShell";
import "../globals.css";

export const metadata: Metadata = {
  title: "پنل مدیریت - کلینیک ابراز",
  description: "پنل مدیریت - کلینیک ابراز",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Toaster toastOptions={{ className: "z-[10000]" }} />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
