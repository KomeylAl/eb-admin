"use client";

import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import logo from "../../../public/images/logo.png";
import logoW from "../../../public/images/logo-w.png";
import { animatePageIn } from "@/lib/animation";
import { useTheme } from "@/context/ThemeContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    animatePageIn();
  }, [pathname, theme]);
  return (
    <div className="">
      <div
        id="banner"
        className="min-h-screen bg-white/60 dark:bg-gray-900/60 z-30 fixed top-0 w-full backdrop-blur-xl flex items-center justify-center opacity-0"
      >
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
          <Image
            src={theme === "light" ? logo : logoW}
            alt="Logo"
            width={100}
            height={300}
            className=""
          />
          <p className="text-lg">در حال بارگزاری...</p>
        </div>
      </div>
      {children}
    </div>
  );
}
