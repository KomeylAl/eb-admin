"use client";

import { useAssessments, useDeleteAssessment } from "@/hooks/useAssessments";
import { useModal } from "@/hooks/useModal";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { assessmentsColumns } from "@/lib/columns";
import toast from "react-hot-toast";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import Header from "@/components/layout/Header";
import StoreAssessmentForm from "../_components/forms/StoreAssessmentForm";
import UpdateAssessmentForm from "../_components/forms/UpdateAssessment";

const Assessments = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [assessmentId, setAssessmentId] = useState("");
  const [assessment, setAssessment] = useState<any>({});

  const { data, isLoading, error, refetch } = useAssessments(
    page,
    pageSize,
    search
  );
  console.log(data);
  const { mutate: deleteAssessment, isPending: isDeleting } =
    useDeleteAssessment(() => {
      closeDelete();
      refetch();
    });

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
            <h2 className="font-bold text-2xl">ارزیابی ها</h2>
            <div
              onClick={openModal}
              className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              افزودن ارزیابی
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
                columns={assessmentsColumns}
                currentPage={data.meta.current_page}
                pageSize={data.meta.per_page}
                showActions
                totalItems={data.meta.total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
                onDelete={(item: any) => {
                  setAssessmentId(item.id);
                  openDelete();
                }}
                onEdit={(item: any) => {
                  setAssessmentId(item.id);
                  setAssessment(item);
                  openEdit();
                }}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteAssessment(assessmentId)}
          isDeleting={isDeleting}
          onCancel={() => closeDelete()}
        />
      </Modal>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] bg-white"
        showCloseButton={false}
      >
        <StoreAssessmentForm
          onSuccess={() => {
            closeModal();
            refetch();
          }}
        />
      </Modal>
      <Modal
        isOpen={editOpen}
        onClose={closeEdit}
        className="max-w-[700px] bg-white"
        showCloseButton={false}
      >
        <UpdateAssessmentForm
          assessment={assessment}
          onSuccess={() => {
            closeEdit();
            refetch();
          }}
        />
      </Modal>
    </div>
  );
};

export default Assessments;
