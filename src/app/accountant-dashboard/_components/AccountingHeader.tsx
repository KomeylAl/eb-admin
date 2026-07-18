"use client";

import { Bell, Search, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";

export default function AccountingHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { user, logout } = useUser();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search transactions..."
            className="w-64 pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-slate-100 transition-colors">
              <Avatar className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-500">
                <AvatarFallback className="bg-transparent text-white text-xs font-medium">
                  {getInitials(user?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900">
                  {user?.full_name || "Accountant"}
                </p>
                <p className="text-xs text-slate-500">Accountant</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
