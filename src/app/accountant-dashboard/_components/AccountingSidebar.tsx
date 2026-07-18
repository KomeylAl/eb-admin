"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  CalendarDays,
  FileText,
  FilePlus,
  Percent,
  BarChart3,
  History,
  Download,
  LogOut,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    section: "بررسی اجمالی",
    items: [
      { name: "داشبورد", icon: LayoutDashboard, page: "/accountant-dashboard" },
    ],
  },
  {
    section: "عملیات مالی",
    items: [
      { name: "پرداخت‌ها", icon: CreditCard, page: "/accountant-dashboard/payments" },
      {
        name: "درآمد نوبت‌ها",
        icon: CalendarDays,
        page: "/accountant-dashboard/appointments-revenue",
      },
      {
        name: "صورتحساب‌ها",
        icon: FileText,
        page: "/accountant-dashboard/invoices",
      },
      {
        name: "صورتحساب‌های دستی",
        icon: FilePlus,
        page: "/accountant-dashboard/manual-invoices",
      },
      {
        name: "تخفیف‌ها و تعدیلات",
        icon: Percent,
        page: "/accountant-dashboard/discounts-adjustments",
      },
    ],
  },
  {
    section: "تحلیل‌ها و لاگ‌ها",
    items: [
      {
        name: "گزارش‌های مالی",
        icon: BarChart3,
        page: "/accountant-dashboard/financial-reports",
      },
      {
        name: "لاگ تراکنش‌ها",
        icon: History,
        page: "/accountant-dashboard/transactions-log",
      },
      {
        name: "خروجی / چاپ",
        icon: Download,
        page: "/accountant-dashboard/export-print",
      },
    ],
  },
];

export default function AccountingSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight">
              کلینیک ابراز
            </h1>
            <p className="text-xs text-slate-400">بخش حسابداری</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {menuItems.map((section, idx) => (
          <div key={section.section} className={cn(idx > 0 && "mt-8")}>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium px-3 mb-3">
              {section.section}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.page;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.page}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4",
                          isActive && "text-emerald-400"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          خروج
        </button>
      </div>
    </aside>
  );
}
