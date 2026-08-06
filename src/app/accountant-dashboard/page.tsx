"use client";

import { useMemo, useState } from "react";
import KPICard from "./_components/KPICard";
import RevenueChart from "./_components/RevenueChart";
import ServiceRevenueChart from "./_components/ServiceRevenueChart";
import DataTable from "./_components/DataTable";
import StatusBadge from "./_components/StatusBadge";
import AccountingPageShell from "./_components/AccountingPageShell";
import {
  DollarSign,
  CreditCard,
  Clock,
  RotateCcw,
  ArrowUpLeft,
  TrendingUp,
} from "lucide-react";
import { subDays, startOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePayments } from "@/hooks/usePayments";
import {
  useFinanceByDay,
  useFinanceByDoctor,
  useFinanceCompare,
  useFinanceSummary,
} from "@/hooks/useFinance";
import {
  dateConvert,
  formatMoney,
  paymentStatusLabel,
  toApiDate,
} from "@/lib/utils";

function periodRange(period: string) {
  const now = new Date();
  const to = toApiDate(now);
  let from: string;
  if (period === "daily") {
    from = to;
  } else if (period === "weekly") {
    from = toApiDate(subDays(now, 6));
  } else {
    from = toApiDate(startOfMonth(now));
  }

  const spanDays =
    period === "daily" ? 1 : period === "weekly" ? 7 : now.getDate();
  const compareTo = toApiDate(subDays(new Date(from), 1));
  const compareFrom = toApiDate(subDays(new Date(from), spanDays));

  return { from, to, compareFrom, compareTo };
}

function growthLabel(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return undefined;
  }
  const n = Number(value);
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}٪`;
}

function growthType(value: number | null | undefined): "positive" | "negative" | "neutral" {
  if (value === null || value === undefined) return "neutral";
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

export default function AccountingDashboard() {
  const [period, setPeriod] = useState("monthly");
  const range = useMemo(() => periodRange(period), [period]);

  const { data: summaryRes, isLoading: loadingSummary } = useFinanceSummary({
    from: range.from,
    to: range.to,
  });
  const { data: compareRes } = useFinanceCompare({
    from: range.from,
    to: range.to,
    compareFrom: range.compareFrom,
    compareTo: range.compareTo,
  });
  const { data: byDayRes, isLoading: loadingByDay } = useFinanceByDay({
    from: range.from,
    to: range.to,
  });
  const { data: byDoctorRes, isLoading: loadingByDoctor } = useFinanceByDoctor({
    from: range.from,
    to: range.to,
  });
  const { data: paymentsRes, isLoading: loadingPayments } = usePayments({
    page: 1,
    pageSize: 5,
  });

  const summary = summaryRes?.data ?? summaryRes;
  const totals = summary?.totals ?? {};
  const byStatus = summary?.by_status ?? {};
  const compare = compareRes?.data ?? compareRes;
  const growth = compare?.growth ?? compare?.changes ?? {};

  const chartData = useMemo(() => {
    const rows = byDayRes?.data ?? byDayRes ?? [];
    const list = Array.isArray(rows) ? rows : rows?.items ?? [];
    return list.map((row: any) => ({
      name: row.date ? dateConvert(row.date) : row.day || row.name || "—",
      revenue: Number(row.paid ?? row.revenue ?? row.total ?? 0),
    }));
  }, [byDayRes]);

  const doctorChart = useMemo(() => {
    const rows = byDoctorRes?.data ?? byDoctorRes ?? [];
    const list = Array.isArray(rows) ? rows : rows?.items ?? [];
    return list
      .map((row: any) => ({
        name: row.doctor_name || row.doctor?.name || row.name || "—",
        revenue: Number(row.paid ?? row.revenue ?? row.total ?? 0),
      }))
      .slice(0, 6);
  }, [byDoctorRes]);

  const recentPayments = paymentsRes?.data ?? [];

  const paymentColumns = [
    {
      header: "مراجع",
      accessor: "client",
      render: (row: any) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {row.appointment?.client?.name ?? "—"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {row.appointment?.service || row.appointment?.doctor?.name || "—"}
          </p>
        </div>
      ),
    },
    {
      header: "تاریخ",
      accessor: "created_at",
      render: (row: any) => (
        <span className="text-slate-600 dark:text-slate-300">
          {row.created_at ? dateConvert(row.created_at) : "—"}
        </span>
      ),
    },
    {
      header: "مبلغ",
      accessor: "paid_amount",
      render: (row: any) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {formatMoney(row.paid_amount ?? row.amount)}
        </span>
      ),
    },
    {
      header: "وضعیت",
      accessor: "status",
      render: (row: any) => <StatusBadge status={row.status} />,
    },
  ];

  const isLoading = loadingSummary || loadingByDay || loadingByDoctor;

  return (
    <AccountingPageShell
      title="داشبورد حسابداری"
      subtitle="خلاصه وضعیت مالی کلینیک"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList className="bg-slate-100 dark:bg-slate-800">
            <TabsTrigger
              value="daily"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
            >
              روزانه
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
            >
              هفتگی
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
            >
              ماهانه
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Link href="/accountant-dashboard/financial-reports">
          <Button variant="outline" className="border-slate-200 dark:border-slate-700">
            <TrendingUp className="w-4 h-4 ml-2" />
            مشاهده گزارش‌ها
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard
          title="جمع صورتحساب"
          value={Number(totals.billed ?? 0)}
          change={growthLabel(growth.billed ?? growth.total)}
          changeType={growthType(growth.billed ?? growth.total)}
          icon={DollarSign}
          iconBg="bg-emerald-50 dark:bg-emerald-500/15"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <KPICard
          title="مبلغ وصول‌شده"
          value={Number(totals.paid ?? 0)}
          change={growthLabel(growth.paid)}
          changeType={growthType(growth.paid)}
          icon={CreditCard}
          iconBg="bg-blue-50 dark:bg-blue-500/15"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KPICard
          title="مانده معوق"
          value={Number(totals.outstanding ?? 0)}
          icon={Clock}
          iconBg="bg-amber-50 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <KPICard
          title="استرداد"
          value={Number(byStatus.refunded?.paid_amount ?? byStatus.refunded?.amount ?? byStatus.refunded ?? 0)}
          icon={RotateCcw}
          iconBg="bg-red-50 dark:bg-red-500/15"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RevenueChart data={chartData} isLoading={isLoading} />
        <ServiceRevenueChart
          data={doctorChart}
          isLoading={isLoading}
          title="درآمد به تفکیک پزشک"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            آخرین پرداخت‌ها
          </h3>
          <Link href="/accountant-dashboard/payments">
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              مشاهده همه
              <ArrowUpLeft className="w-4 h-4 mr-1" />
            </Button>
          </Link>
        </div>
        <DataTable
          columns={paymentColumns}
          data={recentPayments}
          isLoading={loadingPayments}
          emptyMessage="پرداختی یافت نشد"
          className="border-0 shadow-none"
        />
        {!loadingSummary && byStatus && Object.keys(byStatus).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            {Object.entries(byStatus).map(([key, val]: [string, any]) => (
              <span
                key={key}
                className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              >
                {paymentStatusLabel(key)}:{" "}
                {formatMoney(
                  typeof val === "object"
                    ? val.count ?? val.amount ?? 0
                    : val
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </AccountingPageShell>
  );
}
