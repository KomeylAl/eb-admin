"use client";

import { useMemo, useState } from "react";
import { subDays, startOfMonth } from "date-fns";
import AccountingPageShell from "../_components/AccountingPageShell";
import AccountingDateField from "../_components/AccountingDateField";
import KPICard from "../_components/KPICard";
import RevenueChart from "../_components/RevenueChart";
import ServiceRevenueChart from "../_components/ServiceRevenueChart";
import DataTable from "../_components/DataTable";
import { Label } from "@/components/ui/label";
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
import { CreditCard, DollarSign, Clock, Percent } from "lucide-react";

export default function FinancialReportsPage() {
  const now = new Date();
  const [from, setFrom] = useState(toApiDate(startOfMonth(now)));
  const [to, setTo] = useState(toApiDate(now));
  const [compareFrom, setCompareFrom] = useState(
    toApiDate(startOfMonth(subDays(startOfMonth(now), 1)))
  );
  const [compareTo, setCompareTo] = useState(
    toApiDate(subDays(startOfMonth(now), 1))
  );

  const { data: summaryRes, isLoading: loadingSummary } = useFinanceSummary({
    from,
    to,
  });
  const { data: compareRes, isLoading: loadingCompare } = useFinanceCompare({
    from,
    to,
    compareFrom,
    compareTo,
  });
  const { data: byDayRes, isLoading: loadingByDay } = useFinanceByDay({
    from,
    to,
  });
  const { data: byDoctorRes, isLoading: loadingByDoctor } = useFinanceByDoctor({
    from,
    to,
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
      name: row.date ? dateConvert(row.date) : row.day || "—",
      revenue: Number(row.paid ?? row.revenue ?? row.total ?? 0),
    }));
  }, [byDayRes]);

  const doctorRows = useMemo(() => {
    const rows = byDoctorRes?.data ?? byDoctorRes ?? [];
    const list = Array.isArray(rows) ? rows : rows?.items ?? [];
    return list.map((row: any) => ({
      id: row.doctor_id || row.doctor?.id || row.name,
      name: row.doctor_name || row.doctor?.name || row.name || "—",
      billed: Number(row.billed ?? row.total ?? 0),
      paid: Number(row.paid ?? row.revenue ?? 0),
      outstanding: Number(
        row.outstanding ??
          Number(row.billed ?? row.total ?? 0) -
            Number(row.paid ?? row.revenue ?? 0)
      ),
    }));
  }, [byDoctorRes]);

  const doctorChart = doctorRows.slice(0, 8).map((r: {
    name: string;
    paid: number;
  }) => ({
    name: r.name,
    revenue: r.paid,
  }));

  const formatGrowth = (v: any) => {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return "—";
    const n = Number(v);
    const sign = n > 0 ? "+" : "";
    return `${sign}${n.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}٪`;
  };

  return (
    <AccountingPageShell
      title="گزارش‌های مالی"
      subtitle="خلاصه، مقایسه دوره‌ها و تفکیک روزانه/پزشک"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 dark:text-slate-400">از تاریخ</Label>
            <AccountingDateField value={dateConvert(from)} onChange={setFrom} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 dark:text-slate-400">تا تاریخ</Label>
            <AccountingDateField value={dateConvert(to)} onChange={setTo} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 dark:text-slate-400">مقایسه از</Label>
            <AccountingDateField value={dateConvert(compareFrom)} onChange={setCompareFrom} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 dark:text-slate-400">مقایسه تا</Label>
            <AccountingDateField value={dateConvert(compareTo)} onChange={setCompareTo} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="جمع صورتحساب"
          value={Number(totals.billed ?? 0)}
          change={formatGrowth(growth.billed ?? growth.total)}
          changeType={
            Number(growth.billed ?? growth.total) >= 0 ? "positive" : "negative"
          }
          icon={DollarSign}
        />
        <KPICard
          title="وصول‌شده"
          value={Number(totals.paid ?? 0)}
          change={formatGrowth(growth.paid)}
          changeType={Number(growth.paid) >= 0 ? "positive" : "negative"}
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
          title="رشد وصول"
          value={formatGrowth(growth.paid)}
          icon={Percent}
          iconBg="bg-violet-50 dark:bg-violet-500/15"
          iconColor="text-violet-600 dark:text-violet-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RevenueChart
          data={chartData}
          isLoading={loadingByDay}
          title="روند روزانه وصول"
        />
        <ServiceRevenueChart
          data={doctorChart}
          isLoading={loadingByDoctor}
          title="وصول به تفکیک پزشک"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            تفکیک وضعیت پرداخت
          </h3>
          {loadingSummary ? (
            <p className="text-slate-400 dark:text-slate-500 text-sm">در حال بارگذاری…</p>
          ) : (
            <div className="space-y-2">
              {Object.keys(byStatus).length === 0 && (
                <p className="text-slate-500 dark:text-slate-400 text-sm">داده‌ای نیست</p>
              )}
              {Object.entries(byStatus).map(([key, val]: [string, any]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {paymentStatusLabel(key)}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatMoney(
                      typeof val === "object"
                        ? val.amount ?? val.paid_amount ?? val.count ?? 0
                        : val
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
          {loadingCompare && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">در حال مقایسه…</p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            جدول پزشکان
          </h3>
          <DataTable
            columns={[
              { header: "پزشک", accessor: "name" },
              {
                header: "صورتحساب",
                render: (r: any) => formatMoney(r.billed),
              },
              {
                header: "وصول",
                render: (r: any) => formatMoney(r.paid),
              },
              {
                header: "مانده",
                render: (r: any) => formatMoney(r.outstanding),
              },
            ]}
            data={doctorRows}
            isLoading={loadingByDoctor}
            emptyMessage="گزارشی یافت نشد"
            className="border-0 shadow-none"
          />
        </div>
      </div>
    </AccountingPageShell>
  );
}
