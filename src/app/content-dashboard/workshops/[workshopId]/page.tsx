"use client";

import { Modal } from "@/components/common/Modal";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useWorksop } from "@/hooks/useWorkshops";
import React from "react";
import AddWorkshopSessionForm from "../../_components/AddWorkshopSessionForm";
import AddParticipantForm from "../../_components/AddParticipantForm";

interface Params {
  workshopId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const WorkshopPanel = ({ params }: PageProps) => {
  const { workshopId } = React.use<Params>(params);
  const { data, isLoading, error, refetch } = useWorksop(workshopId);
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: parOpen,
    openModal: openPar,
    closeModal: closePar,
  } = useModal();
  console.log(data);
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="w-full p-12">
        {data && (
          <div className="w-full h-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-2xl">{data.data.title}</h2>
            </div>
            <div className="mt-12 flex-1">
              {/* <Tabs>
                <Tab label="جلسات" defaultTab>
                  <Button size="sm" onClick={openModal}>
                    افزودن جلسه
                  </Button>
                  <WorkshopSessionsTab
                    sessions={data.data.sessions}
                    workshopId={workshopId}
                    onSessionDeleted={() => refetch()}
                  />
                </Tab>
                <Tab label="شرکت کنندگان" defaultTab={false}>
                  <Button size="sm" onClick={openPar}>
                    افزودن شرکت کننده
                  </Button>
                  <WorkshopParticipantsTab
                    onParticipnatChanged={() => refetch()}
                    workshopId={workshopId}
                    participants={data.data.participants}
                  />
                </Tab>
              </Tabs> */}
            </div>
          </div>
        )}

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] bg-white"
          showCloseButton={false}
        >
          <AddWorkshopSessionForm
            workshopId={workshopId}
            onCloseModal={() => {
              closeModal();
              refetch();
            }}
          />
        </Modal>

        <Modal
          isOpen={parOpen}
          onClose={closePar}
          className="max-w-[700px] bg-white"
          showCloseButton={false}
        >
          <AddParticipantForm
            workshopId={workshopId}
            onCloseModal={() => {
              closePar();
              refetch();
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default WorkshopPanel;
