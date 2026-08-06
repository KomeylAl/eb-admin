import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import AccountingSidebar from "./_components/AccountingSidebar";

export const metadata: Metadata = {
  title: "پنل حسابداری - کلینیک ابراز",
  description: "پنل حسابداری - کلینیک ابراز",
};

export default function AccountantDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors print:bg-white print:min-h-0">
      <div className="print-hidden">
        <Toaster position="top-center" />
      </div>
      <AccountingSidebar />
      <div className="mr-64 min-h-screen print:mr-0 print:min-h-0">
        <main className="min-h-screen print:min-h-0">{children}</main>
      </div>
    </div>
  );
}
