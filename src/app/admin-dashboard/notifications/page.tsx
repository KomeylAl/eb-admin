"use client";

import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Notifications = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="w-full flex flex-col p-12">
        <div className="w-full h-full space-y-6">
          <h2 className="font-bold text-2xl">اعلانات</h2>
          <Tabs defaultValue="all" className="w-full overflow-x-auto">
            <TabsList className="gap-4">
              <TabsTrigger value="all" defaultChecked>
                همه اعلانات
              </TabsTrigger>
              <TabsTrigger value="unread">خوانده نشده</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="w-full">
              <div></div>
            </TabsContent>
            <TabsContent value="unread" className="w-full">
              <div></div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
