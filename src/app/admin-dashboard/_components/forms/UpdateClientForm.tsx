"use client";

import { Button } from "@/components/ui/button";
import { useUpdateClient } from "@/hooks/useClients";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientSchema } from "@/validations";
import { Input } from "@/components/ui/input";
import { ClientApiType, clientType } from "../../../../../types/clientTypes";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { DateObject } from "react-multi-date-picker";

interface UpdateClientFormProps {
  client: ClientApiType;
  onClientUpdated: () => void;
  onCloseModal: () => void;
}

const UpdateClientForm = ({
  client,
  onClientUpdated,
  onCloseModal,
}: UpdateClientFormProps) => {
  const { mutate: createClient, isPending } = useUpdateClient(onClientUpdated);
  const [birthDate, setBirhtDate] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      address: client?.address ?? "",
      birth_date: client?.birth_date ?? "",
      name: client?.name ?? "",
      phone: client?.phone ?? "",
    },
  });

  const onSubmit = (data: clientType) => {
    createClient({ data, clientId: client.id });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
    >
      <h2 className="text-xl font-semibold">ویرایش مراجع</h2>

      <div className="w-full flex items-center gap-4">
        <div className="w-full">
          <label>نام و نام خانوادگی</label>
          <Input
            {...register("name")}
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="w-full">
          <label>تلفن</label>
          <Input
            {...register("phone")}
            type="number"
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="w-full flex items-center gap-4">
        <div className="w-full">
          <label>آدرس</label>
          <Input
            {...register("address")}
            type="text"
            className="w-full bg-white py-2 rounded-md  px-2 mt-2"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>
        <div className="w-full">
          <label>تاریخ تولد</label>
          <div className="w-full mt-2">
            <CustomDatePicker
              value={dateConvert(birthDate)}
              onChange={(date: DateObject | null) => {
                setBirhtDate(date!.toString());
                setValue("birth_date", convertBaseDate(date!));
              }}
            />
            {errors.birth_date && (
              <p className="text-sm text-red-500 mt-1">
                {errors.birth_date.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="outline" onClick={onCloseModal} type="button">
          بازگشت
        </Button>
        <Button
          type="submit"
          className={`${isPending ? "bg-blue-400" : "bg-blue-600"}`}
          disabled={isPending}
        >
          {isPending ? "در حال ثبت..." : "ویرایش مراجع"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateClientForm;
