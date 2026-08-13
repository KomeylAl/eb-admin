"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/common/dropdown/NotificationDropdown";
import UserDropdown from "@/components/common/dropdown/UserDropdown";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/context/SidebarContext";
import { Menu, PanelRightClose, PanelRightOpen, X } from "lucide-react";

interface HeaderProps {
  title?: string;
  isShowSearch: boolean;
  searchFn: (e: any) => void;
  className?: string;
}

const Header = ({ isShowSearch, searchFn, className }: HeaderProps) => {
  const { isMobileOpen, isExpanded, toggleSidebar, toggleMobileSidebar } =
    useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <div
      className={`${className} w-full h-20 p-6 border-b border-gray-300 flex items-center justify-between bg-white dark:bg-gray-900 dark:border-gray-700`}
    >
      <div className="w-full flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >
          {isMobileOpen ? (
            <X className="size-5 lg:hidden" />
          ) : (
            <Menu className="size-5 lg:hidden" />
          )}
          <span className="hidden lg:inline-flex">
            {isExpanded ? (
              <PanelRightClose className="size-5" />
            ) : (
              <PanelRightOpen className="size-5" />
            )}
          </span>
        </button>
        <Input
          type="text"
          disabled={!isShowSearch}
          placeholder="جستجو"
          className="max-w-96 focus:ring-transparent"
          onChange={searchFn}
        />
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggleButton />
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Header;
