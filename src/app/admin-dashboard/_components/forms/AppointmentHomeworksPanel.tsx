"use client";

import { useAppointmentHomeworks } from "@/hooks/useHomeworks";
import { PuffLoader } from "react-spinners";

interface Props {
  appointmentId: string;
  initialHomeworks?: any[];
}

const AppointmentHomeworksPanel = ({
  appointmentId,
  initialHomeworks,
}: Props) => {
  const { data, isLoading } = useAppointmentHomeworks(appointmentId);
  const homeworks = data?.data ?? initialHomeworks ?? [];

  return (
    <div className="rounded-md border p-4 space-y-3">
      <h3 className="font-semibold text-sm">تکالیف جلسه</h3>
      {isLoading && <PuffLoader size={28} color="#3e86fa" />}
      {!isLoading && homeworks.length === 0 && (
        <p className="text-sm text-muted-foreground">تکلیفی ثبت نشده است.</p>
      )}
      <ul className="space-y-2">
        {homeworks.map((hw: any) => (
          <li key={hw.id} className="rounded border p-3 text-sm">
            <p className="font-medium">{hw.title}</p>
            {hw.body && (
              <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                {hw.body}
              </p>
            )}
            <p className="text-xs mt-2">وضعیت: {hw.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentHomeworksPanel;
