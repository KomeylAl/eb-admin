"use client";

import Header from "@/components/layout/Header";
import { useWorksop } from "@/hooks/useWorkshops";
import React from "react";
import { PuffLoader } from "react-spinners";
import TransitionLink from "@/components/ui/TransitionLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkshopMaterialsPanel from "../../_components/WorkshopMaterialsPanel";
import WorkshopCertificatesPanel from "../../_components/WorkshopCertificatesPanel";
import WorkshopParticipantsPanel from "../../_components/WorkshopParticipantsPanel";
import { convertWorkshopType } from "@/lib/utils";

interface Params {
  workshopId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const WorkshopPanel = ({ params }: PageProps) => {
  const { workshopId } = React.use(params);
  const { data, isLoading, error, refetch } = useWorksop(workshopId);
  const workshop = data?.data;

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="w-full p-4 sm:p-6 md:p-8 space-y-6">
        {isLoading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        )}

        {error && (
          <p className="text-rose-500 text-center">خطا در دریافت کارگاه</p>
        )}

        {workshop && (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-bold text-2xl">{workshop.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  نوع: {convertWorkshopType(workshop.type)} · برگزارکننده:{" "}
                  {workshop.organizers || "—"}
                </p>
              </div>
              <TransitionLink
                href="/content-dashboard/workshops"
                className="text-blue-600 text-sm"
              >
                بازگشت به لیست
              </TransitionLink>
            </div>

            <Tabs defaultValue="participants" className="w-full">
              <TabsList>
                <TabsTrigger value="participants">شرکت‌کنندگان</TabsTrigger>
                <TabsTrigger value="materials">منابع آموزشی</TabsTrigger>
                <TabsTrigger value="certificates">گواهی‌ها</TabsTrigger>
                <TabsTrigger value="info">اطلاعات</TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="pt-4">
                <WorkshopParticipantsPanel workshopId={workshopId} />
              </TabsContent>

              <TabsContent value="materials" className="pt-4">
                <WorkshopMaterialsPanel workshopId={workshopId} />
              </TabsContent>

              <TabsContent value="certificates" className="pt-4">
                <WorkshopCertificatesPanel workshopId={workshopId} />
              </TabsContent>

              <TabsContent value="info" className="pt-4">
                <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-2 text-sm">
                  <p>اسلاگ: {workshop.slug}</p>
                  <p>شروع: {workshop.start_date || "—"}</p>
                  <p>پایان: {workshop.end_date || "—"}</p>
                  <p>روز: {workshop.week_day || "—"}</p>
                  <p>ساعت: {workshop.time || "—"}</p>
                  {workshop.excerpt && (
                    <p className="text-muted-foreground pt-2">{workshop.excerpt}</p>
                  )}
                  <button
                    type="button"
                    className="text-blue-600 text-sm"
                    onClick={() => refetch()}
                  >
                    تازه‌سازی
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkshopPanel;
