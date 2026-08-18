import { clsx, type ClassValue } from "clsx";
import { DateObject } from "react-multi-date-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
};

export function dateConvert(app_date: string) {
  const date = new Date(app_date);
  const jalali_date = date.toLocaleDateString("fa-IR");
  return jalali_date;
}

export function convertBaseDate(date: DateObject): string {
  return date
    .toDate()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")
    .slice(0, 10);
}

export function convertRole(role: string) {
  let output: string = "";
  switch (role) {
    case "receptionist":
      output = "پذیرش";
      break;
    case "manager":
      output = "مدیریت";
      break;
    case "author":
      output = "نویسنده وب سایت";
      break;
    case "accountant":
      output = "حسابداری";
      break;
    case "boss":
      output = "رئیس";
      break;
    default:
      output = "";
      break;
  }
  return output;
}

export function convertPostStatus(status: string) {
  let output: string = "";
  switch (status) {
    case "draft":
      output = "پیش نویس";
      break;
    case "published":
      output = "منتشر شده";
      break;
    case "archived":
      output = "آرشیو شده";
      break;
    default:
      output = "";
      break;
  }
  return output;
}

export function convertNotifStatus(status: string) {
  let output: string = "";
  switch (status) {
    case "pending":
      output = "در حال ارسال";
      break;
    case "sent":
      output = "ارسال شده";
      break;
    case "failed":
      output = "خطا";
      break;
    default:
      output = "";
      break;
  }
  return output;
}

export function convertNotifPriority(priority: string) {
  let output: string = "";
  switch (priority) {
    case "low":
      output = "پایین";
      break;
    case "medium":
      output = "متوسط";
      break;
    case "high":
      output = "بالا";
      break;
    default:
      output = "";
      break;
  }
  return output;
}

export function convertNotifType(type: string) {
  let output: string = "";
  switch (type) {
    case "system":
      output = "سیستم";
      break;
    case "appointment":
      output = "نوبت";
      break;
    case "reminder":
      output = "یادآوری";
      break;
    case "message":
      output = "پیام";
      break;
    default:
      output = "";
      break;
  }
  return output;
}

export function convertTreatmentProgramStatus(status: string) {
  switch (status) {
    case "active":
      return "فعال";
    case "completed":
      return "تکمیل‌شده";
    case "paused":
      return "متوقف";
    case "cancelled":
      return "لغو شده";
    default:
      return status || "—";
  }
}

export function convertHomeworkStatus(status: string) {
  switch (status) {
    case "assigned":
      return "در انتظار";
    case "done":
      return "انجام‌شده";
    case "cancelled":
      return "لغو شده";
    default:
      return status || "—";
  }
}

export function convertWorkshopType(type: string) {
  switch (type) {
    case "general":
      return "کارگاه عمومی";
    case "specialized":
    case "special":
      return "کارگاه تخصصی";
    case "webinar":
      return "وبینار";
    case "seminar":
      return "سمینار";
    default:
      return type || "—";
  }
}

export function convertCommentableType(type: string) {
  switch (type) {
    case "doctor":
      return "درمانگر";
    case "post":
      return "مقاله";
    case "workshop":
      return "کارگاه";
    default:
      return type;
  }
}

export function formatMoney(value: number | string | null | undefined): string {
  const num = typeof value === "string" ? Number(value) : value ?? 0;
  if (Number.isNaN(num)) return "۰";
  return Number(num).toLocaleString("fa-IR");
}

export function paymentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "در انتظار",
    paid: "پرداخت‌شده",
    unpaid: "پرداخت‌نشده",
    partial: "پرداخت جزئی",
    refunded: "استردادشده",
  };
  return map[status] ?? status;
}

export function paymentMethodLabel(method: string | null | undefined): string {
  if (!method) return "—";
  const map: Record<string, string> = {
    cash: "نقد",
    card: "کارت",
    transfer: "انتقال",
    other: "سایر",
  };
  return map[method] ?? method;
}

export function invoiceStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "پیش‌نویس",
    issued: "صادرشده",
    paid: "پرداخت‌شده",
    cancelled: "لغوشده",
  };
  return map[status] ?? status;
}

export function adjustmentTypeLabel(type: string): string {
  const map: Record<string, string> = {
    discount: "تخفیف",
    credit: "بستانکار",
    debit: "بدهکار",
  };
  return map[type] ?? type;
}

export function adjustmentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "فعال",
    void: "باطل",
  };
  return map[status] ?? status;
}

/** YYYY-MM-DD for API query params */
export function toApiDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const escape = (cell: string | number) => {
    const s = String(cell ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const bom = "\uFEFF";
  const content = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join(
    "\n"
  );
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
