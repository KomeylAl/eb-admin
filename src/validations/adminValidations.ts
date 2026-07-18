import * as yup from "yup";

export const adminSchema = yup.object({
  name: yup.string().required("نام الزامی است."),
  phone: yup.string().required("تلفن الزامی است."),
  role: yup.string().required("نفش الزامی است."),
  birth_date: yup.string().optional(),
  password: yup.string().required("رمز عبور الزامی است."),
});
