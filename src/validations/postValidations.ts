import * as yup from "yup";

export const postSchema = yup.object().shape({
  title: yup.string().required("عنوان الزامی است"),
  slug: yup.string().required("اسلاگ الزامی است"),
  content: yup.string().required("محتوا الزامی است"),
  excerpt: yup.string().nullable(),
  status: yup.string().nullable().default("draft"),
  published_at: yup.string().nullable().default(null),
  category_id: yup.string().required("دسته بندی الزامی است"),
  tag_ids: yup.array().nullable(),
  thumbnail: yup.mixed().nullable(),
});
