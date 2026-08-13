"use client";

import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/Modal";
import CreateDoctorForm from "../_components/forms/CreateDoctorForm";
import Header from "@/components/layout/Header";
import UpdateDoctorForm from "../_components/forms/UpdateDoctorForm";
import DeleteModal from "@/components/common/DeleteModal";
import Table from "@/components/common/Table";
import { PuffLoader } from "react-spinners";
import { useCallback, useState } from "react";
import { useDeleteDoctor, useDoctors, useEditDoctor } from "@/hooks/useDoctors";
import { doctorColumns } from "@/lib/columns";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { ListOrdered } from "lucide-react";
import DoctorReorderModal from "../_components/DoctorReorderModal";

const Doctors = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [doctorId, setDoctorId] = useState(0);
  const [doctor, setDoctor] = useState<any>({});

  const { data, isLoading, error, refetch } = useDoctors(
    page,
    pageSize,
    search
  );

  const { mutate: deleteDoctor, isPending: isDeleting } = useDeleteDoctor(() =>
    refetch()
  );

  const { mutate: editDoctor, isPending: isEditting } = useEditDoctor(
    doctorId,
    refetch
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

  const {
    isOpen: reorderOpen,
    openModal: openReorder,
    closeModal: closeReorder,
  } = useModal();

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
      <div className="w-full flex flex-col p-4 sm:p-6 md:p-8">
        <div className="w-full h-full space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-bold text-2xl">متخصصین</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={openReorder}>
                <ListOrdered />
                تغییر ترتیب
              </Button>
              <div
                onClick={openModal}
                className="px-12 py-2 bg-blue-600 rounded-md text-white text-center cursor-pointer"
              >
                افزودن متخصص
              </div>
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
                columns={doctorColumns}
                currentPage={data.meta.current_page}
                pageSize={data.meta.per_page}
                showActions
                totalItems={data.meta.total}
                onPageChange={(newPage) => {
                  setPage(newPage);
                }}
                onDelete={(item: any) => {
                  setDoctorId(item.id);
                  openDelete();
                }}
                onEdit={(item: any) => {
                  setDoctorId(item.id);
                  setDoctor(item);
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
                deleteFn={() => {
                  deleteDoctor(doctorId);
                  closeDelete();
                }}
                isDeleting={isDeleting}
                onCancel={closeDelete}
              />
            </Modal>

            <Modal
              showCloseButton={false}
              isOpen={editOpen}
              onClose={closeEdit}
              className="max-w-[700px] bg-white max-h-[90%] overflow-y-auto"
            >
              <UpdateDoctorForm
                doctor={doctor}
                onCloseModal={closeEdit}
                onDoctorEditted={() => {
                  closeEdit();
                  refetch();
                }}
              />
            </Modal>

            <Modal
              showCloseButton={false}
              isOpen={reorderOpen}
              onClose={closeReorder}
              className="max-w-[560px] bg-white max-h-[90%] overflow-y-auto"
            >
              <DoctorReorderModal
                onClose={closeReorder}
                onSaved={() => refetch()}
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
        <CreateDoctorForm
          onCloseModal={closeModal}
          onDoctorAdded={() => {
            closeModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default Doctors;
