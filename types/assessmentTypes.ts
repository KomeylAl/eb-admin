import { assessmentSchema } from "@/validations";
import { InferType } from "yup";

export type assessmentType = InferType<typeof assessmentSchema>;
