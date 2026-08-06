"use client";

import { dateConvert, formatMoney, invoiceStatusLabel } from "@/lib/utils";

export type InvoicePrintData = {
  number?: string;
  status?: string;
  issue_date?: string;
  due_date?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  notes?: string | null;
  subtotal?: number;
  total?: number;
  client?: {
    name?: string;
    phone?: string;
    address?: string;
  } | null;
  items?: Array<{
    description?: string;
    unit?: string;
    quantity?: number;
    unit_price?: number;
    line_total?: number;
  }>;
  clinic?: {
    title?: string;
    address?: string;
    phones?: string;
    mobile_phones?: string;
    logo_url?: string;
  } | null;
};

export default function InvoicePrintTemplate({
  invoice,
}: {
  invoice: InvoicePrintData;
}) {
  const items = invoice.items || [];
  const subtotal =
    invoice.subtotal ??
    items.reduce(
      (s, i) =>
        s +
        Number(
          i.line_total ?? Number(i.quantity || 0) * Number(i.unit_price || 0)
        ),
      0
    );
  const total = invoice.total ?? subtotal;
  const clinicPhones = [invoice.clinic?.phones, invoice.clinic?.mobile_phones]
    .filter(Boolean)
    .join(" | ");

  return (
    <div className="invoice-print bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden print:rounded-none print:border-0 print:shadow-none">
      {/* Header — compact so A4 starts at the top */}
      <div className="border-b-2 border-emerald-600 px-6 py-4 print:px-0 print:py-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] tracking-wide text-emerald-700 font-medium mb-0.5">
              صورتحساب خدمات
            </p>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              {invoice.clinic?.title || "کلینیک ابراز"}
            </h1>
            {invoice.clinic?.address && (
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {invoice.clinic.address}
              </p>
            )}
            {clinicPhones && (
              <p className="text-xs text-slate-600 mt-0.5">{clinicPhones}</p>
            )}
          </div>
          <div className="text-left shrink-0 border border-slate-200 rounded-lg px-3 py-2 print:border-slate-300">
            <p className="text-base font-bold text-emerald-700">فاکتور</p>
            <p className="text-xs text-slate-700 mt-1.5">
              شماره:{" "}
              <span className="font-semibold text-slate-900">
                {invoice.number || "—"}
              </span>
            </p>
            <p className="text-xs text-slate-700">
              وضعیت:{" "}
              {invoice.status ? invoiceStatusLabel(invoice.status) : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 print:px-0 print:py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs no-print-break print:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-3">
            <p className="font-semibold text-slate-800 mb-1.5 text-sm">
              اطلاعات مراجع
            </p>
            <p>نام: {invoice.client?.name || "—"}</p>
            <p className="mt-0.5">تلفن: {invoice.client?.phone || "—"}</p>
            {invoice.client?.address && (
              <p className="mt-0.5">آدرس: {invoice.client.address}</p>
            )}
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="font-semibold text-slate-800 mb-1.5 text-sm">
              جزئیات فاکتور
            </p>
            <p>
              تاریخ صدور:{" "}
              {invoice.issue_date ? dateConvert(invoice.issue_date) : "—"}
            </p>
            <p className="mt-0.5">
              سررسید: {invoice.due_date ? dateConvert(invoice.due_date) : "—"}
            </p>
            {(invoice.from_date || invoice.to_date) && (
              <p className="mt-0.5">
                بازه خدمات:{" "}
                {invoice.from_date ? dateConvert(invoice.from_date) : "—"} تا{" "}
                {invoice.to_date ? dateConvert(invoice.to_date) : "—"}
              </p>
            )}
          </div>
        </div>

        <table className="w-full text-xs border-collapse mb-3">
          <thead>
            <tr className="bg-slate-100 border-y border-slate-300">
              <th className="text-right py-2 px-1.5 font-semibold w-10">ردیف</th>
              <th className="text-right py-2 px-1.5 font-semibold">شرح خدمت</th>
              <th className="text-right py-2 px-1.5 font-semibold w-14">واحد</th>
              <th className="text-right py-2 px-1.5 font-semibold w-14">تعداد</th>
              <th className="text-right py-2 px-1.5 font-semibold w-22">فی</th>
              <th className="text-right py-2 px-1.5 font-semibold w-24">مبلغ</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-5 text-center text-slate-500">
                  قلمی ثبت نشده است
                </td>
              </tr>
            )}
            {items.map((item, idx) => {
              const line =
                item.line_total ??
                Number(item.quantity || 0) * Number(item.unit_price || 0);
              return (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="py-2 px-1.5 text-slate-500">{idx + 1}</td>
                  <td className="py-2 px-1.5">{item.description || "—"}</td>
                  <td className="py-2 px-1.5">{item.unit || "—"}</td>
                  <td className="py-2 px-1.5">
                    {Number(item.quantity || 0).toLocaleString("fa-IR")}
                  </td>
                  <td className="py-2 px-1.5">{formatMoney(item.unit_price)}</td>
                  <td className="py-2 px-1.5 font-semibold">
                    {formatMoney(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end no-print-break">
          <div className="w-full max-w-60 border border-slate-300 overflow-hidden rounded-md">
            <div className="flex justify-between px-3 py-2 text-xs bg-slate-50 print:bg-transparent">
              <span className="text-slate-600">جمع جزء</span>
              <span className="font-medium">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between px-3 py-2.5 text-sm font-bold border-t border-emerald-600 text-emerald-900">
              <span>مبلغ قابل پرداخت</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-4 pt-3 border-t border-slate-200 text-xs no-print-break">
            <p className="font-semibold mb-1 text-sm">یادداشت</p>
            <p className="text-slate-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-8 text-xs text-slate-600 no-print-break print:mt-6">
          <div className="text-center">
            <div className="h-10" />
            <div className="border-t border-slate-400 pt-1.5">امضای مراجع</div>
          </div>
          <div className="text-center">
            <div className="h-10" />
            <div className="border-t border-slate-400 pt-1.5">
              مهر و امضای کلینیک
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
