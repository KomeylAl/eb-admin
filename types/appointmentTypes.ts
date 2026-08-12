import { appointmentSchema } from "@/validations/appointmentValidations";
import { InferType } from "yup";

export type appointmentType = InferType<typeof appointmentSchema>;

export interface AppointmentApiType {
  id: string;
  amount: string;
  date: string;
  time: string;
  status: string;
  payment_status: string;
  treatment_program_id?: string | null;
  room_id?: string | null;
  session_notes?: string | null;
  homeworks?: Array<{
    id: string;
    title: string;
    body?: string | null;
    status: string;
  }>;
  room?: { id: string; name: string; code?: string | null } | null;
  treatment_program?: { id: string; title?: string | null } | null;

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
