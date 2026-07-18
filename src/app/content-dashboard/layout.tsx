import { Metadata } from "next";

import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/layout/SideBar";
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
      <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        <main className="flex-1 lg:mr-80 overflow-y-auto h-screen">
          {children}
        </main>

        <Toaster />
      </div>
    </div>
  );
}
