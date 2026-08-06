"use client";

import { Toaster } from "react-hot-toast";
import { AccountingNavProvider } from "./AccountingNavContext";
import AccountingSidebar from "./AccountingSidebar";

export default function AccountingLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountingNavProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors print:bg-white print:min-h-0">
        <div className="print-hidden">
          <Toaster position="top-center" />
        </div>
        <AccountingSidebar />
        <div className="min-h-screen lg:mr-64 print:mr-0 print:min-h-0">
          <main className="min-h-screen print:min-h-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </AccountingNavProvider>
  );
}
