/**
 * Map admin form fields to Laravel appointment payload.
 * Forms historically used `doctor`, `client`, `amount_status`.
 */
export function toAppointmentPayload(
  input: Record<string, unknown>
): Record<string, unknown> {
  const doctorId = input.doctor_id ?? input.doctor;
  const clientId = input.client_id ?? input.client;
  const paymentStatus = input.payment_status ?? input.amount_status;
  const amountRaw = input.amount;

  const payload: Record<string, unknown> = {
    doctor_id: doctorId,
    client_id: clientId,
    date: input.date,
    time: input.time,
    status: input.status,
    payment_status: paymentStatus,
    amount:
      typeof amountRaw === "string"
        ? Number(amountRaw)
        : amountRaw,
  };

  if (input.treatment_program_id) {
    payload.treatment_program_id = input.treatment_program_id;
  }
  if (input.create_treatment_program) {
    payload.create_treatment_program = true;
    if (input.program_title) payload.program_title = input.program_title;
  }
  if (Object.prototype.hasOwnProperty.call(input, "room_id")) {
    payload.room_id = input.room_id || null;
  }
  if (Object.prototype.hasOwnProperty.call(input, "session_notes")) {
    payload.session_notes = input.session_notes ?? null;
  }

  if (input.service != null && input.service !== "") {
    payload.service = input.service;
  }
  if (input.paid_amount != null && input.paid_amount !== "") {
    payload.paid_amount =
      typeof input.paid_amount === "string"
        ? Number(input.paid_amount)
        : input.paid_amount;
  }
  if (input.payment_method != null && input.payment_method !== "") {
    payload.payment_method = input.payment_method;
  }

  return payload;
}
