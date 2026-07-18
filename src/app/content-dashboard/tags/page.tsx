"use client";

import { Modal } from "@/components/common/Modal";
import React, { useState } from "react";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { tagColumns } from "@/lib/columns";
import { useDeleteTag, useTags } from "@/hooks/useTags";
import { useModal } from "@/hooks/useModal";
import DeleteModal from "@/components/common/DeleteModal";
import Header from "@/components/layout/Header";
import EditTagForm from "../_components/EditTagForm";
import AddTagForm from "../_components/AddTagForm";

const Tags = () => {
  const [page, setPage] = useState(1); // API page از 0 شروع میشه
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [item, setItem] = useState();
  const [id, setId] = useState("");

  const { data, isLoading, error, refetch } = useTags(page, pageSize, search);
  console.log(data);
  const { mutate: deleteTag, isPending } = useDeleteTag(() => {
    closeDelete();
    refetch();
  });
  const { isOpen, openModal, closeModal } = useModal();
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
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch />
      <div className="w-full flex flex-col p-12">
        <div className="w-full h-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl">برچسب ها</h2>
            <div
              onClick={openModal}
              className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              افزودن برچسب
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
                columns={tagColumns}
                currentPage={data.meta.current_page}
                pageSize={data.meta.per_page}
                showActions
                totalItems={data.meta.total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
                onDelete={(item: any) => {
                  setId(item.id);
                  openDelete();
                }}
                onEdit={(item: any) => {
                  setItem(item);
                  openEdit();
                }}
              />
            )}

            <Modal
              showCloseButton={false}
              isOpen={deleteOpen}
              onClose={() => {
                closeDelete();
                refetch();
              }}
              className="max-w-[700px] bg-white"
            >
              <DeleteModal
                deleteFn={() => deleteTag(id)}
                isDeleting={isPending}
                onCancel={() => {
                  closeDelete();
                }}
                description="با حذف برچسب تمامی پست های مربوطه نیز حذف خواهند شد."
              />
            </Modal>

            <Modal
              showCloseButton={false}
              isOpen={editOpen}
              onClose={closeEdit}
              className="max-w-[700px] bg-white max-h-[80%] overflow-y-auto"
            >
              <EditTagForm
                tag={item}
                onCloseModal={() => {
                  closeEdit();
                  refetch();
                }}
              />
            </Modal>
            <Modal
              isOpen={isOpen}
              onClose={closeModal}
              showCloseButton={false}
              className="max-w-[700px] bg-white max-h-[90%] overflow-y-auto"
            >
              <AddTagForm
                onCloseModal={() => {
                  closeModal();
                  refetch();
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tags;
