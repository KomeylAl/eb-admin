import Link from "next/link";
import Image from "next/image";
import {
  convertCommentableType,
  convertNotifPriority,
  convertNotifStatus,
  convertNotifType,
  convertPostStatus,
  convertRole,
  convertTreatmentProgramStatus,
  dateConvert,
  formatMoney,
  paymentMethodLabel,
  paymentStatusLabel,
} from "./utils";
import { MdInsertChart } from "react-icons/md";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import TransitionLink from "@/components/ui/TransitionLink";
import ClientCard from "@/app/admin-dashboard/_components/cards/ClientCard";
import DoctorCard from "@/app/admin-dashboard/_components/cards/DoctorCard";
import NotificationCard from "@/app/admin-dashboard/_components/cards/NotificationCard";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const treatmentProgramColumns = [
  {
    header: "عنوان",
    accessor: (row: any) => (
      <TransitionLink
        href={`/admin-dashboard/treatment-programs/${row.id}`}
        className="text-blue-600 hover:underline font-medium"
      >
        {row.title || "برنامه درمان"}
      </TransitionLink>
    ),
  },
  {
    header: "مراجع",
    accessor: (row: any) =>
      row.client?.id ? (
        <TransitionLink
          href={`/admin-dashboard/clients/${row.client.id}`}
          className="text-violet-600 hover:underline"
        >
          {row.client?.name}
        </TransitionLink>
      ) : (
        "—"
      ),
  },
  {
    header: "درمانگر",
    accessor: (row: any) => row.doctor?.name || "—",
    cellClassName: () => "text-cyan-600",
  },
  {
    header: "وضعیت",
    accessor: (row: any) => convertTreatmentProgramStatus(row.status),
  },
  {
    header: "جلسات",
    accessor: (row: any) => row.appointments_count ?? 0,
  },
  {
    header: "شروع",
    accessor: (row: any) =>
      row.started_at ? dateConvert(row.started_at) : "—",
  },
];

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
    header: "اتاق",
    accessor: (row: any) => row.room?.name || "—",
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

const doctorAvatarSrc = (row: any): string | null =>
  row.avatar_url ??
  row.doctor_profile?.avatar_url ??
  (typeof row.avatar === "string" && row.avatar.startsWith("http")
    ? row.avatar
    : null);

export const doctorColumns = [
  {
    header: "",
    accessor: (row: any) => {
      const src = doctorAvatarSrc(row);
      return src ? (
        // unoptimized: Laravel storage URLs fail via /_next/image optimizer (400)
        <Image
          src={src}
          alt={row.name ?? "متخصص"}
          width={40}
          height={40}
          unoptimized
          className="size-10 rounded-full object-cover ring-1 ring-border shrink-0"
        />
      ) : (
        <div className="size-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center font-semibold shrink-0">
          {(row.name ?? "؟").trim().charAt(0)}
        </div>
      );
    },
  },
  {
    header: "نام",
    accessor: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.name}</span>
        <span className="text-xs text-muted-foreground mt-0.5" dir="ltr">
          {row.phone}
        </span>
      </div>
    ),
  },
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

export const commentsColumns = (
  onApprove: (id: string) => void,
  onUnapprove: (id: string) => void,
  isApproving: boolean = false,
  loadingId: string | null = null
) => [
  {
    header: "نویسنده",
    accessor: (row: any) =>
      row.author_name || `${row.first_name ?? ""} ${row.last_name ?? ""}`,
  },
  { header: "تلفن", accessor: (row: any) => row.phone || "—" },
  {
    header: "متن",
    accessor: (row: any) => {
      const body = row.body || "";
      return body.length > 60 ? `${body.slice(0, 60)}...` : body;
    },
  },
  {
    header: "امتیاز",
    accessor: (row: any) => `${row.rating ?? "—"} / 5`,
  },
  {
    header: "هدف",
    accessor: (row: any) => convertCommentableType(row.commentable_type),
  },
  {
    header: "وضعیت",
    accessor: (row: any) => (row.approved ? "تأیید شده" : "در انتظار"),
    cellClassName: (row: any) =>
      row.approved ? "text-green-600" : "text-amber-500",
  },
  {
    header: "تاریخ",
    accessor: (row: any) =>
      row.created_at ? dateConvert(row.created_at) : "—",
  },
  {
    header: "تأیید",
    accessor: (row: any) => {
      const busy = isApproving && loadingId === row.id;
      if (busy) {
        return <PuffLoader size={24} color="#3e86fa" />;
      }
      return row.approved ? (
        <Button
          variant="ghost"
          size="sm"
          title="لغو تأیید"
          onClick={() => onUnapprove(row.id)}
        >
          <X className="w-4 h-4 text-amber-500" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          title="تأیید"
          onClick={() => onApprove(row.id)}
        >
          <Check className="w-4 h-4 text-green-600" />
        </Button>
      );
    },
  },
];

export const paymentColumns = [
  {
    header: "مراجع",
    accessor: (item: any) =>
      item.appointment?.client?.name ?? item.client?.name ?? "—",
  },
  {
    header: "متخصص",
    accessor: (item: any) =>
      item.appointment?.doctor?.name ?? item.doctor?.name ?? "—",
  },
  {
    header: "خدمت",
    accessor: (item: any) => item.appointment?.service ?? "—",
  },
  {
    header: "تاریخ مراجعه",
    accessor: (item: any) =>
      item.appointment?.date ? dateConvert(item.appointment.date) : "—",
  },
  {
    header: "مبلغ",
    accessor: (item: any) => formatMoney(item.amount),
  },
  {
    header: "پرداخت‌شده",
    accessor: (item: any) => formatMoney(item.paid_amount),
  },
  {
    header: "روش",
    accessor: (item: any) => paymentMethodLabel(item.method),
  },
  {
    header: "وضعیت",
    accessor: (item: any) => paymentStatusLabel(item.status),
    cellClassName: (item: any) => {
      if (item.status === "paid") return "text-emerald-600";
      if (item.status === "unpaid" || item.status === "refunded")
        return "text-rose-500";
      if (item.status === "partial") return "text-blue-600";
      return "text-amber-600";
    },
  },
];
