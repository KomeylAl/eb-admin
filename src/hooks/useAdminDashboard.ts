import { useQuery } from "@tanstack/react-query";
import {
  buildDailyCounts,
  countByField,
  fetchCollection,
  getLocalDateKey,
  safeTotal,
  type DayCount,
  type NamedCount,
} from "@/lib/dashboard";

export type AdminDashboardData = {
  totals: {
    clients: number;
    doctors: number;
    appointments30d: number;
    pendingAssessments: number;
    todayAppointments: number;
  };
  appointmentTrend: DayCount[];
  appointmentStatus: NamedCount[];
  paymentStatus: NamedCount[];
  partialErrors: string[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار",
  done: "انجام‌شده",
  paid: "پرداخت‌شده",
  unpaid: "پرداخت‌نشده",
};

async function loadAdminDashboard(): Promise<AdminDashboardData> {
  const today = getLocalDateKey();
  const partialErrors: string[] = [];

  const [clients, doctors, appointments, assessments, todayApps, payments] =
    await Promise.all([
      fetchCollection("/api/clients"),
      fetchCollection("/api/doctors"),
      fetchCollection("/api/appointments"),
      fetchCollection("/api/assessments"),
      fetchCollection(`/api/appointments?date=${today}`),
      fetchCollection("/api/payments"),
    ]);

  if (!clients.ok) partialErrors.push("clients");
  if (!doctors.ok) partialErrors.push("doctors");
  if (!appointments.ok) partialErrors.push("appointments");
  if (!assessments.ok) partialErrors.push("assessments");
  if (!todayApps.ok) partialErrors.push("todayAppointments");
  if (!payments.ok) partialErrors.push("payments");

  const appointmentTrend = buildDailyCounts(appointments.data, "date", 30);
  const appointments30d = appointmentTrend.reduce((sum, d) => sum + d.count, 0);

  const pendingAssessments = assessments.data.filter(
    (a) => a?.status === "pending"
  ).length;

  return {
    totals: {
      clients: safeTotal(clients.meta, clients.data.length),
      doctors: safeTotal(doctors.meta, doctors.data.length),
      appointments30d,
      pendingAssessments,
      todayAppointments: safeTotal(todayApps.meta, todayApps.data.length),
    },
    appointmentTrend,
    appointmentStatus: countByField(
      appointments.data,
      "status",
      STATUS_LABELS
    ),
    paymentStatus: countByField(
      payments.data.length ? payments.data : appointments.data,
      payments.data.length ? "status" : "payment_status",
      STATUS_LABELS
    ),
    partialErrors,
  };
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: loadAdminDashboard,
    staleTime: 60_000,
  });
}
