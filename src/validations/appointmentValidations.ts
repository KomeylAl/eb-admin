import * as yup from "yup";

const baseAppointmentFields = {
  client: yup.string().required("انتخاب مراجع الزامی است"),
  doctor: yup.string().required("انتخاب متخصص الزامی است"),
  treatment_program_id: yup.string().nullable(),
  create_treatment_program: yup.boolean().nullable(),
  program_title: yup.string().nullable(),
  room_id: yup.string().nullable(),
  session_notes: yup.string().nullable(),
  status: yup.string().required("انتخاب وضعیت الزامی است"),
  amount_status: yup.string().required("انتخاب وضعیت پرداخت الزامی است"),
  amount: yup.string().required("انتخاب مبلغ جلسه الزامی است"),
  date: yup.string().required("انتخاب تاریخ الزامی است"),
  time: yup.string().required("انتخاب زمان الزامی است"),
};

export const appointmentSchema = yup
  .object(baseAppointmentFields)
  .test(
    "program-required",
    "انتخاب یا ایجاد برنامه درمان الزامی است",
    (value) =>
      Boolean(value?.treatment_program_id) ||
      Boolean(value?.create_treatment_program)
  );

export const appointmentUpdateSchema = yup.object({
  ...baseAppointmentFields,
  treatment_program_id: yup
    .string()
    .required("انتخاب برنامه درمان الزامی است"),
});
