import * as yup from "yup";

export const tagSchema = yup.object().shape({
  name: yup.string().required("نام الزامی است"),
  slug: yup.string().required("اسلاگ الزامی است"),
  content: yup.string().required("محتوا الزامی است"),
  excerpt: yup.string().nullable(),
  image: yup.mixed().nullable(),
});
