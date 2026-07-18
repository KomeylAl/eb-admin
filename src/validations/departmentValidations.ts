import * as yup from "yup";

export const departmentSchema = yup.object().shape({
  title: yup.string().required("عنوان الزامی است"),
  slug: yup.string().required("اسلاگ الزامی است"),
  content: yup.string().required("محتوا الزامی است"),
  excerpt: yup.string().nullable(),
  thumbnail: yup.mixed().nullable(),
});
