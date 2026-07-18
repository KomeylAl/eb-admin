import * as yup from "yup";

export const clientSchema = yup.object().shape({
  name: yup.string().required("نام الزامی است"),
  phone: yup.string().required("تلفن الزامی است"),
  address: yup.string().optional(),
  birth_date: yup.string().optional(),
});
