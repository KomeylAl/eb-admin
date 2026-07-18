"use client";

import Header from "@/components/layout/Header";
import ToDaysList from "./_components/lists/TodaysList";
import { ClientsList } from "./_components/lists/ClientsList";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/Modal";
import StoreAppForm from "./_components/forms/StoreAppForm";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useUser } from "@/context/UserContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChartCard,
  DashboardSkeleton,
  SectionCard,
  StatCard,
  StatusDonutChart,
  TrendAreaChart,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck2,
  ClipboardList,
  UserRound,
  Users,
} from "lucide-react";

const AdminDashboard = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  return (
    <div className="flex-1 h-screen overflow-y-auto flex flex-col">
      <Header isShowSearch={false} searchFn={() => {}} />

      <div className="flex-1 p-4 md:p-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-xl md:text-2xl">داشبورد مدیریت</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.name
                ? `سلام ${user.name}؛ خلاصه وضعیت کلینیک در یک نگاه`
                : "خلاصه وضعیت کلینیک در یک نگاه"}
            </p>
          </div>
          <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
            افزودن نوبت
          </Button>
        </div>

        {isLoading && <DashboardSkeleton stats={4} />}

        {isError && (
          <div className="rounded-xl border border-dashed p-8 text-center space-y-3">
            <p className="text-rose-500">خطا در دریافت آمار داشبورد</p>
            <Button variant="outline" onClick={() => refetch()}>
              تلاش مجدد
            </Button>
          </div>
        )}

        {data && (
          <>
            {data.partialErrors.length > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                برخی منابع داده در دسترس نبودند؛ آمار ممکن است ناقص باشد.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="کل مراجعان"
                value={data.totals.clients}
                description="تعداد کل ثبت‌شده در سیستم"
                icon={Users}
                iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-300"
              />
              <StatCard
                title="درمانگران"
                value={data.totals.doctors}
                description="روان‌درمانگران فعال"
                icon={UserRound}
                iconClassName="bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
              />
              <StatCard
                title="نوبت‌های ۳۰ روز"
                value={data.totals.appointments30d}
                description={`امروز: ${data.totals.todayAppointments.toLocaleString("fa-IR")} نوبت`}
                icon={CalendarCheck2}
                iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-300"
              />
              <StatCard
                title="ارزیابی در انتظار"
                value={data.totals.pendingAssessments}
                description="نیازمند پیگیری پذیرش"
                icon={ClipboardList}
                iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-300"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              <ChartCard
                className="lg:col-span-2"
                title="روند نوبت‌ها"
                description="تعداد نوبت در ۳۰ روز اخیر"
                empty={data.appointmentTrend.every((d) => d.count === 0)}
              >
                <TrendAreaChart
                  data={data.appointmentTrend}
                  color="var(--chart-2)"
                  valueLabel="نوبت"
                />
              </ChartCard>

              <ChartCard
                title="وضعیت نوبت‌ها"
                description="توزیع وضعیت نوبت‌ها"
                empty={data.appointmentStatus.length === 0}
              >
                <StatusDonutChart data={data.appointmentStatus} />
              </ChartCard>

              <ChartCard
                title="وضعیت پرداخت"
                description="توزیع وضعیت پرداخت‌ها"
                empty={data.paymentStatus.length === 0}
              >
                <StatusDonutChart data={data.paymentStatus} />
              </ChartCard>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <SectionCard
                title="نوبت‌های امروز"
                description="لیست نوبت‌های روز جاری برای پیگیری سریع"
                href="/admin-dashboard/appointments"
              >
                <div className="p-3 md:p-0">
                  <ToDaysList compact />
                </div>
              </SectionCard>

              <SectionCard
                title="مراجعان"
                description="آخرین مراجعان ثبت‌شده در سیستم"
                href="/admin-dashboard/clients"
              >
                <div className="p-3 md:p-0">
                  <ClientsList compact />
                </div>
              </SectionCard>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        showCloseButton={false}
        className="max-w-[700px] bg-white"
      >
        <StoreAppForm
          onCloseModal={closeModal}
          onAddedAppointment={() => {
            closeModal();
            refetch();
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
          }}
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
