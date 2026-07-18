"use client";

import Table from "@/components/common/Table";
import { useDoctorThirtyDays } from "@/hooks/useDoctors";
import { appointmentColumns } from "@/lib/columns";
import { PuffLoader } from "react-spinners";

interface DoctorSevenDaysProps {
  doctorId: string;
}

const DoctorThirtyDays = ({ doctorId }: DoctorSevenDaysProps) => {
  const { data, isLoading, error } = useDoctorThirtyDays(doctorId);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {isLoading && <PuffLoader size={60} color="#3e86fa" />}

      {error && (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-rose-500">خطا در دریافت اطلاعات</p>
        </div>
      )}

      {data && (
        <Table
          data={data.data}
          columns={appointmentColumns}
          currentPage={0}
          pageSize={10}
          totalItems={data.lenght}
        />
      )}
    </div>
  );
};

export default DoctorThirtyDays;
