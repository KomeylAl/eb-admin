"use client";

import React, { useEffect, useState } from "react";
import FileUploader from "@/components/common/FileUploader";
import { Input } from "@/components/ui/input";
import { Controller, useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientRecordSchema } from "@/validations/clientValidations";
import { Textarea } from "@/components/ui/textarea";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import DateObject from "react-date-object";
import { Combobox } from "@/components/ui/custom/Combobox";
import { EntityType } from "@/lib/types";
import toast from "react-hot-toast";
import Label from "@/components/ui/custom/Label";
import { useSaveProgramMedicalRecord } from "@/hooks/useTreatmentPrograms";
import {
  clinicalFields,
  emptyClientRecordValues,
  flattenMedicalRecord,
  MedicalRecordApi,
} from "@/lib/medicalRecord";
import { PuffLoader } from "react-spinners";

type FormValues = yup.InferType<typeof clientRecordSchema>;

const ClientRecord = ({
  record,
  programId,
  onSaved,
}: {
  record?: MedicalRecordApi | null;
  programId: string;
  onSaved?: () => void;
}) => {
  const { mutate: saveRecord, isPending } = useSaveProgramMedicalRecord(() => {
    onSaved?.();
  });
  const resolver = yupResolver(clientRecordSchema) as Resolver<FormValues, any>;
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
    defaultValues: emptyClientRecordValues(),
  });

  useEffect(() => {
    reset(flattenMedicalRecord(record));
  }, [record, reset]);

  const [doctors, setDoctors] = useState<EntityType[]>([]);
  const [admins, setAdmins] = useState<EntityType[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`/api/doctors?page=1&pageSize=100`);
        const json = await response.json();
        const entities = (json.data ?? []).map((item: any) => ({
          label: item.name,
          value: String(item.id),
        }));
        setDoctors(entities);
      } catch (err: any) {
        toast.error(err.message || "خطا در دریافت درمانگران");
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await fetch(`/api/admins?page=1&pageSize=100`);
        const json = await response.json();
        const entities = (json.data ?? []).map((item: any) => ({
          label: item.name,
          value: String(item.id),
        }));
        setAdmins(entities);
      } catch (err: any) {
        toast.error(err.message || "خطا در دریافت پذیرش‌کنندگان");
      }
    };

    fetchDoctors();
    fetchAdmins();
  }, []);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append("images[]", file);
        });
        return;
      }
      if (value === undefined || value === null || value === "") return;
      formData.append(key, String(value));
    });

    saveRecord({ formData, programId });
  };

  return (
    <form className="flex flex-col xl:flex-row gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full rounded-sm space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-sm p-4 border">
          <h3 className="font-semibold">مشخصات همراه</h3>
          <div className="w-full mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label>نام و نام خانوادگی</Label>
              <Input {...register("companion_name")} placeholder="نام همراه" />
            </div>
            <div>
              <Label>شماره تلفن</Label>
              <Input {...register("companion_phone")} placeholder="شماره تلفن" />
            </div>
            <div>
              <Label>آدرس</Label>
              <Input {...register("companion_address")} placeholder="آدرس" />
            </div>
            <div>
              <Label>تاریخ تولد همراه</Label>
              <Controller
                name="companion_birth_date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value ? dateConvert(field.value) : ""}
                    onChange={(date) =>
                      field.onChange(
                        date ? convertBaseDate(date) : ""
                      )
                    }
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-sm p-4 border">
          <h3 className="font-semibold">اطلاعات اصلی پرونده</h3>
          <div className="w-full mt-4 space-y-5">
            <div className="w-full grid gap-3 md:grid-cols-2">
              <div>
                <Label>شماره پرونده *</Label>
                <Input
                  {...register("record_number")}
                  placeholder="شماره پرونده"
                />
                {errors.record_number && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.record_number.message}
                  </p>
                )}
              </div>
              <div>
                <Label>منبع ارجاع</Label>
                <Input
                  {...register("reference_source")}
                  placeholder="منبع ارجاع"
                />
              </div>
            </div>
            <div className="w-full grid gap-3 md:grid-cols-2">
              <div>
                <Label>درمانگر</Label>
                <Controller
                  name="doctor_id"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      data={doctors}
                      placeholder="درمانگر"
                      searchPlaceholder="جستجو..."
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      selectedLabel={record?.doctor?.name}
                    />
                  )}
                />
              </div>
              <div>
                <Label>سوپروایزر</Label>
                <Controller
                  name="supervisor_id"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      data={doctors}
                      placeholder="سوپروایزر"
                      searchPlaceholder="جستجو..."
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      selectedLabel={record?.supervisor?.name}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-sm p-4 border">
          <h3 className="font-semibold">اطلاعات پذیرش</h3>
          <div className="w-full mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <Label>پذیرش‌کننده</Label>
              <Controller
                name="admin_id"
                control={control}
                render={({ field }) => (
                  <Combobox
                    data={admins}
                    placeholder="پذیرش‌کننده"
                    searchPlaceholder="جستجو..."
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    selectedLabel={record?.admin?.name}
                  />
                )}
              />
            </div>
            <div>
              <Label>تاریخ پذیرش</Label>
              <Controller
                name="admission_date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value ? dateConvert(field.value) : ""}
                    onChange={(date) =>
                      field.onChange(
                        date ? convertBaseDate(date ?? new DateObject()) : ""
                      )
                    }
                  />
                )}
              />
            </div>
            <div>
              <Label>تاریخ ویزیت</Label>
              <Controller
                name="visit_date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value ? dateConvert(field.value) : ""}
                    onChange={(date) =>
                      field.onChange(
                        date ? convertBaseDate(date ?? new DateObject()) : ""
                      )
                    }
                  />
                )}
              />
            </div>
          </div>
        </div>

        {clinicalFields.map(({ name, label }) => (
          <div
            key={name}
            className="w-full bg-white dark:bg-gray-800 p-4 rounded-sm border"
          >
            <h3 className="font-semibold mb-2">{label}</h3>
            <Textarea {...register(name)} rows={5} />
          </div>
        ))}
      </div>

      <div className="w-full xl:w-[30%] space-y-4">
        <div className="w-full bg-white dark:bg-gray-800 rounded-sm p-4 space-y-3 border">
          <h3 className="font-semibold">ذخیره پرونده</h3>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <PuffLoader size={22} color="#fff" /> : "ذخیره"}
          </Button>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 rounded-sm p-4 border">
          <h3 className="font-semibold">تصاویر پرونده</h3>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <FileUploader
                className="flex-col"
                allowMultiple
                onFilesSelected={(files) => field.onChange(files)}
                images={record?.images ?? []}
              />
            )}
          />
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.images.message)}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ClientRecord;
