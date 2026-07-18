import { assessmentSchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import toast from "react-hot-toast";
import DateObject from "react-date-object";
import { convertBaseDate } from "@/lib/utils";
import Label from "@/components/ui/custom/Label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EntityType } from "@/lib/types";
import axios from "axios";
import { Combobox } from "@/components/ui/custom/Combobox";
import { assessmentType } from "../../../../../types/assessmentTypes";
import { useUpdateAssessment } from "@/hooks/useAssessments";

interface UpdateAssessmentFormProps {
  onSuccess: () => void;
  assessment: assessmentType;
}

const UpdateAssessmentForm = ({
  onSuccess,
  assessment,
}: UpdateAssessmentFormProps) => {
  const [doctors, setDoctors] = useState<EntityType[]>([]);
  const today = Date.now();
  const { mutate: updateAssessment, isPending } = useUpdateAssessment(() =>
    onSuccess()
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(assessmentSchema),
    defaultValues: {
      client: assessment?.client,
      doctor_id: assessment?.doctor_id ?? "",
      date: assessment?.date ?? null,
      time: assessment?.time ?? null,
      status: assessment?.status ?? "pending",
      file: assessment?.file ?? null,
    },
  });

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const response = await axios.get(`/api/doctors?page=1&pageSize=100`);
        const entities = response.data.data.map((item: any) => ({
          label: item.name,
          value: item.id.toString(),
        }));
        setDoctors(entities);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    getDoctors();
  }, []);

  const onSubmit = (data: assessmentType) => {
    updateAssessment({ formData: data, assessmentId: "" });
  };
  return (
    <div className="w-full h-full p-8 space-y-7">
      <h2 className="text-xl font-semibold">افزودن نوبت ارزیابی اولیه</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col lg:flex-row items-start justify-center gap-6"
      >
        <div className="w-full flex flex-col items-start gap-2">
          <Calendar
            calendar={persian}
            locale={persian_fa}
            minDate={today}
            plugins={[<TimePicker hideSeconds />]}
            mapDays={({ date }) => {
              let isWeekend = [6].includes(date.weekDay.index);
              let props: any = {};

              props.style = {
                borderRadius: "3px",
              };

              if (isWeekend)
                return {
                  disabled: true,
                  style: { color: "#ccc" },
                  onClick: () => toast.error("آخر هفته ها غیر فعال هستند"),
                };

              return props;
            }}
            className="calendar dark:bg-gray-700! dark:border! dark:border-gray-800!"
            shadow={false}
            format="YYYY/MM/DD HH:mm:ss"
            value={new DateObject()}
            onChange={(selectedDate) => {
              setValue("date", convertBaseDate(selectedDate!));
              setValue("time", `${selectedDate!.hour}:${selectedDate!.minute}`);
            }}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">
              {errors.date.message as string}
            </p>
          )}
        </div>
        <div className="w-full flex flex-col items-start gap-4">
          <div className="w-full flex flex-col items-start space-y-2">
            <Label>نام و نام خانوادگی</Label>
            <Input
              {...register("client.name")}
              placeholder="مثلا: علی احمدی"
              className="bg-white"
            />
            {errors.client?.name && (
              <p className="text-red-500 text-sm">
                {errors.client.name.message}
              </p>
            )}
          </div>
          <div className="w-full flex flex-col items-start space-y-2">
            <Label>شماره تماس</Label>
            <Input
              {...register("client.phone")}
              placeholder="مثلا: 09123456789"
              className="bg-white"
            />
            {errors.client?.phone && (
              <p className="text-red-500 text-sm">
                {errors.client.phone.message}
              </p>
            )}
          </div>
          {doctors && (
            <div className="">
              <label>متخصص</label>
              <Controller
                name="doctor_id"
                control={control}
                render={({ field }) => (
                  <Combobox
                    data={doctors}
                    placeholder="انتخاب متخصص"
                    searchPlaceholder="جستجو..."
                    value={field?.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.doctor_id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.doctor_id.message}
                </p>
              )}
            </div>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "در حال ثبت" : "ثبت نوبت"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAssessmentForm;
