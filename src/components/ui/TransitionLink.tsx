"use client";

import { animatePageOut } from "@/lib/animation";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const TransitionLink = ({ href, children, className = "" }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === href) return;

    // مرحله اول: انیمیشن خروج
    await animatePageOut();

    // مرحله دوم: ناوبری
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default TransitionLink;
