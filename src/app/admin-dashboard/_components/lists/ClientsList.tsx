"use client";

import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { useClients, useDeleteClient } from "@/hooks/useClients";
import { useModal } from "@/hooks/useModal";
import Table from "@/components/common/Table";
import type { Column } from "@/components/common/Table";
import { clientColumns } from "@/lib/columns";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import { ClientApiType } from "../../../../../types/clientTypes";
import UpdateClientForm from "../forms/UpdateClientForm";
import CreateClientForm from "../forms/CreateClientForm";

export const ClientsList = ({ compact = false }: { compact?: boolean }) => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(compact ? 5 : 10);
  const [search] = useState("");

  const [clientId, setClientId] = useState("0");
  const [client, setClient] = useState<ClientApiType>();

  const { data, isLoading, error, refetch } = useClients(
    page,
    pageSize,
    search
  );

  const {
    isOpen: deleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();

  const {
    isOpen: editOpen,
    openModal: openEdit,
    closeModal: closeEdit,
  } = useModal();
  const { isOpen, openModal, closeModal } = useModal();

  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient(
    () => {
      closeDelete();
      refetch();
    }
  );

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
        خطا در دریافت مراجعان
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-10 text-sm text-muted-foreground">
        <p>مراجعی ثبت نشده است</p>
        {!compact && (
          <button
            onClick={openModal}
            className="text-primary hover:underline"
          >
            افزودن مراجع
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table
        data={data.data}
        columns={clientColumns as Column<ClientApiType>[]}
        currentPage={data.meta?.current_page ?? page}
        pageSize={data.meta?.per_page ?? pageSize}
        showActions
        totalItems={data.meta?.total ?? data.data.length}
        onPageChange={(newPage) => setPage(newPage)}
        onDelete={(item: ClientApiType) => {
          setClientId(String(item.id));
          openDelete();
        }}
        onEdit={(item: ClientApiType) => {
          setClient(item);
          openEdit();
        }}
      />

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteClient(clientId)}
          isDeleting={isDeleting}
          onCancel={closeDelete}
          description="با حذف مراجع تمامی نوبت ها، ارزیابی ها و پرونده مراجع نیز حدف میگردد."
        />
      </Modal>

      <Modal
        showCloseButton={false}
        isOpen={editOpen}
        onClose={closeEdit}
        className="max-w-[700px] bg-white"
      >
        <UpdateClientForm
          client={client!}
          onClientUpdated={() => {
            closeEdit();
            refetch();
          }}
          onCloseModal={closeEdit}
        />
      </Modal>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] bg-white"
        showCloseButton={false}
      >
        <CreateClientForm
          onClientCreated={() => {
            closeModal();
            refetch();
          }}
          onCloseModal={closeModal}
        />
      </Modal>
    </div>
  );
};
