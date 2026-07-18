import { EntityType } from "./types";

export const statusOptions = [
  { value: "pending", label: "انجام نشده" },
  { value: "done", label: "انجام شده" },
];

export const amountStatusOptions = [
  { value: "unpaid", label: "پرداخت نشده" },
  { value: "paid", label: "پرداخت شده" },
];

export const apiOptions = (list: any): EntityType[] => {
  const options: EntityType[] = [];
  list.map((doctor: any) => {
    options.push({
      value: doctor.id,
      label: doctor.name,
    });
  });
  return options;
};

export const roleOptions = [
  { value: "receptionist", label: "پذیرش" },
  { value: "manager", label: "مدیریت" },
  { value: "author", label: "نویسنده وب سایت" },
  { value: "accountant", label: "حسابداری" },
];
