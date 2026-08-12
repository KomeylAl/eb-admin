export type ClientRecordFormValues = {
  doctor_id: string | number | null;
  supervisor_id: string | number | null;
  admin_id: string | number | null;
  record_number: string;
  reference_source?: string | null;
  admission_date?: string | null;
  visit_date?: string | null;
  chief_complaints?: string | null;
  present_illness?: string | null;
  past_history?: string | null;
  family_history?: string | null;
  personal_history?: string | null;
  mse?: string | null;
  diagnosis?: string | null;
  companion_name?: string | null;
  companion_phone?: string | null;
  companion_address?: string | null;
  companion_birth_date?: string | null;
  images?: File[];
};

export type MedicalRecordApi = {
  id?: string;
  record_number?: string;
  reference_source?: string | null;
  admission_date?: string | null;
  visit_date?: string | null;
  chief_complaints?: string | null;
  present_illness?: string | null;
  past_history?: string | null;
  family_history?: string | null;
  personal_history?: string | null;
  mse?: string | null;
  diagnosis?: string | null;
  doctor_id?: string | null;
  supervisor_id?: string | null;
  admin_id?: string | null;
  doctor?: { id: string; name?: string } | null;
  supervisor?: { id: string; name?: string } | null;
  admin?: { id: string; name?: string } | null;
  companion?: {
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    birth_date?: string | null;
  } | null;
  images?: Array<{
    id: string;
    url?: string | null;
    file_path?: string | null;
  }>;
};

export function emptyClientRecordValues(): ClientRecordFormValues {
  return {
    doctor_id: "",
    supervisor_id: "",
    admin_id: "",
    record_number: "",
    reference_source: "",
    admission_date: "",
    visit_date: "",
    chief_complaints: "",
    present_illness: "",
    past_history: "",
    family_history: "",
    personal_history: "",
    mse: "",
    diagnosis: "",
    companion_name: "",
    companion_phone: "",
    companion_address: "",
    companion_birth_date: "",
    images: [],
  };
}

export function flattenMedicalRecord(
  record?: MedicalRecordApi | null
): ClientRecordFormValues {
  if (!record) return emptyClientRecordValues();

  return {
    doctor_id: record.doctor_id || record.doctor?.id || "",
    supervisor_id: record.supervisor_id || record.supervisor?.id || "",
    admin_id: record.admin_id || record.admin?.id || "",
    record_number: record.record_number || "",
    reference_source: record.reference_source || "",
    admission_date: record.admission_date || "",
    visit_date: record.visit_date || "",
    chief_complaints: record.chief_complaints || "",
    present_illness: record.present_illness || "",
    past_history: record.past_history || "",
    family_history: record.family_history || "",
    personal_history: record.personal_history || "",
    mse: record.mse || "",
    diagnosis: record.diagnosis || "",
    companion_name: record.companion?.name || "",
    companion_phone: record.companion?.phone || "",
    companion_address: record.companion?.address || "",
    companion_birth_date: record.companion?.birth_date || "",
    images: [],
  };
}

export const clinicalFields: Array<{
  name: keyof ClientRecordFormValues;
  label: string;
}> = [
  { name: "chief_complaints", label: "شکایت اصلی (Chief Complaints)" },
  { name: "present_illness", label: "بیماری فعلی (Present Illness)" },
  { name: "past_history", label: "سابقه قبلی (Past History)" },
  { name: "family_history", label: "سابقه خانوادگی (Family History)" },
  { name: "personal_history", label: "سابقه شخصی (Personal History)" },
  { name: "mse", label: "وضعیت روانی (MSE)" },
  { name: "diagnosis", label: "تشخیص (Diagnosis)" },
];
