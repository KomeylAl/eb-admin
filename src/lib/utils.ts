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
