import Link from "next/link";
import {
  convertNotifPriority,
  convertNotifStatus,
  convertNotifType,
  convertPostStatus,
  convertRole,
  dateConvert,
} from "./utils";
import { MdInsertChart } from "react-icons/md";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import TransitionLink from "@/components/ui/TransitionLink";
import ClientCard from "@/app/admin-dashboard/_components/cards/ClientCard";
import DoctorCard from "@/app/admin-dashboard/_components/cards/DoctorCard";
import NotificationCard from "@/app/admin-dashboard/_components/cards/NotificationCard";
import { PuffLoader } from "react-spinners";

export const appointmentColumns = [
  {
    header: "مراجع",
    accessor: (row: any) => (
      <div className="relative inline-block">
        <TransitionLink
          className="peer"
          href={`/admin-dashboard/clients/${row.client.id}`}
        >
          {row.client?.name}
        </TransitionLink>

        <ClientCard client={row.client} />
      </div>
    ),
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "متخصص",
    accessor: (row: any) => (
      <div className="relative inline-block">
        <TransitionLink
          className="peer"
          href={`/admin-dashboard/doctors/panel/${row.doctor.id}`}
        >
          {row.doctor?.name}
        </TransitionLink>

        <DoctorCard doctor={row.doctor} />
      </div>
    ),
    cellClassName: (row: any) => "text-cyan-500",
  },
  {
    header: "تاریخ و ساعت",
    accessor: (row: any) => row.time + " - " + dateConvert(row.date),
  },
  {
    header: "وضعیت",
    accessor: (row: any) =>
      row.status === "done" ? "انجام شده" : "انجام نشده",
    cellClassName: (row: any) =>
      row.status === "done" ? "text-blue-600" : "text-amber-500",
  },
  {
    header: "پرداخت",
    accessor: (row: any) => row.amount ?? "ندارد",
    cellClassName: (row: any) =>
      row.payment_status === "paid" ? "text-indigo-500" : "text-rose-500",
  },
];

export const adminColumns = [
  { header: "نام", accessor: "name" },
  { header: "تلفن", accessor: "phone" },
  { header: "تاریخ تولد", accessor: (row: any) => dateConvert(row.birth_date) },
  {
    header: "نقش",
    accessor: (row: any) => convertRole(row.admin_role ?? row.role),
  },
];

export const AllNotificationsColumns = [
  {
    header: "عنوان",
    accessor: (row: any) => (
      <div className="relative inline-block">
        <p className="peer">{row.title}</p>

        <NotificationCard notification={row} />
      </div>
    ),
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "اولویت",
    accessor: (row: any) => convertNotifPriority(row.priority),
    cellClassName: (row: any) =>
      `${
        row.priority === "high"
          ? "text-rose-500"
          : row.priority === "medium"
          ? "text-amber-500"
          : "text-cyan-500"
      }`,
  },
  { header: "وضعیت", accessor: (row: any) => convertNotifStatus(row.status) },
  {
    header: "نوع",
    accessor: (row: any) => convertNotifType(row.type),
  },
  {
    header: "زمان",
    accessor: (row: any) => dateConvert(row.created_at),
  },
];

export const unreadNotificationColumns = (
  isPending: boolean = false,
  loadingId: string | null = null,
  mutationFn: (notifId: string) => void
) => [
  {
    header: "عنوان",
    accessor: (row: any) => (
      <div className="relative inline-block">
        <p className="peer">{row.title}</p>

        <NotificationCard notification={row} />
      </div>
    ),
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "اولویت",
    accessor: (row: any) => convertNotifPriority(row.priority),
    cellClassName: (row: any) =>
      `${
        row.priority === "high"
          ? "text-rose-500"
          : row.priority === "medium"
          ? "text-amber-500"
          : "text-cyan-500"
      }`,
  },
  { header: "وضعیت", accessor: (row: any) => convertNotifStatus(row.status) },
  { header: "نوع", accessor: (row: any) => convertNotifType(row.type) },
  {
    header: "علامت گذاری به عنوان خوانده شده",
    accessor: (item: any) => (
      <button
        disabled={isPending}
        onClick={() => mutationFn(item.id)}
        className="flex items-center w-full h-full"
      >
        {loadingId !== item.id ? (
          <IoCheckmarkCircleSharp
            className="text-blue-500 text-center"
            size={20}
          />
        ) : (
          <PuffLoader color="#3b82f6" size={20} />
        )}
      </button>
    ),
  },
];

export const doctorColumns = [
  { header: "نام", accessor: "name" },
  { header: "تلفن", accessor: "phone" },
  { header: "تاریخ تولد", accessor: (row: any) => dateConvert(row.birth_date) },
  {
    header: "پنل متخصص",
    accessor: (row: any) => (
      <TransitionLink href={`/admin-dashboard/doctors/panel/${row.id}`}>
        <MdInsertChart size={25} className="text-blue-500" />
      </TransitionLink>
    ),
  },
];

export const clientColumns = [
  { header: "نام", accessor: "name" },
  { header: "تلفن", accessor: "phone" },
  { header: "تاریخ تولد", accessor: (row: any) => dateConvert(row.birth_date) },
  {
    header: "پنل مراجع",
    accessor: (row: any) => (
      <Link href={`/admin-dashboard/clients/${row.id}`}>
        <MdInsertChart size={25} className="text-blue-500" />
      </Link>
    ),
  },
];

export const assessmentsColumns = [
  {
    header: "مراجع",
    accessor: (row: any) => (
      <div className="relative inline-block">
        <TransitionLink
          className="peer"
          href={`/admin-dashboard/clients/${row.client?.id}`}
        >
          {row.client?.name}
        </TransitionLink>

        <ClientCard client={row.client} />
      </div>
    ),
    cellClassName: (row: any) => "text-violet-500",
  },
  {
    header: "متخصص",
    accessor: (row: any) =>
      row?.doctor ? (
        <div className="relative inline-block">
          <TransitionLink
            className="peer"
            href={`/admin-dashboard/doctors/panel/${row.doctor.id}`}
          >
            {row.doctor?.name}
          </TransitionLink>

          <DoctorCard doctor={row.doctor} />
        </div>
      ) : (
        <p>انتخاب نشده</p>
      ),
    cellClassName: (row: any) => "text-cyan-500",
  },
  { header: "تاریخ", accessor: (row: any) => dateConvert(row.date) },
  { header: "زمان", accessor: (row: any) => row.time },
  {
    header: "وضعیت",
    accessor: (row: any) =>
      row.status === "done" ? "انجام شده" : "انجام نشده",
    cellClassName: (row: any) =>
      row.status === "done" ? "text-blue-600" : "text-amber-500",
  },
];

export const workshopColumns = [
  { header: "عنوان", accessor: "title" },
  { header: "روز های برگزاری", accessor: "week_day" },
  { header: "زمان برگزاری", accessor: "time" },
  {
    header: "پنل کارگاه",
    accessor: (row: any) => (
      <Link href={`/dashboard/workshops/${row.id}`}>
        <MdInsertChart size={25} className="text-blue-500" />
      </Link>
    ),
  },
];

export const categoryColumns = [
  { header: "عنوان", accessor: "name" },
  { header: "اسلاگ", accessor: "slug" },
];

export const tagColumns = [
  { header: "عنوان", accessor: "name" },
  { header: "اسلاگ", accessor: "slug" },
];

export const postColumns = [
  {
    header: "عنوان",
    accessor: (item: any) => (
      <Link
        href={`/dashboard/posts/${item.slug}`}
        className="hover:text-blue-500"
      >
        {item.title}
      </Link>
    ),
  },
  { header: "نویسنده", accessor: (item: any) => item.author.name },
  { header: "دسته بندی", accessor: (item: any) => item.category?.name ?? "" },
  { header: "وضعیت", accessor: (item: any) => convertPostStatus(item.status) },
];

export const departmentColumns = [
  { header: "عنوان", accessor: "title" },
  { header: "اسلاگ", accessor: "slug" },
];

export const paymentColumns = [
  { header: "مراجع", accessor: (item: any) => item.referral.client.name },
  { header: "متخصص", accessor: (item: any) => item.referral.doctor.name },
  {
    header: "تاریخ مراجعه",
    accessor: (item: any) => dateConvert(item.referral.date),
  },
  {
    header: "مبلغ",
    accessor: (item: any) => item.referral.amount,
    cellClassName: (item: any) =>
      item.status === "unpaid" ? "text-amber-500" : "text-sky-600",
  },
  {
    header: "وضعیت",
    accessor: (item: any) =>
      item.status === "paid" ? "پرداخت شده" : "پرداخت نشده",
    cellClassName: (item: any) =>
      item.status === "unpaid" ? "text-rose-500" : "text-green-500",
  },
];
