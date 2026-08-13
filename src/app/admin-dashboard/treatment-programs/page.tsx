"use client";

import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import WithRole from "../_components/WithRole";
import {
  useDeleteTreatmentProgram,
  useTreatmentPrograms,
} from "@/hooks/useTreatmentPrograms";
import { debounce } from "lodash";
import { PuffLoader } from "react-spinners";
import Table from "@/components/common/Table";
import { treatmentProgramColumns } from "@/lib/columns";
import { Combobox } from "@/components/ui/custom/Combobox";
import { treatmentProgramStatusOptions } from "@/lib/selectOptions";
import DoctorCombobox from "@/components/ui/custom/DoctorCombobox";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import { useRouter } from "next/navigation";

const TreatmentProgramsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const { data, isLoading, error, refetch } = useTreatmentPrograms({
    page,
    pageSize,
    search,
    status,
    doctorId,
  });

  const {
    isOpen: deleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();

  const { mutate: deleteProgram, isPending: isDeleting } =
    useDeleteTreatmentProgram(() => {
      closeDelete();
      refetch();
    });

  const debouncedSearch = useCallback(
    debounce(() => {
      setPage(1);
      refetch();
    }, 300),
    [refetch]
  );

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
    debouncedSearch();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={onSearchChange} isShowSearch />
      <WithRole allowedRoles={["boss", "manager", "receptionist"]}>
        <div className="w-full flex flex-col p-4 sm:p-6 md:p-8 space-y-6">
          <h2 className="font-bold text-2xl">برنامه‌های درمان</h2>

          <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Combobox
                data={[
                  { value: "", label: "همه وضعیت‌ها" },
                  ...treatmentProgramStatusOptions,
                ]}
                placeholder="فیلتر وضعیت"
                searchPlaceholder="جستجو..."
                value={status}
                onChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>درمانگر</Label>
              <DoctorCombobox
                value={doctorId}
                onChange={(v) => {
                  setDoctorId(v);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center">
            {isLoading && <PuffLoader size={60} color="#3e86fa" />}
            {error && (
              <p className="text-rose-500">خطا در دریافت برنامه‌های درمان</p>
            )}
            {data && (
              <Table
                data={data.data ?? []}
                columns={treatmentProgramColumns}
                currentPage={data.meta?.current_page ?? page}
                pageSize={data.meta?.per_page ?? pageSize}
                totalItems={data.meta?.total ?? 0}
                onPageChange={setPage}
                showActions
                onEdit={(item: any) =>
                  router.push(`/admin-dashboard/treatment-programs/${item.id}`)
                }
                onDelete={(item: any) => {
                  setDeleteId(String(item.id));
                  openDelete();
                }}
              />
            )}
          </div>
        </div>
      </WithRole>

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteProgram(deleteId)}
          isDeleting={isDeleting}
          onCancel={closeDelete}
          description="با حذف برنامه درمان، پرونده پزشکی، تمام جلسات (نوبت‌ها) و تکالیف مرتبط نیز برای همیشه حذف می‌شوند و قابل بازگشت نیست."
        />
      </Modal>
    </div>
  );
};

export default TreatmentProgramsPage;
