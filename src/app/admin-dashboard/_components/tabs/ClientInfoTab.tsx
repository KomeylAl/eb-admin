"use client";

import Label from "@/components/ui/custom/Label";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { Input } from "@/components/ui/input";
import { dateConvert } from "@/lib/utils";

interface ClientInfoTabProps {
  client: any;
}

const ClientInfoTab = ({ client }: ClientInfoTabProps) => {
  if (!client) return null;

  return (
    <div className="space-y-4">
      <div className="w-full grid gap-3 md:grid-cols-2">
        <div>
          <Label>نام و نام خانوادگی</Label>
          <Input value={client.name || ""} readOnly className="bg-white" />
        </div>
        <div>
          <Label>شماره تلفن</Label>
          <Input value={client.phone || ""} readOnly className="bg-white" />
        </div>
        <div>
          <Label>تاریخ تولد</Label>
          <CustomDatePicker
            value={client.birth_date ? dateConvert(client.birth_date) : ""}
          />
        </div>
        <div>
          <Label>آدرس</Label>
          <Input value={client.address || ""} readOnly className="bg-white" />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoTab;
