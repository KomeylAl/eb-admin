"use client";

import {
  useGetDoctor,
  useSendTodaySms,
  useSendTomorrowSms,
} from "@/hooks/useDoctors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import Header from "@/components/layout/Header";
import WithRole from "@/app/admin-dashboard/_components/WithRole";
import DoctorSevenDays from "@/app/admin-dashboard/_components/tabs/DoctorSevenDays";
import DoctorThirtyDays from "@/app/admin-dashboard/_components/tabs/DoctorThirtyDays";
import DoctorInfo from "@/app/admin-dashboard/_components/tabs/DoctorInfo";
import DoctorResumeTab from "@/app/admin-dashboard/_components/tabs/DoctorResumeTab";

interface Params {
  doctorId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const DoctorPanel = ({ params }: PageProps) => {
  const { doctorId } = React.use<Params>(params);
  const { isLoading: todaySmsLoading, refetch: sendTodaySms } =
    useSendTodaySms(doctorId);
  const { isLoading: tomorrowSmsLoading, refetch: sendTomorrowSms } =
    useSendTomorrowSms(doctorId);

  const { data } = useGetDoctor(doctorId);

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <WithRole allowedRoles={["boss", "manager"]}>
        <div className="w-full p-12">
          <div className="w-full h-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-2xl">پنل متخصص</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => sendTodaySms()}
                  className={`px-12 py-2 rounded-md text-white text-center cursor-pointer ${
                    todaySmsLoading ? "bg-blue-400" : "bg-blue-600"
                  }`}
                >
                  {todaySmsLoading
                    ? "در حال ارسال..."
                    : "ارسال پیامک نوبت های امروز"}
                </button>
                <button
                  onClick={() => sendTomorrowSms()}
                  className={`px-12 py-2 rounded-md text-white text-center cursor-pointer ${
                    tomorrowSmsLoading ? "bg-blue-400" : "bg-blue-600"
                  }`}
                >
                  {tomorrowSmsLoading
                    ? "در حال ارسال..."
                    : "ارسال پیامک نوبت های فردا"}
                </button>
              </div>
            </div>
            <div className="mt-12 flex-1">
              <Tabs defaultValue="sevenDays" className="w-full overflow-x-auto">
                <TabsList className="gap-4">
                  <TabsTrigger value="sevenDays">
                    نوبت های هفت روز گذشته
                  </TabsTrigger>
                  <TabsTrigger value="thirtyDays">
                    نوبت های سی روز گذشته
                  </TabsTrigger>
                  <TabsTrigger value="info">اطلاعات متخصص</TabsTrigger>
                  <TabsTrigger value="resume">رزومه</TabsTrigger>
                </TabsList>
                <TabsContent value="sevenDays" className="w-full">
                  <DoctorSevenDays doctorId={doctorId} />
                </TabsContent>
                <TabsContent value="thirtyDays" className="w-full">
                  <DoctorThirtyDays doctorId={doctorId} />
                </TabsContent>
                <TabsContent value="info" className="w-full">
                  <DoctorInfo doctor={{}} doctorId={doctorId} />
                </TabsContent>
                <TabsContent value="resume" className="w-full">
                  <DoctorResumeTab doctorId={doctorId} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </WithRole>
    </div>
  );
};

export default DoctorPanel;
