import * as yup from "yup";

export const clientSchema = yup.object().shape({
  name: yup.string().required("نام الزامی است"),
  phone: yup.string().required("تلفن الزامی است"),
  address: yup.string().optional(),
  birth_date: yup.string().optional(),
});

export const clientRecordSchema = yup.object({
  doctor_id: yup.mixed().nullable(),
  supervisor_id: yup.mixed().nullable(),
  admin_id: yup.mixed().nullable(),
  record_number: yup.string().required("شماره پرونده الزامی است"),
  reference_source: yup.string().nullable(),
  admission_date: yup.string().nullable(),
  visit_date: yup.string().nullable(),
  chief_complaints: yup.string().nullable(),
  present_illness: yup.string().nullable(),
  past_history: yup.string().nullable(),
  family_history: yup.string().nullable(),
  personal_history: yup.string().nullable(),
  mse: yup.string().nullable(),
  diagnosis: yup.string().nullable(),
  companion_name: yup.string().nullable(),
  companion_phone: yup.string().nullable(),
  companion_address: yup.string().nullable(),
  companion_birth_date: yup.string().nullable(),
  images: yup
    .mixed<File[]>()
    .test("fileCount", "حداکثر ۵ عکس مجاز است", (value) => {
      if (!value) return true;
      return value.length <= 5;
    })
    .test("fileSize", "حجم هر عکس نباید بیشتر از ۵MB باشد", (value) => {
      if (!value) return true;
      return value.every((file) => file.size <= 5 * 1024 * 1024);
    }),
});

/** Doctor can only edit clinical fields (+ visit_date + images). */
export const doctorClinicalRecordSchema = yup.object({
  visit_date: yup.string().nullable(),
  chief_complaints: yup.string().nullable(),
  present_illness: yup.string().nullable(),
  past_history: yup.string().nullable(),
  family_history: yup.string().nullable(),
  personal_history: yup.string().nullable(),
  mse: yup.string().nullable(),
  diagnosis: yup.string().nullable(),
  images: yup
    .mixed<File[]>()
    .test("fileCount", "حداکثر ۵ عکس مجاز است", (value) => {
      if (!value) return true;
      return value.length <= 5;
    })
    .test("fileSize", "حجم هر عکس نباید بیشتر از ۵MB باشد", (value) => {
      if (!value) return true;
      return value.every((file) => file.size <= 5 * 1024 * 1024);
    }),
});
