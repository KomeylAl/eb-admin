"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import Sidebar from "./SideBar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded } = useSidebar();

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main
        className={cn(
          "flex-1 min-w-0 overflow-y-auto h-screen transition-[margin-right] duration-300 ease-in-out dark:bg-gray-900",
          isExpanded ? "lg:mr-72" : "lg:mr-20"
        )}
      >
        {children}
      </main>
    </div>
  );
}
