"use client";

import { Modal } from "@/components/common/Modal";
import { useDeleteDepartment, useDepartments } from "@/hooks/useDepartments";
import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import DeleteModal from "@/components/common/DeleteModal";
import Table from "@/components/common/Table";
import { departmentColumns } from "@/lib/columns";
import { PuffLoader } from "react-spinners";
import Header from "@/components/layout/Header";
import EditDepartmentForm from "../_components/EditDepartmentForm";
import AddDepartmentForm from "../_components/AddDepartmentForm";

const Departments = () => {
  const [page, setPage] = useState(1); // API page از 0 شروع میشه
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [item, setItem] = useState();
  const [slug, setSlug] = useState("");

  const { data, isLoading, error, refetch } = useDepartments(
    page,
    pageSize,
    search
  );
  console.log(data);
  const { mutate: deleteDepartment, isPending } = useDeleteDepartment(() => {
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
            <h2 className="font-bold text-2xl">دپارتمان ها</h2>
            <div
              onClick={openModal}
              className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              افزودن دپارتمان
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
                columns={departmentColumns}
                currentPage={data.meta.current_page}
                pageSize={data.meta.per_page}
                showActions
                totalItems={data.meta.total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
                onDelete={(item: any) => {
                  setSlug(item.slug);
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
                deleteFn={() => deleteDepartment(slug)}
                isDeleting={isPending}
                onCancel={() => {
                  closeDelete();
                }}
              />
            </Modal>

            <Modal
              showCloseButton={false}
              isOpen={editOpen}
              onClose={closeEdit}
              className="max-w-[700px] bg-white max-h-[80%] overflow-y-auto"
            >
              <EditDepartmentForm
                department={item}
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
              className="max-w-[700px] bg-white"
            >
              <AddDepartmentForm
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

export default Departments;
