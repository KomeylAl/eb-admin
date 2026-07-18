import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddWorkshopParticipant } from "@/hooks/useWorkshops";
import { workshopParticipantSchema } from "@/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface AddWorkshopParticipantFormProps {
  onCloseModal: () => void;
  workshopId: string;
}

type FormData = yup.InferType<typeof workshopParticipantSchema>;

const AddParticipantForm = ({
  onCloseModal,
  workshopId,
}: AddWorkshopParticipantFormProps) => {
  const { mutate: addParticipant, isPending } = useAddWorkshopParticipant(
    workshopId,
    onCloseModal
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workshopParticipantSchema),
    defaultValues: {
      approved: false,
      gender: "", // مقدار پیش‌فرض برای gender
    },
  });

  const onSubmit = (data: FormData) => {
    addParticipant(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full p-8 space-y-7"
      dir="rtl"
    >
      <h2 className="text-xl font-semibold">افزودن شرکت‌کننده</h2>

      <div className="w-full">
        <label className="block text-sm font-medium">نام</label>
        <Input
          {...register("name")}
          className="w-full bg-white py-2 rounded-md px-2 mt-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium">نام انگلیسی</label>
        <Input
          {...register("name_en")}
          className="w-full bg-white py-2 rounded-md px-2 mt-2"
        />
        {errors.name_en && (
          <p className="text-red-500 text-sm mt-1">{errors.name_en.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="w-full">
          <label className="block text-sm font-medium">تلفن</label>
          <Input
            {...register("phone")}
            className="w-full bg-white py-2 rounded-md px-2 mt-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium">کد ملی</label>
          <Input
            {...register("national_code")}
            className="w-full bg-white py-2 rounded-md px-2 mt-2"
          />
          {errors.national_code && (
            <p className="text-red-500 text-sm mt-1">
              {errors.national_code.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium">جنسیت</label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              dir="rtl"
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger className="w-[180px] text-right">
                <SelectValue placeholder="جنسیت را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent className="z-1000">
                <SelectItem value="male" className="text-right">
                  مرد
                </SelectItem>
                <SelectItem value="female" className="text-right">
                  زن
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      <div className="w-full">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Controller
            name="approved"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value || false}
                onCheckedChange={(checked) => setValue("approved", !!checked)}
              />
            )}
          />
          تایید شده
        </label>
        {errors.approved && (
          <p className="text-red-500 text-sm mt-1">{errors.approved.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="outline" onClick={onCloseModal} type="button">
          بازگشت
        </Button>
        <Button
          type="submit"
          className={`${isPending ? "bg-blue-400" : "bg-blue-600"} text-white`}
          disabled={isPending}
        >
          {isPending ? "در حال ثبت..." : "افزودن شرکت‌کننده"}
        </Button>
      </div>
    </form>
  );
};

export default AddParticipantForm;
