"use client";

import { useMemo, useState } from "react";
import { startOfMonth } from "date-fns";
import { Download, Printer } from "lucide-react";
import AccountingPageShell from "../_components/AccountingPageShell";
import AccountingDateField from "../_components/AccountingDateField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePayments } from "@/hooks/usePayments";
import { useFinanceByDay, useFinanceByDoctor } from "@/hooks/useFinance";
import { useInvoices } from "@/hooks/useInvoices";
import {
  dateConvert,
  downloadCsv,
  formatMoney,
  invoiceStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
  toApiDate,
} from "@/lib/utils";
import toast from "react-hot-toast";

type Source = "payments" | "by-day" | "by-doctor" | "invoices";

export default function ExportPrintPage() {
  const now = new Date();
  const [source, setSource] = useState<Source>("payments");
  const [from, setFrom] = useState(toApiDate(startOfMonth(now)));
  const [to, setTo] = useState(toApiDate(now));

  const { data: paymentsRes, isLoading: loadingPayments } = usePayments({
    page: 1,
    pageSize: 100,
    fromDate: from,
    toDate: to,
  });
  const { data: byDayRes, isLoading: loadingByDay } = useFinanceByDay({
    from,
    to,
  });
  const { data: byDoctorRes, isLoading: loadingByDoctor } = useFinanceByDoctor({
    from,
    to,
  });
  const { data: invoicesRes, isLoading: loadingInvoices } = useInvoices();

  const loading =
    loadingPayments || loadingByDay || loadingByDoctor || loadingInvoices;

  const preview = useMemo(() => {
    if (source === "payments") {
      return (paymentsRes?.data || []).slice(0, 8).map((p: any) => ({
        a: p.appointment?.client?.name || "—",
        b: formatMoney(p.paid_amount ?? p.amount),
        c: paymentStatusLabel(p.status),
      }));
    }
    if (source === "by-day") {
      const rows = byDayRes?.data ?? byDayRes ?? [];
      const list = Array.isArray(rows) ? rows : rows?.items ?? [];
      return list.slice(0, 8).map((r: any) => ({
        a: r.date ? dateConvert(r.date) : "—",
        b: formatMoney(r.paid ?? r.revenue ?? 0),
        c: formatMoney(r.billed ?? r.total ?? 0),
      }));
    }
    if (source === "by-doctor") {
      const rows = byDoctorRes?.data ?? byDoctorRes ?? [];
      const list = Array.isArray(rows) ? rows : rows?.items ?? [];
      return list.slice(0, 8).map((r: any) => ({
        a: r.doctor_name || r.doctor?.name || "—",
        b: formatMoney(r.paid ?? r.revenue ?? 0),
        c: formatMoney(r.billed ?? r.total ?? 0),
      }));
    }
    const invoices = Array.isArray(invoicesRes?.data)
      ? invoicesRes.data
      : Array.isArray(invoicesRes)
        ? invoicesRes
        : [];
    return invoices.slice(0, 8).map((r: any) => ({
      a: r.client?.name || "—",
      b: formatMoney(r.total ?? r.subtotal ?? 0),
      c: r.number || invoiceStatusLabel(r.status || ""),
    }));
  }, [source, paymentsRes, byDayRes, byDoctorRes, invoicesRes]);

  const exportCsv = () => {
    try {
      if (source === "payments") {
        const rows = (paymentsRes?.data || []).map((p: any) => [
          p.appointment?.client?.name || "",
          p.appointment?.doctor?.name || "",
          p.amount ?? 0,
          p.paid_amount ?? 0,
          paymentStatusLabel(p.status),
          paymentMethodLabel(p.method),
          p.created_at || "",
        ]);
        downloadCsv(
          `payments-${from}-${to}.csv`,
          ["مراجع", "پزشک", "مبلغ", "پرداخت‌شده", "وضعیت", "روش", "تاریخ"],
          rows
        );
      } else if (source === "by-day") {
        const rowsRaw = byDayRes?.data ?? byDayRes ?? [];
        const list = Array.isArray(rowsRaw) ? rowsRaw : rowsRaw?.items ?? [];
        downloadCsv(
          `finance-by-day-${from}-${to}.csv`,
          ["تاریخ", "وصول", "صورتحساب"],
          list.map((r: any) => [
            r.date || "",
            r.paid ?? r.revenue ?? 0,
            r.billed ?? r.total ?? 0,
          ])
        );
      } else if (source === "by-doctor") {
        const rowsRaw = byDoctorRes?.data ?? byDoctorRes ?? [];
        const list = Array.isArray(rowsRaw) ? rowsRaw : rowsRaw?.items ?? [];
        downloadCsv(
          `finance-by-doctor-${from}-${to}.csv`,
          ["پزشک", "وصول", "صورتحساب"],
          list.map((r: any) => [
            r.doctor_name || r.doctor?.name || "",
            r.paid ?? r.revenue ?? 0,
            r.billed ?? r.total ?? 0,
          ])
        );
      } else {
        const invoices = Array.isArray(invoicesRes?.data)
          ? invoicesRes.data
          : Array.isArray(invoicesRes)
            ? invoicesRes
            : [];
        downloadCsv(
          `invoices.csv`,
          ["شماره", "مراجع", "تاریخ صدور", "وضعیت", "جمع", "از", "تا"],
          invoices.map((r: any) => [
            r.number || "",
            r.client?.name || "",
            r.issue_date || "",
            r.status || "",
            r.total ?? r.subtotal ?? 0,
            r.from_date || "",
            r.to_date || "",
          ])
        );
      }
      toast.success("فایل CSV آماده شد");
    } catch {
      toast.error("خطا در ساخت خروجی");
    }
  };

  const printPage = () => {
    window.print();
  };

  const previewHeaders =
    source === "payments"
      ? ["مراجع", "مبلغ", "وضعیت"]
      : source === "by-day"
        ? ["تاریخ", "وصول", "صورتحساب"]
        : source === "by-doctor"
          ? ["پزشک", "وصول", "صورتحساب"]
          : ["مراجع", "جمع", "شماره/وضعیت"];

  return (
    <AccountingPageShell
      title="خروجی / چاپ"
      subtitle="خروجی CSV سمت مرورگر؛ چاپ فاکتور از صفحه صورتحساب‌ها"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 md:p-5 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 dark:text-slate-400">منبع</Label>
            <Select
              value={source}
              onValueChange={(v) => setSource(v as Source)}
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payments">پرداخت‌ها</SelectItem>
                <SelectItem value="by-day">گزارش روزانه</SelectItem>
                <SelectItem value="by-doctor">گزارش پزشکان</SelectItem>
                <SelectItem value="invoices">فاکتورها</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 dark:text-slate-400">از تاریخ</Label>
            <AccountingDateField value={dateConvert(from)} onChange={setFrom} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 dark:text-slate-400">تا تاریخ</Label>
            <AccountingDateField value={dateConvert(to)} onChange={setTo} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <Button
            onClick={exportCsv}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="w-4 h-4 ml-2" />
            دانلود CSV
          </Button>
          <Button variant="outline" onClick={printPage} disabled={loading}>
            <Printer className="w-4 h-4 ml-2" />
            چاپ
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          پیش‌نمایش
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          برای چاپ فاکتور، از صفحه صورتحساب‌ها گزینه مشاهده/چاپ را باز کنید.
        </p>
        {loading ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm">در حال بارگذاری…</p>
        ) : preview.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">داده‌ای برای خروجی نیست</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2 text-right font-medium">
                    {previewHeaders[0]}
                  </th>
                  <th className="py-2 text-right font-medium">
                    {previewHeaders[1]}
                  </th>
                  <th className="py-2 text-right font-medium">
                    {previewHeaders[2]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {preview.map(
                  (row: { a: string; b: string; c: string }, i: number) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800">
                      <td className="py-2.5 text-slate-800 dark:text-slate-200">{row.a}</td>
                      <td className="py-2.5 text-slate-800 dark:text-slate-200">{row.b}</td>
                      <td className="py-2.5 text-slate-800 dark:text-slate-200">{row.c}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AccountingPageShell>
  );
}
