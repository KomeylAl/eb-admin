"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { Eye, Plus, Sparkles, Trash2 } from "lucide-react";
import AccountingPageShell from "../_components/AccountingPageShell";
import AccountingDateField from "../_components/AccountingDateField";
import StatusBadge from "../_components/StatusBadge";
import Table from "@/components/common/Table";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
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
import { useModal } from "@/hooks/useModal";
import {
  InvoiceItemInput,
  InvoicePayload,
  useCreateInvoice,
  useDeleteInvoice,
  useInvoices,
  useSuggestInvoiceItems,
} from "@/hooks/useInvoices";
import {
  dateConvert,
  formatMoney,
  getFormattedDate,
  invoiceStatusLabel,
} from "@/lib/utils";
import toast from "react-hot-toast";

type DraftItem = InvoiceItemInput;

type DraftForm = {
  client_id: string;
  issue_date: string;
  due_date: string;
  status: string;
  from_date: string;
  to_date: string;
  notes: string;
  items: DraftItem[];
};

const emptyItem = (): DraftItem => ({
  description: "",
  unit: "جلسه",
  quantity: 1,
  unit_price: 0,
});

const emptyForm = (): DraftForm => ({
  client_id: "",
  issue_date: getFormattedDate(),
  due_date: "",
  status: "draft",
  from_date: "",
  to_date: "",
  notes: "",
  items: [emptyItem()],
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

export default function InvoicesPage() {
  const router = useRouter();
  const { data, isLoading, error } = useInvoices();

  const formModal = useModal();
  const deleteModal = useModal();

  const [form, setForm] = useState<DraftForm>(emptyForm());
  const [selectedId, setSelectedId] = useState("");
  const [clientLabel, setClientLabel] = useState("");

  const suggest = useSuggestInvoiceItems();
  const create = useCreateInvoice((created) => {
    formModal.closeModal();
    setForm(emptyForm());
    setClientLabel("");
    const id = created?.data?.id ?? created?.id;
    if (id) router.push(`/accountant-dashboard/invoices/${id}`);
  });
  const remove = useDeleteInvoice(() => deleteModal.closeModal());

  const invoices = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const itemsTotal = useMemo(
    () =>
      form.items.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
        0
      ),
    [form.items]
  );

  const setItem = (index: number, patch: Partial<DraftItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const handleSuggest = async () => {
    if (!form.client_id || !form.from_date || !form.to_date) {
      toast.error("مراجع و بازه تاریخ را مشخص کنید");
      return;
    }
    const res = await suggest.mutateAsync({
      client_id: form.client_id,
      from_date: form.from_date,
      to_date: form.to_date,
    });
    const items = normalizeSuggestedItems(res);
    if (items.length === 0) {
      toast.error("نوبتی در این بازه یافت نشد");
      return;
    }
    setForm((prev) => ({ ...prev, items }));
    toast.success(`${items.length} قلم پیشنهاد شد`);
  };

  const submit = () => {
    const payload: InvoicePayload = {
      client_id: form.client_id,
      issue_date: form.issue_date,
      due_date: form.due_date || null,
      status: form.status,
      from_date: form.from_date || null,
      to_date: form.to_date || null,
      notes: form.notes || null,
      items: form.items.map((item, idx) => ({
        description: item.description,
        unit: item.unit || undefined,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        appointment_id: item.appointment_id || null,
        sort_order: idx,
      })),
    };
    create.mutate(payload);
  };

  const columns = [
    {
      header: "شماره",
      accessor: (row: any) => row.number || "—",
    },
    {
      header: "مراجع",
      accessor: (row: any) => row.client?.name ?? "—",
    },
    {
      header: "تاریخ صدور",
      accessor: (row: any) =>
        row.issue_date ? dateConvert(row.issue_date) : "—",
    },
    {
      header: "وضعیت",
      accessor: (row: any) => <StatusBadge status={row.status} />,
    },
    {
      header: "جمع",
      accessor: (row: any) => formatMoney(row.total ?? row.subtotal ?? 0),
    },
    {
      header: "اقلام",
      accessor: (row: any) =>
        Array.isArray(row.items)
          ? row.items.length.toLocaleString("fa-IR")
          : "—",
    },
    {
      header: "اقدامات",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <Link href={`/accountant-dashboard/invoices/${row.id}`}>
            <Button type="button" variant="ghost" size="icon" title="مشاهده و ویرایش">
              <Eye className="w-4 h-4 text-emerald-600" />
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedId(row.id);
              deleteModal.openModal();
            }}
            title="حذف"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AccountingPageShell
      title="صورتحساب‌ها"
      subtitle="لیست فاکتورها؛ برای ویرایش اقلام وارد صفحه هر فاکتور شوید"
      actions={
        <Button
          onClick={() => {
            setForm(emptyForm());
            setClientLabel("");
            formModal.openModal();
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 ml-2" />
          فاکتور جدید
        </Button>
      }
    >
      <div className="w-full flex items-center justify-center min-h-[200px]">
        {isLoading && <PuffLoader size={60} color="#10b981" />}
        {error && <p className="text-rose-500">خطا در دریافت فاکتورها</p>}
        {!isLoading && !error && <Table data={invoices} columns={columns} />}
      </div>

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        className="max-w-4xl w-[calc(100%-1.5rem)] sm:mx-4 shadow-xl"
      >
        <div className="p-4 sm:p-6 md:p-8 space-y-5 w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            فاکتور جدید
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>مراجع</Label>
              <ClientCombobox
                value={form.client_id}
                selectedLabel={clientLabel}
                onSelectedLabelChange={setClientLabel}
                onChange={(v) =>
                  setForm((p) => ({ ...p, client_id: String(v) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>تاریخ صدور</Label>
              <AccountingDateField
                value={dateConvert(form.issue_date)}
                onChange={(v) => setForm((p) => ({ ...p, issue_date: v }))}
              />
            </div>
            <div className="space-y-2">
              <Label>سررسید</Label>
              <AccountingDateField
                value={dateConvert(form.due_date)}
                onChange={(v) => setForm((p) => ({ ...p, due_date: v }))}
              />
            </div>
            <div className="space-y-2">
              <Label>از تاریخ (بازه نوبت)</Label>
              <AccountingDateField
                value={dateConvert(form.from_date)}
                onChange={(v) => setForm((p) => ({ ...p, from_date: v }))}
              />
            </div>
            <div className="space-y-2">
              <Label>تا تاریخ (بازه نوبت)</Label>
              <AccountingDateField
                value={dateConvert(form.to_date)}
                onChange={(v) => setForm((p) => ({ ...p, to_date: v }))}
              />
            </div>
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
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
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

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
                onClick={() =>
                  setForm((p) => ({ ...p, items: [...p.items, emptyItem()] }))
                }
              >
                <Plus className="w-3.5 h-3.5 ml-1" />
                قلم دستی
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {form.items.map((item, idx) => (
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
                    disabled={form.items.length <= 1}
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        items: p.items.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              جمع کل:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {formatMoney(itemsTotal)}
              </span>
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={formModal.closeModal}
            >
              انصراف
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
              disabled={
                create.isPending ||
                !form.client_id ||
                !form.issue_date ||
                form.items.some((i) => !i.description)
              }
              onClick={submit}
            >
              {create.isPending ? "در حال ذخیره…" : "ذخیره و ادامه"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal}>
        <DeleteModal
          onCancel={deleteModal.closeModal}
          isDeleting={remove.isPending}
          deleteFn={() => remove.mutate(selectedId)}
          description="فاکتور و اقلام مرتبط حذف می‌شوند."
        />
      </Modal>
    </AccountingPageShell>
  );
}
