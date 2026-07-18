"use client";

import React, { useState } from "react";
import { useClient } from "@/hooks/useClients";
import { PuffLoader } from "react-spinners";
import ErrorComponent from "@/components/layout/ErrorComponent";
import Header from "@/components/layout/Header";
import WithRole from "../../_components/WithRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Params {
  clientId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const ClientPage = ({ params }: PageProps) => {
  const { clientId } = React.use<Params>(params);

  const { data: client, isLoading, error, refetch } = useClient(clientId);
  console.log(client);

  const [formData, setFormData] = useState({
    doctor_id: 0,
    supervisor_id: 0,
    admin_id: 0,
    record_number: "",
    reference_source: "",
    admission_date: "",
    visit_date: "",
    chief_complaints: "",
    present_illness: "",
    past_history: "",
    family_history: "",
    personal_history: "",
    mse: "",
    diagnosis: "",
    companion_name: "",
    companion_phone: "",
    companion_address: "",
  });

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // اضافه کردن داده‌های متنی
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") {
        formDataToSend.append(key, value as string);
      }
    });
  };
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <WithRole allowedRoles={["boss", "manager"]}>
        <div className="w-full h-full p-12">
          <div className="flex-1">
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center">
                <PuffLoader size={60} color="#3e86fa" />
              </div>
            )}
            {client?.data && (
              <div className="mt-12 flex-1">
                {/* <Tabs defaultValue="sevenDays" className="w-full overflow-x-auto">
                <TabsList className="gap-4">
                  <TabsTrigger value="info">
                    اطلاعات شخصی
                  </TabsTrigger>
                  <TabsTrigger value="record">
                    پرونده پزشکی
                  </TabsTrigger>
                  <TabsTrigger value="apps">نوبت ها</TabsTrigger>
                  <TabsTrigger value="ass">ارزیابی ها</TabsTrigger>
                  <TabsTrigger value="pays">پرداخت ها</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="w-full">
                  <ClientInfoTab client={client.data} />
                </TabsContent>
                <TabsContent value="record" className="w-full">
                  <ClientRecord
                        record={client.data.record}
                        clientId={clientId}
                      />
                </TabsContent>
                <TabsContent value="apss" className="w-full">
                  <ClientAppointmentsTab clientId={clientId} />
                </TabsContent>
                <TabsContent value="ass" className="w-full">
                  <ClientAssessmentsTab clientId={clientId} />
                </TabsContent>
                <TabsContent value="pays" className="w-full">
                  <ClientPaymentsTab clientId={clientId} />
                </TabsContent>
              </Tabs> */}
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
