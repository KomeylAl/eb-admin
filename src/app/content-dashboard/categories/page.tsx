"use client";

import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { categoryColumns } from "@/lib/columns";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import Header from "@/components/layout/Header";
import EditCategoryForm from "../_components/EditCategoryForm";
import AddCategoryForm from "../_components/AddCategoryForm";

const Categories = () => {
  const [page, setPage] = useState(1); // API page از 0 شروع میشه
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [item, setItem] = useState();
  const [id, setId] = useState("");

  const { data, isLoading, error, refetch } = useCategories(
    page,
    pageSize,
    search
  );
  console.log(data);
  const { mutate: deleteCategory, isPending } = useDeleteCategory(() => {
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
            <h2 className="font-bold text-2xl">دسته بندی ها</h2>
            <div
              onClick={openModal}
              className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              افزودن دسته بندی
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
                columns={categoryColumns}
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
                deleteFn={() => deleteCategory(id)}
                isDeleting={isPending}
                onCancel={() => {
                  closeDelete();
                }}
                description="با حذف دسته بندی تمامی پست های مربوطه نیز حذف خواهند شد."
              />
            </Modal>

            <Modal
              showCloseButton={false}
              isOpen={editOpen}
              onClose={closeEdit}
              className="max-w-[700px] bg-white max-h-[80%] overflow-y-auto"
            >
              <EditCategoryForm
                category={item}
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
              <AddCategoryForm
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

export default Categories;
