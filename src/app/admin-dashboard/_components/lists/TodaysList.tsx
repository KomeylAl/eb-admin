"use client";

import { PuffLoader } from "react-spinners";
import { useAppointments, useDeleteAppointment } from "@/hooks/useAppointments";
import Table from "@/components/common/Table";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/Modal";
import { appointmentColumns } from "@/lib/columns";
import DeleteModal from "@/components/common/DeleteModal";
import { useState } from "react";
import { AppointmentApiType } from "../../../../../types/appointmentTypes";
import UpdateAppForm from "../forms/UpdateAppForm";
import { getLocalDateKey } from "@/lib/dashboard";

const ToDaysList = ({ compact = false }: { compact?: boolean }) => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(compact ? 5 : 10);
  const date = getLocalDateKey();
  const { data, isLoading, error, refetch } = useAppointments(
    page,
    pageSize,
    "",
    date
  );
  const [appId, setAppId] = useState("0");
  const [appointment, setAppointment] = useState<AppointmentApiType>();

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

  const { mutate: deleteAppointment, isPending: isDeleting } =
    useDeleteAppointment(() => {
      closeDelete();
      refetch();
    });

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <PuffLoader size={48} color="#3e86fa" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8 text-rose-500 text-sm">
        خطا در دریافت نوبت‌های امروز
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="w-full flex items-center justify-center py-10 text-sm text-muted-foreground">
        نوبتی برای امروز ثبت نشده است
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table
        data={data.data}
        columns={appointmentColumns}
        currentPage={data.meta?.current_page ?? page}
        pageSize={data.meta?.per_page ?? pageSize}
        showActions
        totalItems={data.meta?.total ?? data.data.length}
        onPageChange={(newPage) => setPage(newPage)}
        onEdit={(item: AppointmentApiType) => {
          setAppId(String(item.id));
          setAppointment(item);
          openEdit();
        }}
        onDelete={(item: AppointmentApiType) => {
          setAppId(String(item.id));
          openDelete();
        }}
      />

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteAppointment(appId)}
          isDeleting={isDeleting}
          onCancel={closeDelete}
        />
      </Modal>
      <Modal
        isOpen={editOpen}
        onClose={closeEdit}
        showCloseButton={false}
        className="max-w-[700px] bg-white"
      >
        <UpdateAppForm
          onCloseModal={() => {
            closeEdit();
            refetch();
          }}
          appId={appId}
          appointment={appointment!}
        />
      </Modal>
    </div>
  );
};

export default ToDaysList;
