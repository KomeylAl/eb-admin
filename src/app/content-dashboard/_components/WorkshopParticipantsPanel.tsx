"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import { useModal } from "@/hooks/useModal";
import {
  useApproveWorkshopParticipant,
  useDeleteParticipant,
  useWorkshopParticipants,
} from "@/hooks/useWorkshops";
import { PuffLoader } from "react-spinners";
import AddParticipantForm from "./AddParticipantForm";
import EditParticipantForm from "./EditParticipantForm";

const WorkshopParticipantsPanel = ({ workshopId }: { workshopId: string }) => {
  const { data, isLoading, refetch } = useWorkshopParticipants(workshopId);
  const participants = data?.data ?? [];
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState("");

  const {
    isOpen: addOpen,
    openModal: openAdd,
    closeModal: closeAdd,
  } = useModal();
  const {
    isOpen: editOpen,
    openModal: openEdit,
    closeModal: closeEdit,
  } = useModal();
  const {
    isOpen: deleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();

  const refresh = () => {
    refetch();
  };

  const { mutate: deleteParticipant, isPending: deleting } =
    useDeleteParticipant(workshopId, () => {
      closeDelete();
      refresh();
    });

  const { mutate: setApproved, isPending: toggling } =
    useApproveWorkshopParticipant(workshopId, refresh);

  const genderLabel = (g?: string) =>
    g === "male" ? "مرد" : g === "female" ? "زن" : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-lg">شرکت‌کنندگان</h3>
          <p className="text-sm text-muted-foreground mt-1">
            ثبت‌نام‌ها را ببینید، تأیید کنید، ویرایش کنید یا شرکت‌کننده جدید
            اضافه کنید.
          </p>
        </div>
        <Button onClick={openAdd}>افزودن شرکت‌کننده</Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <PuffLoader size={48} color="#3e86fa" />
        </div>
      )}

      {!isLoading && participants.length === 0 && (
        <p className="rounded-xl border bg-white p-6 text-sm text-muted-foreground dark:bg-gray-800">
          هنوز شرکت‌کننده‌ای برای این کارگاه ثبت نشده است.
        </p>
      )}

      <div className="space-y-3">
        {participants.map((p: any) => {
          const approved = Boolean(p.approved);
          return (
            <div
              key={p.id}
              className="rounded-xl border bg-white p-4 dark:bg-gray-800 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{p.name}</p>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      approved
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {approved ? "تأیید شده" : "در انتظار تأیید"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {p.english_name || p.name_en || "—"} · {genderLabel(p.gender)}
                </p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {p.phone || "—"} · {p.national_code || "—"}
                </p>
                {(p.registered_at || p.joined_at) && (
                  <p className="text-xs text-muted-foreground">
                    {p.registered_at
                      ? `ثبت‌نام: ${String(p.registered_at).slice(0, 10)}`
                      : ""}
                    {p.joined_at
                      ? ` · عضویت: ${String(p.joined_at).slice(0, 10)}`
                      : ""}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={approved ? "outline" : "default"}
                  disabled={toggling}
                  onClick={() =>
                    setApproved({
                      participantId: p.id,
                      approved: !approved,
                    })
                  }
                >
                  {approved ? "لغو تأیید" : "تأیید"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing({
                      ...p,
                      name_en: p.english_name || p.name_en || "",
                      approved: Boolean(p.approved),
                    });
                    openEdit();
                  }}
                >
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setDeleteId(p.id);
                    openDelete();
                  }}
                >
                  حذف
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={addOpen}
        onClose={closeAdd}
        className="max-w-[720px] bg-white"
        showCloseButton
      >
        <AddParticipantForm
          workshopId={workshopId}
          onCloseModal={() => {
            closeAdd();
            refresh();
          }}
        />
      </Modal>

      <Modal
        isOpen={editOpen}
        onClose={() => {
          closeEdit();
          setEditing(null);
        }}
        className="max-w-[720px] bg-white"
        showCloseButton
      >
        {editing && (
          <EditParticipantForm
            workshopId={workshopId}
            participant={editing}
            onCloseModal={() => {
              closeEdit();
              setEditing(null);
              refresh();
            }}
          />
        )}
      </Modal>

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteParticipant(deleteId)}
          isDeleting={deleting}
          onCancel={closeDelete}
          description="این شرکت‌کننده از این کارگاه حذف می‌شود (خود رکورد شرکت‌کننده در سیستم ممکن است برای کارگاه‌های دیگر باقی بماند)."
        />
      </Modal>
    </div>
  );
};

export default WorkshopParticipantsPanel;
