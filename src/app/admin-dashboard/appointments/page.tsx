"use client";

import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import IconButton from "@/components/ui/IconButton";
import { BiPlus } from "react-icons/bi";
import persian from "react-date-object/calendars/persian";
import DatePicker, { DateObject } from "react-multi-date-picker";
import fa from "react-date-object/locales/persian_fa";
import { useAppointments, useDeleteAppointment } from "@/hooks/useAppointments";
import { useModal } from "@/hooks/useModal";
import { debounce } from "lodash";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { appointmentColumns } from "@/lib/columns";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import AddAppForm from "../_components/forms/StoreAppForm";
import UpdateAppForm from "../_components/forms/UpdateAppForm";
import { AppointmentApiType } from "../../../../types/appointmentTypes";
import DeleteModal from "@/components/common/DeleteModal";

const Appinments = () => {
  const [value, setValue] = useState<DateObject>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [appId, setAppId] = useState("0");
  const [appointment, setAppointment] = useState<AppointmentApiType>();

  const baseDate = value
    ? value.toDate().toISOString().slice(0, 19).replace("T", " ").slice(0, 10)
    : "";

  const {
    data: baseData,
    isLoading: baseLoading,
    error: baseError,
    refetch,
  } = useAppointments(page, pageSize, search, baseDate);

  const { mutate: deleteAppointment, isPending: isDeleting } =
    useDeleteAppointment(() => {
      closeModal();
      refetch();
    });

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: addModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
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
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:items-center lg:justify-between">
          <h2 className="font-bold text-2xl">نوبت ها</h2>

          <div className="flex md:flex-row flex-col items-start gap-3">
            <IconButton
              icon={<BiPlus className="text-white" size={20} />}
              size="sm"
              className="cursor-pointer"
              onClick={openAddModal}
            />
            <DatePicker
              inputClass="py-2 bg-blue-600 rounded-md text-white text-center placeholder-white"
              placeholder="انتخاب تاریخ"
              calendar={persian}
              locale={fa}
              value={value}
              format="YYYY-MM-DD"
              onChange={(date: any) => {
                setValue(date);
                refetch();
              }}
            />
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center mt-8">
          {baseLoading && <PuffLoader size={60} color="#3e86fa" />}

          {baseError && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-rose-500">خطا در دریافت اطلاعات</p>
            </div>
          )}

          {baseData && (
            <Table
              data={baseData.data}
              columns={appointmentColumns}
              currentPage={baseData.meta.current_page}
              pageSize={baseData.meta.per_page}
              showActions
              totalItems={baseData.meta.total}
              onPageChange={(newPage) => {
                setPage(newPage);
              }}
              onEdit={(item: any) => {
                setAppId(item.referral_id);
                setAppointment(item);
                openEdit();
              }}
              onDelete={(item: any) => {
                setAppId(item.referral_id);
                openDelete();
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
              deleteFn={() => deleteAppointment(appId)}
              isDeleting={isDeleting}
              onCancel={closeDelete}
            />
          </Modal>
          <Modal
            isOpen={addModalOpen}
            onClose={closeAddModal}
            showCloseButton={false}
            className="max-w-[700px] bg-white"
          >
            <AddAppForm
              onCloseModal={closeAddModal}
              onAddedAppointment={() => {
                closeAddModal();
                refetch();
              }}
            />
          </Modal>
          <Modal
            isOpen={editOpen}
            onClose={openEdit}
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
      </div>
    </div>
  );
};

export default Appinments;
