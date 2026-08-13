"use client";

import { animatePageOut } from "@/lib/animation";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

const TransitionLink = ({
  href,
  children,
  className = "",
  title,
  onClick,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    if (pathname === href) return;

    await animatePageOut();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} title={title}>
      {children}
    </a>
  );
};

export default TransitionLink;
