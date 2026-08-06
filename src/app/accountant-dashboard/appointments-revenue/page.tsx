"use client";

import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { PuffLoader } from "react-spinners";
import AccountingPageShell from "../_components/AccountingPageShell";
import AccountingDateField from "../_components/AccountingDateField";
import Table from "@/components/common/Table";
import { useAppointments } from "@/hooks/useAppointments";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dateConvert,
  formatMoney,
  paymentStatusLabel,
} from "@/lib/utils";
import StatusBadge from "../_components/StatusBadge";
import KPICard from "../_components/KPICard";
import { DollarSign, CreditCard, Clock } from "lucide-react";

const columns = [
  {
    header: "مراجع",
    accessor: (row: any) => row.client?.name ?? "—",
  },
  {
    header: "پزشک",
    accessor: (row: any) => row.doctor?.name ?? "—",
  },
  {
    header: "خدمت",
    accessor: (row: any) => row.service || "—",
  },
  {
    header: "تاریخ",
    accessor: (row: any) => (row.date ? dateConvert(row.date) : "—"),
  },
  {
    header: "مبلغ",
    accessor: (row: any) => formatMoney(row.amount),
  },
  {
    header: "پرداخت‌شده",
    accessor: (row: any) => formatMoney(row.payment?.paid_amount ?? 0),
  },
  {
    header: "وضعیت پرداخت",
    accessor: (row: any) => (
      <StatusBadge status={row.payment?.status ?? "pending"} />
    ),
  },
];

export default function AppointmentsRevenuePage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading, error } = useAppointments({
    page,
    pageSize,
    search,
    paymentStatus: paymentStatus === "all" ? "" : paymentStatus,
    fromDate,
    toDate,
  });

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearch(text);
      setPage(1);
    }, 300),
    []
  );

  const totals = useMemo(() => {
    const rows = data?.data || [];
    return rows.reduce(
      (acc: any, row: any) => {
        acc.billed += Number(row.amount || 0);
        acc.paid += Number(row.payment?.paid_amount || 0);
        return acc;
      },
      { billed: 0, paid: 0 }
    );
  }, [data]);

  return (
    <AccountingPageShell
      title="درآمد نوبت‌ها"
      subtitle="نوبت‌ها و وضعیت مالی مرتبط"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="جمع صورتحساب (صفحه)"
          value={totals.billed}
          icon={DollarSign}
        />
        <KPICard
          title="وصول‌شده (صفحه)"
          value={totals.paid}
          icon={CreditCard}
          iconBg="bg-blue-50 dark:bg-blue-500/15"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KPICard
          title="مانده (صفحه)"
          value={Math.max(0, totals.billed - totals.paid)}
          icon={Clock}
          iconBg="bg-amber-50 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="جستجو…"
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <Select
            value={paymentStatus || "all"}
            onValueChange={(v) => {
              setPaymentStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="وضعیت پرداخت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="paid">{paymentStatusLabel("paid")}</SelectItem>
              <SelectItem value="unpaid">
                {paymentStatusLabel("unpaid")}
              </SelectItem>
              <SelectItem value="pending">
                {paymentStatusLabel("pending")}
              </SelectItem>
              <SelectItem value="partial">
                {paymentStatusLabel("partial")}
              </SelectItem>
              <SelectItem value="refunded">
                {paymentStatusLabel("refunded")}
              </SelectItem>
            </SelectContent>
          </Select>
          <AccountingDateField
            value={dateConvert(fromDate)}
            onChange={(v) => {
              setFromDate(v);
              setPage(1);
            }}
          />
          <AccountingDateField
            value={dateConvert(toDate)}
            onChange={(v) => {
              setToDate(v);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-center min-h-[200px]">
        {isLoading && <PuffLoader size={60} color="#10b981" />}
        {error && <p className="text-rose-500">خطا در دریافت نوبت‌ها</p>}
        {data && (
          <Table
            data={data.data || []}
            columns={columns}
            currentPage={data.meta?.current_page || page}
            pageSize={data.meta?.per_page || pageSize}
            totalItems={data.meta?.total || 0}
            onPageChange={setPage}
          />
        )}
      </div>
    </AccountingPageShell>
  );
}
