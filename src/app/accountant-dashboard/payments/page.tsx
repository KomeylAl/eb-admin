"use client";

import { useCallback, useState } from "react";
import { debounce } from "lodash";
import { PuffLoader } from "react-spinners";
import AccountingPageShell from "../_components/AccountingPageShell";
import AccountingDateField from "../_components/AccountingDateField";
import Table from "@/components/common/Table";
import { paymentColumns } from "@/lib/columns";
import { usePayments } from "@/hooks/usePayments";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dateConvert } from "@/lib/utils";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading, error } = usePayments({
    page,
    pageSize,
    search,
    status: status === "all" ? "" : status,
    method: method === "all" ? "" : method,
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

  return (
    <AccountingPageShell
      title="پرداخت‌ها"
      subtitle="فهرست پرداخت‌های مرتبط با نوبت‌ها"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <Input
            placeholder="جستجوی مراجع…"
            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <Select
            value={status || "all"}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="paid">پرداخت‌شده</SelectItem>
              <SelectItem value="unpaid">پرداخت‌نشده</SelectItem>
              <SelectItem value="pending">در انتظار</SelectItem>
              <SelectItem value="partial">جزئی</SelectItem>
              <SelectItem value="refunded">استرداد</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={method || "all"}
            onValueChange={(v) => {
              setMethod(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="روش پرداخت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه روش‌ها</SelectItem>
              <SelectItem value="cash">نقد</SelectItem>
              <SelectItem value="card">کارت</SelectItem>
              <SelectItem value="transfer">انتقال</SelectItem>
              <SelectItem value="other">سایر</SelectItem>
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
        {error && (
          <p className="text-rose-500">خطا در دریافت اطلاعات پرداخت‌ها</p>
        )}
        {data && (
          <Table
            data={data.data || []}
            columns={paymentColumns}
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
