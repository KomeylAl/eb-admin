"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";
import {
  ArrowRight,
  Plus,
  Printer,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import AccountingPageShell from "../../_components/AccountingPageShell";
import AccountingDateField from "../../_components/AccountingDateField";
import InvoicePrintTemplate from "../../_components/InvoicePrintTemplate";
import StatusBadge from "../../_components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClientCombobox from "@/components/ui/custom/ClientCombobox";
import { useAbout } from "@/hooks/useAbout";
import {
  InvoiceItemInput,
  InvoicePayload,
  useInvoice,
  useSuggestInvoiceItems,
  useUpdateInvoice,
} from "@/hooks/useInvoices";
import {
  dateConvert,
  formatMoney,
  getFormattedDate,
  invoiceStatusLabel,
} from "@/lib/utils";
import toast from "react-hot-toast";

type DraftItem = InvoiceItemInput & { id?: string };

const emptyItem = (): DraftItem => ({
  description: "",
  unit: "جلسه",
  quantity: 1,
  unit_price: 0,
});

function normalizeSuggestedItems(payload: any): DraftItem[] {
  const root = payload?.data ?? payload;
  const list = Array.isArray(root)
    ? root
    : Array.isArray(root?.items)
      ? root.items
      : [];
  return list.map((item: any, idx: number) => ({
    description: item.description || "",
    unit: item.unit || "جلسه",
    quantity: Number(item.quantity ?? 1),
    unit_price: Number(item.unit_price ?? item.amount ?? 0),
    appointment_id: item.appointment_id || null,
    sort_order: item.sort_order ?? idx,
  }));
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "");

  const { data, isLoading, error, refetch } = useInvoice(id);
  const { data: aboutRes } = useAbout();
  const clinic = aboutRes?.data ?? aboutRes ?? null;

  const invoice = data?.data ?? data;

  const [clientId, setClientId] = useState("");
  const [clientLabel, setClientLabel] = useState("");
  const [issueDate, setIssueDate] = useState(getFormattedDate());
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([emptyItem()]);
  const [hydrated, setHydrated] = useState(false);

  const suggest = useSuggestInvoiceItems();
  const update = useUpdateInvoice(() => {
    refetch();
  });

  useEffect(() => {
    setHydrated(false);
  }, [id]);

  useEffect(() => {
    if (!invoice?.id || hydrated) return;
    setClientId(invoice.client_id || invoice.client?.id || "");
    setClientLabel(invoice.client?.name || "");
    setIssueDate(invoice.issue_date || getFormattedDate());
    setDueDate(invoice.due_date || "");
    setStatus(invoice.status || "draft");
    setFromDate(invoice.from_date || "");
    setToDate(invoice.to_date || "");
    setNotes(invoice.notes || "");
    setItems(
      invoice.items?.length > 0
        ? invoice.items.map((item: any, idx: number) => ({
            description: item.description || "",
            unit: item.unit || "",
            quantity: Number(item.quantity || 1),
            unit_price: Number(item.unit_price || 0),
            appointment_id: item.appointment_id || null,
            sort_order: item.sort_order ?? idx,
          }))
        : [emptyItem()]
    );
    setHydrated(true);
  }, [invoice, hydrated]);

  const itemsTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
        0
      ),
    [items]
  );

  const setItem = (index: number, patch: Partial<DraftItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const handleSuggest = async () => {
    if (!clientId || !fromDate || !toDate) {
      toast.error("مراجع و بازه تاریخ را مشخص کنید");
      return;
    }
    const res = await suggest.mutateAsync({
      client_id: clientId,
      from_date: fromDate,
      to_date: toDate,
    });
    const next = normalizeSuggestedItems(res);
    if (next.length === 0) {
      toast.error("نوبتی در این بازه یافت نشد");
      return;
    }
    setItems(next);
    toast.success(`${next.length} قلم پیشنهاد شد`);
  };

  const save = () => {
    const payload: InvoicePayload = {
      client_id: clientId,
      issue_date: issueDate,
      due_date: dueDate || null,
      status,
      from_date: fromDate || null,
      to_date: toDate || null,
      notes: notes || null,
      items: items.map((item, idx) => ({
        description: item.description,
        unit: item.unit || undefined,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        appointment_id: item.appointment_id || null,
        sort_order: idx,
      })),
    };
    update.mutate({ id, body: payload });
  };

  const printData = {
    number: invoice?.number,
    status,
    issue_date: issueDate,
    due_date: dueDate || null,
    from_date: fromDate || null,
    to_date: toDate || null,
    notes: notes || null,
    subtotal: itemsTotal,
    total: itemsTotal,
    client: {
      ...(invoice?.client || {}),
      name: clientLabel || invoice?.client?.name,
      phone: invoice?.client?.phone,
      address: invoice?.client?.address,
    },
    items,
    clinic: {
      title: clinic?.title,
      address: clinic?.address,
      phones: clinic?.phones,
      mobile_phones: clinic?.mobile_phones,
      logo_url: clinic?.logo_url || clinic?.logo,
    },
  };

  if (isLoading) {
    return (
      <AccountingPageShell title="فاکتور" subtitle="در حال بارگذاری…">
        <div className="flex justify-center py-20">
          <PuffLoader size={60} color="#10b981" />
        </div>
      </AccountingPageShell>
    );
  }

  if (error || !invoice?.id) {
    return (
      <AccountingPageShell title="فاکتور" subtitle="یافت نشد">
        <div className="text-center space-y-4 py-16">
          <p className="text-rose-500">فاکتور پیدا نشد یا خطا رخ داد.</p>
          <Button variant="outline" onClick={() => router.push("/accountant-dashboard/invoices")}>
            بازگشت به لیست
          </Button>
        </div>
      </AccountingPageShell>
    );
  }

  if (!hydrated) {
    return (
      <AccountingPageShell title="فاکتور" subtitle="در حال آماده‌سازی…">
        <div className="flex justify-center py-20">
          <PuffLoader size={60} color="#10b981" />
        </div>
      </AccountingPageShell>
    );
  }

  return (
    <AccountingPageShell
      title={`فاکتور ${invoice.number || ""}`}
      subtitle={invoice.client?.name ? `مراجع: ${invoice.client.name}` : "جزئیات و ویرایش اقلام"}
      actions={
        <>
          <Link
            href="/accountant-dashboard/invoices"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            بازگشت به لیست
          </Link>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <StatusBadge status={status} />
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 ml-2" />
              چاپ
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none"
              disabled={
                update.isPending ||
                !clientId ||
                !issueDate ||
                items.some((i) => !i.description)
              }
              onClick={save}
            >
              <Save className="w-4 h-4 ml-2" />
              {update.isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
            </Button>
          </div>
        </>
      }
    >
      <div className="space-y-6 print-hidden">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 md:p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            اطلاعات فاکتور
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>مراجع</Label>
              <ClientCombobox
                value={clientId}
                selectedLabel={clientLabel}
                onSelectedLabelChange={setClientLabel}
                onChange={setClientId}
              />
            </div>
            <div className="space-y-2">
              <Label>تاریخ صدور</Label>
              <AccountingDateField value={dateConvert(issueDate)} onChange={setIssueDate} />
            </div>
            <div className="space-y-2">
              <Label>سررسید</Label>
              <AccountingDateField value={dateConvert(dueDate)} onChange={setDueDate} />
            </div>
            <div className="space-y-2">
              <Label>از تاریخ (بازه نوبت)</Label>
              <AccountingDateField value={dateConvert(fromDate)} onChange={setFromDate} />
            </div>
            <div className="space-y-2">
              <Label>تا تاریخ (بازه نوبت)</Label>
              <AccountingDateField value={dateConvert(toDate)} onChange={setToDate} />
            </div>
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["draft", "issued", "paid", "cancelled"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {invoiceStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>یادداشت</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              اقلام فاکتور
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={suggest.isPending}
                onClick={handleSuggest}
              >
                <Sparkles className="w-3.5 h-3.5 ml-1" />
                {suggest.isPending ? "در حال پیشنهاد…" : "پیشنهاد از نوبت‌ها"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setItems((prev) => [...prev, emptyItem()])}
              >
                <Plus className="w-3.5 h-3.5 ml-1" />
                قلم جدید
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-end bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-700"
              >
                <div className="col-span-12 md:col-span-4 space-y-1">
                  <Label className="text-xs">شرح</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      setItem(idx, { description: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label className="text-xs">واحد</Label>
                  <Input
                    value={item.unit || ""}
                    onChange={(e) => setItem(idx, { unit: e.target.value })}
                  />
                </div>
                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label className="text-xs">تعداد</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setItem(idx, { quantity: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label className="text-xs">فی</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.unit_price}
                    onChange={(e) =>
                      setItem(idx, { unit_price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-span-8 md:col-span-1 space-y-1">
                  <Label className="text-xs">جمع</Label>
                  <p className="h-9 flex items-center text-sm font-medium">
                    {formatMoney(
                      Number(item.quantity || 0) * Number(item.unit_price || 0)
                    )}
                  </p>
                </div>
                <div className="col-span-4 md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={items.length <= 1}
                    onClick={() =>
                      setItems((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            جمع کل:{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {formatMoney(itemsTotal)}
            </span>
          </p>
        </div>

        <div className="print-hidden pt-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
            پیش‌نمایش چاپ
          </h3>
        </div>
      </div>

      <div className="invoice-print-root overflow-x-auto">
        <InvoicePrintTemplate invoice={printData} />
      </div>
    </AccountingPageShell>
  );
}
