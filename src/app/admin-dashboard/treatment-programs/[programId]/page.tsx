"use client";

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import WithRole from "../../_components/WithRole";
import {
  useDeleteTreatmentProgram,
  useProgramMedicalRecord,
  useTreatmentProgram,
  useUpdateHomework,
  useUpdateTreatmentProgram,
} from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import TransitionLink from "@/components/ui/TransitionLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientRecord from "../../_components/tabs/ClientRecord";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/custom/Combobox";
import { treatmentProgramStatusOptions } from "@/lib/selectOptions";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import {
  convertBaseDate,
  convertHomeworkStatus,
  convertTreatmentProgramStatus,
  dateConvert,
} from "@/lib/utils";
import { DateObject } from "react-multi-date-picker";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import { useRouter } from "next/navigation";
import DoctorCombobox from "@/components/ui/custom/DoctorCombobox";

interface Params {
  programId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const ProgressCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="rounded-xl border bg-white p-4 dark:bg-gray-800">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
    {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
  </div>
);

const AdminTreatmentProgramDetailPage = ({ params }: PageProps) => {
  const router = useRouter();
  const { programId } = React.use(params);
  const { data, isLoading, error, refetch } = useTreatmentProgram(programId);
  const program = data?.data;

  const {
    data: recordPayload,
    isLoading: recordLoading,
    refetch: refetchRecord,
  } = useProgramMedicalRecord(programId);

  const { mutate: updateProgram, isPending: updating } =
    useUpdateTreatmentProgram(() => {
      refetch();
      refetchRecord();
    });
  const { mutate: updateHomework } = useUpdateHomework(() => refetch());
  const {
    isOpen: deleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();
  const { mutate: deleteProgram, isPending: isDeleting } =
    useDeleteTreatmentProgram(() => {
      closeDelete();
      router.push("/admin-dashboard/treatment-programs");
    });

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("active");
  const [doctorId, setDoctorId] = useState("");
  const [doctorLabel, setDoctorLabel] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [endedAt, setEndedAt] = useState("");

  useEffect(() => {
    if (!program) return;
    setTitle(program.title || "");
    setStatus(program.status || "active");
    setDoctorId(program.doctor_id || program.doctor?.id || "");
    setDoctorLabel(program.doctor?.name || "");
    setStartedAt(program.started_at || "");
    setEndedAt(program.ended_at || "");
  }, [program]);

  const appointments = program?.appointments ?? [];
  const progress = program?.progress;

  const homeworks = useMemo(
    () =>
      appointments.flatMap((app: any) =>
        (app.homeworks ?? []).map((hw: any) => ({
          ...hw,
          appointment_id: app.id,
          appointment_date: app.date,
          appointment_time: app.time,
        }))
      ),
    [appointments]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <WithRole allowedRoles={["boss", "manager", "receptionist"]}>
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-bold text-2xl">
                {program?.title || "برنامه درمان"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                مراجع: {program?.client?.name || "—"} · درمانگر:{" "}
                {program?.doctor?.name || "—"} · وضعیت:{" "}
                {convertTreatmentProgramStatus(program?.status)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {program?.client?.id && (
                <TransitionLink
                  href={`/admin-dashboard/clients/${program.client.id}`}
                  className="text-blue-600"
                >
                  پنل مراجع
                </TransitionLink>
              )}
              <TransitionLink
                href="/admin-dashboard/treatment-programs"
                className="text-blue-600"
              >
                بازگشت به لیست
              </TransitionLink>
              <Button variant="destructive" size="sm" onClick={openDelete}>
                حذف برنامه
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center py-16">
              <PuffLoader size={60} color="#3e86fa" />
            </div>
          )}

          {error && (
            <p className="text-rose-500 text-center">
              خطا در دریافت برنامه درمان
            </p>
          )}

          {program && !isLoading && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex flex-wrap h-auto">
                <TabsTrigger value="overview">روند درمان</TabsTrigger>
                <TabsTrigger value="info">اطلاعات برنامه</TabsTrigger>
                <TabsTrigger value="record">پرونده پزشکی</TabsTrigger>
                <TabsTrigger value="sessions">جلسات</TabsTrigger>
                <TabsTrigger value="homeworks">تکالیف</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-4 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <ProgressCard
                    label="کل جلسات"
                    value={progress?.sessions_total ?? 0}
                    hint={`${progress?.sessions_done ?? 0} انجام‌شده`}
                  />
                  <ProgressCard
                    label="پیشرفت جلسات"
                    value={`${progress?.sessions_completion_rate ?? 0}%`}
                    hint={`${progress?.sessions_pending ?? 0} در انتظار`}
                  />
                  <ProgressCard
                    label="کل تکالیف"
                    value={progress?.homeworks_total ?? 0}
                    hint={`${progress?.homeworks_done ?? 0} انجام‌شده توسط مراجع`}
                  />
                  <ProgressCard
                    label="انجام تکالیف"
                    value={`${progress?.homeworks_completion_rate ?? 0}%`}
                    hint={`${progress?.homeworks_assigned ?? 0} باز`}
                  />
                </div>
              </TabsContent>

              <TabsContent value="info" className="pt-4">
                <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label>عنوان</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>وضعیت</Label>
                    <Combobox
                      data={treatmentProgramStatusOptions}
                      placeholder="وضعیت"
                      searchPlaceholder="جستجو..."
                      value={status}
                      onChange={(v) => setStatus(String(v))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>درمانگر</Label>
                    <DoctorCombobox
                      value={doctorId}
                      selectedLabel={doctorLabel}
                      onSelectedLabelChange={setDoctorLabel}
                      onChange={setDoctorId}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>تاریخ شروع</Label>
                      <CustomDatePicker
                        value={startedAt ? dateConvert(startedAt) : undefined}
                        onChange={(d: DateObject | null) => {
                          setStartedAt(d ? convertBaseDate(d) : "");
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>تاریخ پایان</Label>
                      <CustomDatePicker
                        value={endedAt ? dateConvert(endedAt) : undefined}
                        onChange={(d: DateObject | null) => {
                          setEndedAt(d ? convertBaseDate(d) : "");
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    disabled={updating}
                    onClick={() =>
                      updateProgram({
                        id: programId,
                        body: {
                          title,
                          status,
                          doctor_id: doctorId || undefined,
                          started_at: startedAt || null,
                          ended_at: endedAt || null,
                        },
                      })
                    }
                  >
                    ذخیره تغییرات
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="record" className="pt-4">
                {recordLoading ? (
                  <div className="flex justify-center py-12">
                    <PuffLoader size={50} color="#3e86fa" />
                  </div>
                ) : (
                  <ClientRecord
                    programId={programId}
                    record={
                      recordPayload?.data?.record ??
                      program.medical_record ??
                      null
                    }
                    onSaved={() => {
                      refetchRecord();
                      refetch();
                    }}
                    key={
                      recordPayload?.data?.record?.updated_at ||
                      program.medical_record?.updated_at ||
                      programId
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value="sessions" className="pt-4 space-y-3">
                {appointments.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    جلسه‌ای برای این برنامه ثبت نشده است.
                  </p>
                )}
                {appointments.map((app: any) => (
                  <div
                    key={app.id}
                    className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">
                        {dateConvert(app.date)} — {app.time}
                      </p>
                      <p className="text-sm">
                        {app.status === "done" ? "انجام‌شده" : "در انتظار"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      اتاق: {app.room?.name || "—"} · تکالیف:{" "}
                      {(app.homeworks ?? []).length}
                    </p>
                    {app.session_notes && (
                      <p className="text-sm whitespace-pre-wrap border-t pt-2">
                        {app.session_notes}
                      </p>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="homeworks" className="pt-4 space-y-3">
                {homeworks.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    تکلیفی ثبت نشده است.
                  </p>
                )}
                {homeworks.map((hw: any) => (
                  <div
                    key={hw.id}
                    className="rounded-xl border bg-white p-4 dark:bg-gray-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium">{hw.title}</p>
                      {hw.body && (
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                          {hw.body}
                        </p>
                      )}
                      <p className="text-xs mt-2 text-muted-foreground">
                        جلسه: {dateConvert(hw.appointment_date)} {hw.appointment_time} ·
                        وضعیت: {convertHomeworkStatus(hw.status)}
                      </p>
                    </div>
                    {hw.status !== "done" && hw.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateHomework({
                            id: hw.id,
                            body: { status: "done" },
                          })
                        }
                      >
                        انجام شد
                      </Button>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </WithRole>

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteProgram(programId)}
          isDeleting={isDeleting}
          onCancel={closeDelete}
          description="با حذف برنامه درمان، پرونده پزشکی، تمام جلسات (نوبت‌ها) و تکالیف مرتبط نیز برای همیشه حذف می‌شوند و قابل بازگشت نیست."
        />
      </Modal>
    </div>
  );
};

export default AdminTreatmentProgramDetailPage;
