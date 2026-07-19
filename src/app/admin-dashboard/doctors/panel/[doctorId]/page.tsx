"use client";

import {
  useGetDoctor,
  useSendTodaySms,
  useSendTomorrowSms,
} from "@/hooks/useDoctors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import WithRole from "@/app/admin-dashboard/_components/WithRole";
import DoctorSevenDays from "@/app/admin-dashboard/_components/tabs/DoctorSevenDays";
import DoctorThirtyDays from "@/app/admin-dashboard/_components/tabs/DoctorThirtyDays";
import DoctorInfo from "@/app/admin-dashboard/_components/tabs/DoctorInfo";
import DoctorResumeTab from "@/app/admin-dashboard/_components/tabs/DoctorResumeTab";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarClock, CalendarDays, ChevronDown, MessageSquareText } from "lucide-react";

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
  const doctor = data?.data ?? null;
  const avatarSrc =
    doctor?.avatar_url ??
    doctor?.doctor_profile?.avatar_url ??
    (typeof doctor?.avatar === "string" && doctor.avatar.startsWith("http")
      ? doctor.avatar
      : null);

  const smsSending = todaySmsLoading || tomorrowSmsLoading;

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <WithRole allowedRoles={["boss", "manager"]}>
        <div className="w-full p-6 md:p-12">
          <div className="w-full h-full space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                {avatarSrc ? (
                  // unoptimized: Laravel storage URLs fail via /_next/image optimizer (400)
                  <Image
                    src={avatarSrc}
                    alt={doctor?.name ?? "متخصص"}
                    width={48}
                    height={48}
                    unoptimized
                    className="size-12 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
                    {(doctor?.name ?? "؟").trim().charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-xl md:text-2xl">
                    {doctor?.name ?? "پنل متخصص"}
                  </h2>
                  {doctor?.phone && (
                    <p className="text-sm text-muted-foreground">
                      {doctor.phone}
                    </p>
                  )}
                </div>
              </div>

              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={smsSending}>
                    <MessageSquareText />
                    {smsSending ? "در حال ارسال..." : "ارسال پیامک نوبت‌ها"}
                    <ChevronDown className="opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => sendTodaySms()}>
                    <CalendarClock />
                    نوبت‌های امروز
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => sendTomorrowSms()}>
                    <CalendarDays />
                    نوبت‌های فردا
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-8 flex-1">
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
                  <DoctorInfo doctorId={doctorId} />
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
