import * as yup from "yup";

export const doctorSchema = yup.object().shape({
  name: yup.string().required("نام الزامی است"),
  phone: yup.string().required("تلفن الزامی است"),
  card_number: yup.string().required("شماره کارت الزامی است"),
  birth_date: yup.string().required("تاریخ تولد الزامی است"),
  national_code: yup.string().required("کد ملی الزامی است"),
  medical_number: yup.string().required("شماره نظام روانشناسی الزامی است"),
  email: yup.string().email().required("ایمیل الزامی است"),
  days: yup.string().nullable(),
  department_ids: yup.array().nullable(),
  avatar: yup.mixed().nullable(),
  resume: yup.mixed().nullable(),
});
