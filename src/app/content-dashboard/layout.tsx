import { Metadata } from "next";

import { Toaster } from "react-hot-toast";
import DashboardShell from "@/components/layout/DashboardShell";
import "../globals.css";

export const metadata: Metadata = {
  title: "داشبورد وب سایت - کلینیک ابراز",
  description: "داشبورد وب سایت - کلینیک ابراز",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Toaster />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
