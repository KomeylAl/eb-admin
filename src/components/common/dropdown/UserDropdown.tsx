"use client";

import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import { IoExit, IoKeyOutline, IoPersonOutline } from "react-icons/io5";
import { Dropdown } from "./Dropdown";
import { convertRole } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChangePasswordForm from "@/app/admin-dashboard/_components/forms/ChangePasswordForm";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { user, logout } = useUser();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const userName = () => {
    let name: string = "";
    if (!user) {
      name = "name";
    } else {
      if (user.name) name = user.name;
    }
    return name;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-12 h-12 dropdown-toggle relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <IoPersonOutline className="" size={18} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute left-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark shadow-lg"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {userName()}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user && convertRole(user.admin_role ?? user.role)}
          </span>
        </div>

        <div className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => {
              closeDropdown();
              setIsPasswordDialogOpen(true);
            }}
            className="flex items-center gap-2 rounded-md p-2 text-gray-700 transition duration-300 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <IoKeyOutline size={20} /> تغییر رمز عبور
          </button>
        </div>
        <button
          onClick={logout}
          className="text-rose-500 flex items-center gap-2 p-2 mt-2 hover:bg-gray-100 rounded-md transition duration-300"
        >
          <IoExit size={20} /> خروج
        </button>
      </Dropdown>

      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-right">
            <DialogTitle>تغییر رمز عبور</DialogTitle>
            <DialogDescription>
              برای امنیت حساب، ابتدا کد تأیید پیامکی دریافت کنید.
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            compact
            onSuccess={() => setIsPasswordDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
