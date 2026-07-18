"use client";

import { Modal } from "@/components/common/Modal";
import { useCallback, useState } from "react";
import { debounce } from "lodash";
import { useModal } from "@/hooks/useModal";
import { useClients, useDeleteClient } from "@/hooks/useClients";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { clientColumns } from "@/lib/columns";
import Header from "@/components/layout/Header";
import CreateClientForm from "../_components/forms/CreateClientForm";
import UpdateClientForm from "../_components/forms/UpdateClientForm";
import { ClientApiType } from "../../../../types/clientTypes";
import DeleteModal from "@/components/common/DeleteModal";

const Clients = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [clientId, setClientId] = useState("0");
  const [client, setClient] = useState<ClientApiType>();

  const { data, isLoading, error, refetch } = useClients(
    page,
    pageSize,
    search
  );

  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient(
    () => {
      closeDelete();
      refetch();
    }
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

  const debouncedSearch = useCallback(
    debounce((text) => {
      refetch();
    }, 300),
    [refetch]
  );

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={onSearchChange} isShowSearch />
      <div className="w-full flex flex-col p-12">
        <div className="w-full h-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl">مراجعان</h2>
            <div
              onClick={openModal}
              className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              افزودن مراجع
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            {isLoading && <PuffLoader size={60} color="#3e86fa" />}

            {error && (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-rose-500">خطا در دریافت اطلاعات</p>
              </div>
            )}

            {data && (
              <Table
                data={data.data}
                columns={clientColumns}
                currentPage={data.meta.current_page}
                pageSize={data.meta.per_page}
                showActions
                totalItems={data.meta.total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
                onDelete={(item: any) => {
                  setClientId(item.id);
                  openDelete();
                }}
                onEdit={(item: any) => {
                  setClient(item);
                  openEdit();
                }}
              />
            )}

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
          </div>
        </div>
      </div>
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

export default Clients;
