"use client";

import { Bell, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

export default function AccountingHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useUser();

  const displayName = user?.full_name || user?.name || "حسابدار";

  const getInitials = (name: string) => {
    if (!name) return "ح";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

  return (
    <header className="accounting-header h-16 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 transition-colors print-hidden">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggleButton
          className="relative flex items-center justify-center text-slate-500 transition-colors bg-white border border-slate-200 rounded-xl h-10 w-10 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        />

        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="اعلان‌ها"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 p-1.5 pl-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Avatar className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-500">
                <AvatarFallback className="bg-transparent text-white text-xs font-medium">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  حسابدار
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="w-4 h-4 ml-2" />
              پروفایل
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>خروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
