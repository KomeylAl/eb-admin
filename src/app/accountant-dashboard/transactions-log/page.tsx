"use client";

import { useState } from "react";
import { PuffLoader } from "react-spinners";
import AccountingPageShell from "../_components/AccountingPageShell";
import AccountingDateField from "../_components/AccountingDateField";
import Table from "@/components/common/Table";
import { usePaymentTransactions } from "@/hooks/usePaymentTransactions";
import { Input } from "@/components/ui/input";
import {
  dateConvert,
  formatMoney,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/utils";

const columns = [
  {
    header: "تاریخ",
    accessor: (row: any) =>
      row.created_at ? dateConvert(row.created_at) : "—",
  },
  {
    header: "مراجع",
    accessor: (row: any) =>
      row.payment?.appointment?.client?.name ||
      row.client?.name ||
      "—",
  },
  {
    header: "وضعیت قبل",
    accessor: (row: any) =>
      row.from_status ? paymentStatusLabel(row.from_status) : "—",
  },
  {
    header: "وضعیت بعد",
    accessor: (row: any) =>
      row.to_status
        ? paymentStatusLabel(row.to_status)
        : row.status
          ? paymentStatusLabel(row.status)
          : "—",
  },
  {
    header: "مبلغ",
    accessor: (row: any) =>
      formatMoney(row.paid_amount ?? row.amount ?? row.payment?.paid_amount),
  },
  {
    header: "روش",
    accessor: (row: any) =>
      paymentMethodLabel(row.method ?? row.payment?.method),
  },
  {
    header: "توضیح",
    accessor: (row: any) => row.note || row.reason || row.event || "—",
  },
];

export default function TransactionsLogPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const { data, isLoading, error } = usePaymentTransactions({
    page,
    pageSize,
    fromDate,
    toDate,
    paymentId,
  });

  return (
    <AccountingPageShell
      title="لاگ تراکنش‌ها"
      subtitle="تاریخچه تغییرات وضعیت و مبلغ پرداخت‌ها"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="شناسه پرداخت (اختیاری)"
            value={paymentId}
            onChange={(e) => {
              setPaymentId(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
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
        {error && <p className="text-rose-500">خطا در دریافت لاگ تراکنش‌ها</p>}
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
