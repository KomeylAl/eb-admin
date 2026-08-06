import * as yup from "yup";

export const appointmentSchema = yup.object({
  client: yup.string().required("انتخاب مراجع الزامی است"),
  doctor: yup.string().required("انتخاب متخصص الزامی است"),
  status: yup.string().required("انتخاب وضعیت الزامی است"),
  amount_status: yup.string().required("انتخاب وضعیت پرداخت الزامی است"),
  amount: yup.string().required("انتخاب مبلغ جلسه الزامی است"),
  date: yup.string().required("انتخاب تاریخ الزامی است"),
  time: yup.string().required("انتخاب زمان الزامی است"),
});
