"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PanelRightClose, X } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import Navbar from "./Navbar";

export default function Sidebar() {
  const {
    isExpanded,
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();
  const showLabels = isExpanded || isMobileOpen;

  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] transition-opacity lg:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobileSidebar}
        aria-hidden={!isMobileOpen}
      />

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-dvh flex-col border-l border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950",
          "w-[min(18rem,88vw)]",
          isExpanded ? "lg:w-72" : "lg:w-20",
          isMobileOpen
            ? "translate-x-0 shadow-2xl"
            : "translate-x-full pointer-events-none lg:pointer-events-auto lg:translate-x-0 lg:shadow-none"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-gray-200 dark:border-gray-800",
            showLabels
              ? "justify-between gap-2 px-4 py-4"
              : "justify-center px-2 py-4"
          )}
        >
          {showLabels ? (
            <>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50">
                  کلینیک ابراز
                </h1>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  پنل مدیریت
                </p>
              </div>
              <button
                type="button"
                onClick={toggleMobileSidebar}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 lg:hidden dark:hover:bg-gray-800 dark:hover:text-gray-100"
                aria-label="بستن منو"
              >
                <X className="size-5" />
              </button>
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 lg:inline-flex dark:hover:bg-gray-800 dark:hover:text-gray-100"
                aria-label="جمع کردن منو"
              >
                <PanelRightClose className="size-5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white transition-opacity hover:opacity-90"
              aria-label="باز کردن منو"
            >
              ا
            </button>
          )}
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] [scrollbar-width:thin]">
          <Navbar />
        </nav>
      </aside>
    </>
  );
}
