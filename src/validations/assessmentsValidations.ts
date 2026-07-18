import * as yup from "yup";

export const assessmentSchema = yup.object({
  client: yup
    .object({
      name: yup.string().required("نام الزامی است"),
      phone: yup.string().required("تلفن الزامی است"),
    })
    .required(),

  doctor_id: yup.string().nullable().optional(),
  date: yup.string().nullable().optional(),
  time: yup.string().nullable().optional(),
  status: yup.string().default("pending"),
  file: yup.mixed<File>().nullable(),
});
