"use client";

import { MdClass, MdDashboard } from "react-icons/md";
import { usePathname } from "next/navigation";
import { FiList } from "react-icons/fi";
import { LuCircleHelp } from "react-icons/lu";
import { GrArticle } from "react-icons/gr";
import { LuBell } from "react-icons/lu";
import { PuffLoader } from "react-spinners";
import { useUser } from "@/context/UserContext";
import { TbCategory2 } from "react-icons/tb";
import { IoPricetagOutline } from "react-icons/io5";
import TransitionLink from "@/components/ui/TransitionLink";
import {
  Bell,
  CalendarCheck,
  CalendarFold,
  CreditCard,
  LayoutDashboard,
  List,
  Mail,
  MessageSquareText,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

const Navbar = () => {
  const links = [
    {
      title: "داشبورد",
      link: "/admin-dashboard",
      access: ["manager", "boss", "receptionist"],
      icon: <LayoutDashboard />,
    },
    {
      title: "داشبورد محتوا",
      link: "/content-dashboard",
      access: ["author"],
      icon: <MdDashboard />,
    },
    {
      title: "نوبت ها",
      link: "/admin-dashboard/appointments",
      access: ["manager", "boss", "receptionist"],
      icon: <CalendarCheck />,
    },
    {
      title: "ارزیابی ها",
      link: "/admin-dashboard/assessments",
      access: ["manager", "boss", "receptionist"],
      icon: <CalendarFold />,
    },
    {
      title: "نظرات",
      link: "/admin-dashboard/comments",
      access: ["manager", "boss"],
      icon: <MessageSquareText />,
    },
    {
      title: "مراجعان",
      link: "/admin-dashboard/clients",
      access: ["manager", "boss", "receptionist"],
      icon: <List />,
    },
    {
      title: "متخصصین",
      link: "/admin-dashboard/doctors",
      access: ["manager", "boss"],
      icon: <UserRound />,
    },
    {
      title: "پرداخت ها",
      link: "/admin-dashboard/payments",
      access: ["manager", "boss", "accountant"],
      icon: <CreditCard />,
    },
    {
      title: "اعلانات",
      link: "/admin-dashboard/notifications",
      access: ["manager", "boss", "receptionist", "accountant"],
      icon: <Bell />,
    },
    {
      title: "پنل پیامک",
      link: "/admin-dashboard/sms-panel",
      access: ["manager", "boss"],
      icon: <Mail />,
    },
    {
      title: "مدیران سایت",
      link: "/admin-dashboard/admins",
      access: ["boss"],
      icon: <Users />,
    },
    {
      title: "دپارتمان ها",
      link: "/content-dashboard/departments",
      access: ["author"],
      icon: <FiList />,
    },
    {
      title: "پست ها",
      link: "/content-dashboard/posts",
      access: ["author"],
      icon: <GrArticle />,
    },
    {
      title: "دسته بندی ها",
      link: "/content-dashboard/categories",
      access: ["author"],
      icon: <TbCategory2 />,
    },
    {
      title: "برچسب ها",
      link: "/content-dashboard/tags",
      access: ["author"],
      icon: <IoPricetagOutline />,
    },
    {
      title: "کلاس ها و کارگاه ها",
      link: "/content-dashboard/workshops",
      access: ["author"],
      icon: <MdClass />,
    },
    {
      title: "نظرات",
      link: "/content-dashboard/comments",
      access: ["author"],
      icon: <MessageSquareText />,
    },
    {
      title: "اعلانات",
      link: "/content-dashboard/notifications",
      access: ["author"],
      icon: <LuBell />,
    },
    {
      title: "درباره",
      link: "/content-dashboard/about",
      access: ["author"],
      icon: <LuCircleHelp />,
    },
    {
      title: "تنظیمات",
      link: "/admin-dashboard/settings",
      access: ["boss", "manager"],
      icon: <Settings />,
    },
  ];

  const pathName = usePathname();
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4 w-full">
      {!user && (
        <div className="w-full h-full flex items-center justify-center">
          <PuffLoader color="#3b82f6" size={45} />
        </div>
      )}

      {user &&
        links.map(
          (link) =>
            link.access.includes(user.admin_role ?? user.role) && (
              <TransitionLink
                key={link.link}
                href={link.link}
                className={`flex items-center gap-2 text-lg w-full px-4 py-2 ${
                  pathName === link.link
                    ? "bg-blue-100 dark:bg-blue-950 text-blue-600 font-semibold rounded-sm"
                    : "bg-transparent"
                }`}
              >
                {link.icon} {link.title}
              </TransitionLink>
            )
        )}
    </div>
  );
};

export default Navbar;
