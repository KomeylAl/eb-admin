"use client";

import React, { useMemo, useState } from "react";
import { useClient } from "@/hooks/useClients";
import {
  useProgramMedicalRecord,
  useTreatmentPrograms,
} from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import ErrorComponent from "@/components/layout/ErrorComponent";
import Header from "@/components/layout/Header";
import WithRole from "../../_components/WithRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInfoTab from "../../_components/tabs/ClientInfoTab";
import ClientRecord from "../../_components/tabs/ClientRecord";
import { Button } from "@/components/ui/button";

interface Params {
  clientId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const ClientPage = ({ params }: PageProps) => {
  const { clientId } = React.use<Params>(params);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");

  const {
    data: client,
    isLoading,
    error,
    refetch,
  } = useClient(clientId);

  const { data: programsPayload, isLoading: programsLoading } =
    useTreatmentPrograms({ clientId });

  const programs = programsPayload?.data ?? [];

  const activeProgramId = useMemo(() => {
    if (selectedProgramId) return selectedProgramId;
    return programs[0]?.id ? String(programs[0].id) : "";
  }, [programs, selectedProgramId]);

  const {
    data: recordPayload,
    isLoading: recordLoading,
    refetch: refetchRecord,
  } = useProgramMedicalRecord(activeProgramId);

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <WithRole allowedRoles={["boss", "manager", "receptionist"]}>
        <div className="w-full h-full p-6 md:p-12">
          <div className="flex-1 space-y-8">
            {(isLoading || programsLoading) && (
              <div className="w-full h-64 flex items-center justify-center">
                <PuffLoader size={60} color="#3e86fa" />
              </div>
            )}

            {client?.data && !isLoading && (
              <div className="space-y-6">
                <h2 className="font-bold text-2xl">
                  پنل مراجع {client.data?.name}
                </h2>

                <Tabs defaultValue="info" className="w-full">
                  <TabsList>
                    <TabsTrigger value="info">اطلاعات شخصی</TabsTrigger>
                    <TabsTrigger value="programs">برنامه‌های درمان</TabsTrigger>
                    <TabsTrigger value="record">پرونده پزشکی</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="pt-4">
                    <ClientInfoTab client={client.data} />
                  </TabsContent>

                  <TabsContent value="programs" className="pt-4 space-y-3">
                    {programs.length === 0 && (
                      <p className="text-muted-foreground text-sm">
                        هنوز برنامه درمانی ثبت نشده. هنگام ثبت نوبت می‌توانید
                        برنامه بسازید.
                      </p>
                    )}
                    {programs.map((program: any) => (
                      <div
                        key={program.id}
                        className="flex items-center justify-between rounded-md border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            {program.title || "برنامه درمان"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            درمانگر: {program.doctor?.name || "—"} · وضعیت:{" "}
                            {program.status}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedProgramId(String(program.id));
                          }}
                        >
                          انتخاب برای پرونده
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="record" className="pt-4 space-y-4">
                    {programs.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {programs.map((program: any) => (
                          <Button
                            key={program.id}
                            size="sm"
                            variant={
                              activeProgramId === String(program.id)
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setSelectedProgramId(String(program.id))
                            }
                          >
                            {program.title || program.doctor?.name || "برنامه"}
                          </Button>
                        ))}
                      </div>
                    )}

                    {!activeProgramId && (
                      <p className="text-sm text-muted-foreground">
                        ابتدا یک برنامه درمان انتخاب یا ایجاد کنید.
                      </p>
                    )}

                    {activeProgramId && recordLoading && (
                      <div className="flex justify-center py-12">
                        <PuffLoader size={50} color="#3e86fa" />
                      </div>
                    )}

                    {activeProgramId && !recordLoading && (
                      <ClientRecord
                        programId={activeProgramId}
                        record={recordPayload?.data?.record ?? null}
                        onSaved={() => refetchRecord()}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {error && <ErrorComponent refetch={refetch} />}
          </div>
        </div>
      </WithRole>
    </div>
  );
};

export default ClientPage;
