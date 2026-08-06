"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  CalendarDays,
  FileText,
  Percent,
  BarChart3,
  History,
  Download,
  LogOut,
  Building2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useAccountingNav } from "./AccountingNavContext";

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
      {
        name: "پرداخت‌ها",
        icon: CreditCard,
        page: "/accountant-dashboard/payments",
      },
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
  const { logout } = useUser();
  const { isMobileOpen, closeMobileNav } = useAccountingNav();

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  const isActive = (page: string) => {
    if (page === "/accountant-dashboard") {
      return pathname === page;
    }
    return pathname === page || pathname.startsWith(`${page}/`);
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity lg:hidden print-hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobileNav}
        aria-hidden={!isMobileOpen}
      />

      <aside
        className={cn(
          "accounting-sidebar fixed right-0 top-0 h-dvh w-[min(18rem,88vw)] bg-slate-900 dark:bg-slate-950 text-white flex flex-col z-50 border-l border-transparent dark:border-slate-800 transition-transform duration-300 ease-out print-hidden",
          "lg:translate-x-0 lg:w-64",
          isMobileOpen
            ? "translate-x-0 shadow-2xl"
            : "translate-x-full pointer-events-none lg:pointer-events-auto lg:translate-x-0 lg:shadow-none"
        )}
      >
        <div className="p-5 sm:p-6 border-b border-slate-700/50 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-lg tracking-tight truncate">
                کلینیک ابراز
              </h1>
              <p className="text-xs text-slate-400">بخش حسابداری</p>
            </div>
            <button
              type="button"
              onClick={closeMobileNav}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
              aria-label="بستن منو"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain py-5 sm:py-6 px-3">
          {menuItems.map((section, idx) => (
            <div key={section.section} className={cn(idx > 0 && "mt-7 sm:mt-8")}>
              <p className="text-[10px] tracking-wider text-slate-500 dark:text-slate-600 font-medium px-3 mb-3">
                {section.section}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.page);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.page}
                        onClick={closeMobileNav}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-800"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            active && "text-emerald-400"
                          )}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 dark:border-slate-800 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => {
              closeMobileNav();
              logout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}
