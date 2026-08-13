import { EntityType } from "./types";

export const statusOptions = [
  { value: "pending", label: "انجام نشده" },
  { value: "done", label: "انجام شده" },
];

export const treatmentProgramStatusOptions = [
  { value: "active", label: "فعال" },
  { value: "completed", label: "تکمیل‌شده" },
  { value: "paused", label: "متوقف" },
  { value: "cancelled", label: "لغو شده" },
];

export const amountStatusOptions = [
  { value: "unpaid", label: "پرداخت نشده" },
  { value: "paid", label: "پرداخت شده" },
];

export const apiOptions = (list: any): EntityType[] => {
  if (!Array.isArray(list)) return [];
  return list.map((item: any) => ({
    value: String(item.id),
    label: item.name || item.title || String(item.id),
  }));
};

export const roleOptions = [
  { value: "receptionist", label: "پذیرش" },
  { value: "manager", label: "مدیریت" },
  { value: "author", label: "نویسنده وب سایت" },
  { value: "accountant", label: "حسابداری" },
];
