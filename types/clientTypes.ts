import { clientSchema } from "@/validations";
import { InferType } from "yup";

export type clientType = InferType<typeof clientSchema>;

export interface ClientApiType {
  id: string;
  name: string;
  phone: string;
  birth_date: string;
  address: string;
}
