"use client";

import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { Plus } from "lucide-react";
import AccountingPageShell from "../_components/AccountingPageShell";
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
import { useModal } from "@/hooks/useModal";
import {
  AdjustmentPayload,
  useCreateAdjustment,
  useDeleteAdjustment,
  useFinancialAdjustments,
  useUpdateAdjustment,
} from "@/hooks/useFinancialAdjustments";
import {
  adjustmentStatusLabel,
  adjustmentTypeLabel,
  dateConvert,
  formatMoney,
} from "@/lib/utils";
import StatusBadge from "../_components/StatusBadge";

const emptyForm = (): AdjustmentPayload & { id?: string } => ({
  type: "discount",
  amount: 0,
  status: "active",
  appointment_id: "",
  invoice_id: "",
  reason: "",
});

export default function DiscountsAdjustmentsPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(emptyForm());
  const [selectedId, setSelectedId] = useState("");

  const formModal = useModal();
  const deleteModal = useModal();

  const { data, isLoading, error } = useFinancialAdjustments({
    page,
    pageSize: 15,
    type: type === "all" ? "" : type,
    status: status === "all" ? "" : status,
  });

  const create = useCreateAdjustment(() => {
    formModal.closeModal();
    setForm(emptyForm());
  });
  const update = useUpdateAdjustment(() => {
    formModal.closeModal();
    setForm(emptyForm());
  });
  const remove = useDeleteAdjustment(() => deleteModal.closeModal());

  const columns = [
    {
      header: "نوع",
      accessor: (row: any) => adjustmentTypeLabel(row.type),
    },
    {
      header: "مبلغ",
      accessor: (row: any) => formatMoney(row.amount),
    },
    {
      header: "وضعیت",
      accessor: (row: any) => <StatusBadge status={row.status} />,
    },
    {
      header: "دلیل",
      accessor: (row: any) => row.reason || "—",
    },
    {
      header: "نوبت",
      accessor: (row: any) =>
        row.appointment_id
          ? String(row.appointment_id).slice(0, 8) + "…"
          : "—",
    },
    {
      header: "فاکتور",
      accessor: (row: any) =>
        row.invoice_id
          ? String(row.invoice_id).slice(0, 8) + "…"
          : "—",
    },
    {
      header: "تاریخ",
      accessor: (row: any) =>
        row.created_at ? dateConvert(row.created_at) : "—",
    },
  ];

  const openCreate = () => {
    setForm(emptyForm());
    formModal.openModal();
  };

  const openEdit = (row: any) => {
    setForm({
      id: row.id,
      type: row.type,
      amount: Number(row.amount || 0),
      status: row.status || "active",
      appointment_id: row.appointment_id || "",
      invoice_id: row.invoice_id || "",
      reason: row.reason || "",
    });
    formModal.openModal();
  };

  const submit = () => {
    const payload: AdjustmentPayload = {
      type: form.type,
      amount: Number(form.amount),
      status: form.status,
      reason: form.reason || null,
      appointment_id: form.appointment_id || null,
      invoice_id: form.invoice_id || null,
    };
    if (form.id) update.mutate({ id: form.id, body: payload });
    else create.mutate(payload);
  };

  const saving = create.isPending || update.isPending;

  return (
    <AccountingPageShell
      title="تخفیف‌ها و تعدیلات"
      subtitle="ثبت تخفیف، بستانکار و بدهکار"
      actions={
        <>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <Select
              value={type || "all"}
              onValueChange={(v) => {
                setType(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="نوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                <SelectItem value="discount">تخفیف</SelectItem>
                <SelectItem value="credit">بستانکار</SelectItem>
                <SelectItem value="debit">بدهکار</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status || "all"}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه</SelectItem>
                <SelectItem value="active">
                  {adjustmentStatusLabel("active")}
                </SelectItem>
                <SelectItem value="void">
                  {adjustmentStatusLabel("void")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={openCreate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 ml-2" />
            ثبت تعدیل
          </Button>
        </>
      }
    >
      <div className="w-full flex items-center justify-center min-h-[200px]">
        {isLoading && <PuffLoader size={60} color="#10b981" />}
        {error && <p className="text-rose-500">خطا در دریافت تعدیلات</p>}
        {data && (
          <Table
            data={data.data || []}
            columns={columns}
            currentPage={data.meta?.current_page || page}
            pageSize={data.meta?.per_page || 15}
            totalItems={data.meta?.total || 0}
            onPageChange={setPage}
            showActions
            onEdit={openEdit}
            onDelete={(item: any) => {
              setSelectedId(item.id);
              deleteModal.openModal();
            }}
          />
        )}
      </div>

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        className="max-w-lg w-[calc(100%-1.5rem)] sm:mx-4 shadow-xl"
      >
        <div className="p-4 sm:p-6 md:p-8 space-y-5 w-full max-h-[85vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {form.id ? "ویرایش تعدیل" : "ثبت تعدیل جدید"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع</Label>
              <Select
                value={form.type}
                onValueChange={(v: any) =>
                  setForm((p) => ({ ...p, type: v }))
                }
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">تخفیف</SelectItem>
                  <SelectItem value="credit">بستانکار</SelectItem>
                  <SelectItem value="debit">بدهکار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select
                value={form.status || "active"}
                onValueChange={(v: any) =>
                  setForm((p) => ({ ...p, status: v }))
                }
              >
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="void">باطل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>مبلغ</Label>
              <Input
                type="number"
                min={1}
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: Number(e.target.value) }))
                }
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>شناسه نوبت (اختیاری)</Label>
              <Input
                value={form.appointment_id || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, appointment_id: e.target.value }))
                }
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>شناسه فاکتور (اختیاری)</Label>
              <Input
                value={form.invoice_id || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    invoice_id: e.target.value,
                  }))
                }
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>دلیل</Label>
              <Textarea
                value={form.reason || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, reason: e.target.value }))
                }
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={formModal.closeModal}
            >
              انصراف
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
              disabled={saving || !form.amount || form.amount < 1}
              onClick={submit}
            >
              {saving ? "در حال ذخیره…" : "ذخیره"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal}>
        <DeleteModal
          onCancel={deleteModal.closeModal}
          isDeleting={remove.isPending}
          deleteFn={() => remove.mutate(selectedId)}
        />
      </Modal>
    </AccountingPageShell>
  );
}
