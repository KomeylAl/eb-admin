"use client";

import { useLayoutEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Building2,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  CreditCard,
  DoorOpen,
  FileText,
  FolderHeart,
  GraduationCap,
  Images,
  Info,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  Mail,
  MessageSquareText,
  PanelsTopLeft,
  Settings,
  Stethoscope,
  Tag,
  UserRound,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { useUser } from "@/context/UserContext";
import { useSidebar } from "@/context/SidebarContext";
import TransitionLink from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";

type NavLink = {
  title: string;
  link: string;
  access: string[];
  icon: LucideIcon;
};

type NavSection = {
  id: string;
  title: string;
  items: NavLink[];
};

const sections: NavSection[] = [
  {
    id: "general",
    title: "عمومی",
    items: [
      {
        title: "داشبورد",
        link: "/admin-dashboard",
        access: ["manager", "boss", "receptionist"],
        icon: LayoutDashboard,
      },
      {
        title: "داشبورد محتوا",
        link: "/content-dashboard",
        access: ["author"],
        icon: LayoutTemplate,
      },
      {
        title: "اعلانات",
        link: "/admin-dashboard/notifications",
        access: ["manager", "boss", "receptionist", "accountant"],
        icon: Bell,
      },
      {
        title: "اعلانات",
        link: "/content-dashboard/notifications",
        access: ["author"],
        icon: Bell,
      },
    ],
  },
  {
    id: "scheduling",
    title: "نوبت‌دهی",
    items: [
      {
        title: "نوبت ها",
        link: "/admin-dashboard/appointments",
        access: ["manager", "boss", "receptionist"],
        icon: CalendarCheck,
      },
      {
        title: "اتاق‌ها",
        link: "/admin-dashboard/rooms",
        access: ["manager", "boss", "receptionist"],
        icon: DoorOpen,
      },
      {
        title: "ارزیابی ها",
        link: "/admin-dashboard/assessments",
        access: ["manager", "boss", "receptionist"],
        icon: ClipboardList,
      },
    ],
  },
  {
    id: "clinical",
    title: "درمان و مراجعان",
    items: [
      {
        title: "برنامه‌های درمان",
        link: "/admin-dashboard/treatment-programs",
        access: ["manager", "boss", "receptionist"],
        icon: FolderHeart,
      },
      {
        title: "مراجعان",
        link: "/admin-dashboard/clients",
        access: ["manager", "boss", "receptionist"],
        icon: Users,
      },
      {
        title: "متخصصین",
        link: "/admin-dashboard/doctors",
        access: ["manager", "boss"],
        icon: Stethoscope,
      },
      {
        title: "نظرات",
        link: "/admin-dashboard/comments",
        access: ["manager", "boss"],
        icon: MessageSquareText,
      },
    ],
  },
  {
    id: "finance",
    title: "مالی",
    items: [
      {
        title: "پرداخت ها",
        link: "/admin-dashboard/payments",
        access: ["manager", "boss", "accountant"],
        icon: CreditCard,
      },
    ],
  },
  {
    id: "content",
    title: "محتوا",
    items: [
      {
        title: "دپارتمان ها",
        link: "/content-dashboard/departments",
        access: ["author"],
        icon: Building2,
      },
      {
        title: "پست ها",
        link: "/content-dashboard/posts",
        access: ["author"],
        icon: FileText,
      },
      {
        title: "دسته بندی ها",
        link: "/content-dashboard/categories",
        access: ["author"],
        icon: LayoutGrid,
      },
      {
        title: "برچسب ها",
        link: "/content-dashboard/tags",
        access: ["author"],
        icon: Tag,
      },
      {
        title: "کلاس ها و کارگاه ها",
        link: "/content-dashboard/workshops",
        access: ["author"],
        icon: GraduationCap,
      },
      {
        title: "نظرات",
        link: "/content-dashboard/comments",
        access: ["author"],
        icon: MessageSquareText,
      },
      {
        title: "هیرو صفحه اصلی",
        link: "/content-dashboard/hero",
        access: ["author"],
        icon: PanelsTopLeft,
      },
      {
        title: "درباره",
        link: "/content-dashboard/about",
        access: ["author"],
        icon: Info,
      },
      {
        title: "رسانه و فایل‌ها",
        link: "/content-dashboard/media",
        access: ["author"],
        icon: Images,
      },
    ],
  },
  {
    id: "communications",
    title: "ارتباطات",
    items: [
      {
        title: "پنل پیامک",
        link: "/admin-dashboard/sms-panel",
        access: ["manager", "boss"],
        icon: Mail,
      },
    ],
  },
  {
    id: "system",
    title: "سیستم",
    items: [
      {
        title: "رسانه و فایل‌ها",
        link: "/admin-dashboard/media",
        access: ["manager", "boss"],
        icon: Images,
      },
      {
        title: "مدیران سایت",
        link: "/admin-dashboard/admins",
        access: ["boss"],
        icon: UserRound,
      },
      {
        title: "تنظیمات",
        link: "/admin-dashboard/settings",
        access: ["boss", "manager"],
        icon: Settings,
      },
    ],
  },
];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();
  const {
    isExpanded,
    isMobileOpen,
    closeMobileSidebar,
    openSections,
    toggleSection,
    openSection,
  } = useSidebar();
  const showLabels = isExpanded || isMobileOpen;
  const role = user?.admin_role ?? user?.role;

  const isActive = (link: string) => {
    if (link === "/admin-dashboard" || link === "/content-dashboard") {
      return pathName === link;
    }
    return pathName === link || pathName.startsWith(`${link}/`);
  };

  const visibleSections = useMemo(() => {
    if (!role) return [];
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.access.includes(role)),
      }))
      .filter((section) => section.items.length > 0);
  }, [role]);

  useLayoutEffect(() => {
    visibleSections.forEach((section) => {
      if (section.items.some((item) => isActive(item.link))) {
        openSection(section.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open active section on route change
  }, [pathName, visibleSections, openSection]);

  return (
    <div className="flex w-full flex-col gap-3">
      {!user && (
        <div className="flex h-24 w-full items-center justify-center">
          <PuffLoader color="#3b82f6" size={36} />
        </div>
      )}

      {user &&
        visibleSections.map((section, sectionIndex) => {
          const isOpen = !showLabels || openSections.includes(section.id);
          const sectionHasActive = section.items.some((item) =>
            isActive(item.link)
          );

          return (
            <div key={section.id} className="flex flex-col">
              {showLabels ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "mb-1 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold tracking-wide transition-colors",
                    sectionHasActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800/60 dark:hover:text-gray-300"
                  )}
                  aria-expanded={isOpen}
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 stroke-[2] transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                sectionIndex > 0 && (
                  <div className="mx-auto mb-1.5 h-px w-6 bg-gray-200 dark:bg-gray-800" />
                )
              )}

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "flex flex-col",
                      showLabels ? "gap-1" : "gap-1.5"
                    )}
                  >
                    {section.items.map((link) => {
                      const active = isActive(link.link);
                      const Icon = link.icon;

                      return (
                        <TransitionLink
                          key={link.link}
                          href={link.link}
                          title={link.title}
                          onClick={closeMobileSidebar}
                          className={cn(
                            "group flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                            showLabels
                              ? "gap-3 px-3 py-2.5"
                              : "justify-center px-2 py-2.5",
                            active
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-100",
                            !isOpen && showLabels && "opacity-0"
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-[1.15rem] shrink-0 stroke-[1.75]",
                              active
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-100"
                            )}
                          />
                          {showLabels && (
                            <span className="truncate leading-none">
                              {link.title}
                            </span>
                          )}
                        </TransitionLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Navbar;
