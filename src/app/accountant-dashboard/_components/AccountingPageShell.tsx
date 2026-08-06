"use client";

import AccountingHeader from "./AccountingHeader";

export default function AccountingPageShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col print:min-h-0 print:block">
      <AccountingHeader title={title} subtitle={subtitle} />
      <div className="flex-1 p-6 md:p-8 space-y-6 print:flex-none print:p-0 print:m-0 print:space-y-0">
        {actions && (
          <div className="flex flex-wrap items-center justify-between gap-3 print-hidden">
            {actions}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
