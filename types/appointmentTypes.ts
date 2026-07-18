import { appointmentSchema } from "@/validations/appointmentValidations";
import { InferType } from "yup";

export type appointmentType = InferType<typeof appointmentSchema>;

export interface AppointmentApiType {
  id: number;
  amount: string;
  date: string;
  time: string;
  status: string;
  payment_status: string;

  client: {
    id: string;
    name: string;
    phone: string;
  };

  doctor: {
    id: string;
    name: string;
  };
}
