"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/common/rich-text-editor";
import ErrorComponent from "@/components/layout/ErrorComponent";
import { useGetDoctorResume, useSaveDoctorResume } from "@/hooks/useDoctors";
import {
  normalizeResumeForSave,
  parseResumeJsonInput,
  resumeToFormValues,
  unwrapResumePayload,
} from "@/lib/resume";
import type {
  DoctorResumeApi,
  DoctorResumeFormValues,
} from "../../../../../types/resumeTypes";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PuffLoader } from "react-spinners";
import { Braces, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type ResumeEditorProps = {
  doctorId: string;
  resumeData: DoctorResumeApi | null;
  isPending: boolean;
  onSave: (data: DoctorResumeFormValues) => void;
};

function ResumeEditor({
  doctorId,
  resumeData,
  isPending,
  onSave,
}: ResumeEditorProps) {
  const defaults = resumeToFormValues(resumeData);
  const { register, control, setValue, handleSubmit, reset, getValues } =
    useForm<DoctorResumeFormValues>({
      defaultValues: defaults,
    });

  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editorSeed, setEditorSeed] = useState(defaults.content);
  const [editorRevision, setEditorRevision] = useState(0);

  const {
    fields: eduFields,
    append: addEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "educations",
  });

  const applyJsonToForm = () => {
    try {
      const values = parseResumeJsonInput(jsonInput);
      reset(values);
      setEditorSeed(values.content ?? "");
      setEditorRevision((n) => n + 1);
      setJsonError(null);
      toast.success("JSON روی فرم اعمال شد؛ در صورت نیاز ذخیره کنید");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "خطا در خواندن JSON";
      setJsonError(message);
      toast.error(message);
    }
  };

  const saveFromJson = () => {
    try {
      const values = parseResumeJsonInput(jsonInput);
      reset(values);
      setEditorSeed(values.content ?? "");
      setEditorRevision((n) => n + 1);
      setJsonError(null);
      onSave(values);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "خطا در خواندن JSON";
      setJsonError(message);
      toast.error(message);
    }
  };

  const loadCurrentAsJson = () => {
    const normalized = normalizeResumeForSave(getValues());
    setJsonInput(
      JSON.stringify(
        {
          title: normalized.title,
          bio: normalized.bio,
          specialization: normalized.specialization,
          educations: normalized.educations,
          experiences: normalized.experiences,
          skills: normalized.skills,
          certifications: normalized.certifications,
          content: normalized.content,
          social_links: normalized.social_links,
        },
        null,
        2
      )
    );
    setJsonError(null);
    toast.success("محتوای فعلی فرم به JSON تبدیل شد");
  };

  return (
    <div className="w-full space-y-4 p-2">
      <div>
        <h2 className="text-xl font-bold">ویرایش رزومه</h2>
        <p className="text-sm text-muted-foreground mt-1">
          فیلدها را دستی پر کنید یا از تب JSON برای وارد کردن سریع بکاپ استفاده
          کنید.
        </p>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList>
          <TabsTrigger value="form">فرم رزومه</TabsTrigger>
          <TabsTrigger value="json" className="gap-1.5">
            <Braces className="size-3.5" />
            وارد کردن JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-4">
          <form
            onSubmit={handleSubmit((data) => onSave(data))}
            className="space-y-6 w-full mx-auto"
          >
            <div className="space-y-2">
              <h3 className="font-semibold">عنوان</h3>
              <Input
                {...register("title")}
                placeholder="عنوان"
                className="bg-white dark:bg-background"
              />
              <p className="text-sm text-muted-foreground">
                این بخش صرفا برای درک بهتر موتور های جستجو از رزومه شماست و به
                کاربران عادی نمایش داده نمیشود.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">معرفی کوتاه</h3>
              <Textarea
                {...register("bio")}
                placeholder="توضیحات"
                className="bg-white dark:bg-background min-h-24"
              />
              <p className="text-sm text-muted-foreground">
                این بخش صرفا برای درک بهتر موتور های جستجو از رزومه شماست و به
                کاربران عادی نمایش داده نمیشود.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">تخصص اصلی</h3>
              <Textarea
                {...register("specialization")}
                placeholder="تخصص اصلی"
                className="bg-white dark:bg-background"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">تحصیلات</h3>
              <div className="space-y-2">
                {eduFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center bg-muted/50 p-2 rounded-md"
                  >
                    <Input
                      {...register(`educations.${index}.degree`)}
                      placeholder="مدرک"
                      className="bg-white dark:bg-background"
                    />
                    <Input
                      {...register(`educations.${index}.institution`)}
                      placeholder="دانشگاه"
                      className="bg-white dark:bg-background"
                    />
                    <Input
                      {...register(`educations.${index}.year`)}
                      placeholder="سال"
                      className="bg-white dark:bg-background sm:max-w-28"
                    />
                    <button
                      type="button"
                      onClick={() => removeEdu(index)}
                      className="p-2 text-red-500 hover:text-red-700 self-start"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addEdu({ degree: "", institution: "", year: "" })
                  }
                  className="text-blue-600 hover:underline mt-1 text-sm"
                >
                  + افزودن مورد جدید
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">رزومه</h3>
              <RichTextEditor
                key={`${doctorId}-${editorRevision}`}
                content={editorSeed}
                onChange={(val) => setValue("content", val)}
              />
            </div>

            {resumeData?.file_url && (
              <div className="space-y-1">
                <Label>فایل رزومه فعلی</Label>
                <a
                  href={String(resumeData.file_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm hover:underline block"
                >
                  مشاهده / دانلود PDF
                </a>
              </div>
            )}

            <div className="space-y-1">
              <Label>آپلود فایل PDF (اختیاری)</Label>
              <Input
                type="file"
                accept="application/pdf"
                className="bg-white dark:bg-background"
                onChange={(e) => setValue("file", e.target.files)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">رویکرد های درمان / مشاوره</h3>
              <Input
                {...register("skills")}
                placeholder="مثلاً CBT, ACT, Mindfulness"
                className="bg-white dark:bg-background"
              />
              <p className="text-xs text-muted-foreground">
                رویکرد را با ویرگول جدا کنید.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">لینک‌ها</h3>
              <div className="space-y-1">
                <Label>لینکداین</Label>
                <Input
                  {...register("social_links.linkedin")}
                  placeholder="LinkedIn URL"
                  className="bg-white dark:bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label>توییتر (X)</Label>
                <Input
                  {...register("social_links.twitter")}
                  placeholder="Twitter URL"
                  className="bg-white dark:bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label>اینستاگرام</Label>
                <Input
                  {...register("social_links.instagram")}
                  placeholder="Instagram URL"
                  className="bg-white dark:bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label>وبسایت شخصی</Label>
                <Input
                  {...register("social_links.website")}
                  placeholder="Website URL"
                  className="bg-white dark:bg-background"
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="mt-2">
              {isPending ? "در حال ذخیره..." : "ذخیره رزومه"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="json" className="mt-4 space-y-4">
          <div className="rounded-xl border border-dashed p-4 space-y-2 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              یک آبجکت رزومه (مثل خروجی بکاپ) را بچسبانید. فیلدهای{" "}
              <code className="text-xs">id</code>،{" "}
              <code className="text-xs">doctor_id</code>،{" "}
              <code className="text-xs">file_path</code> و تاریخ‌ها هنگام ارسال
              حذف می‌شوند و فقط فیلدهای رزومه برای همین متخصص ذخیره می‌گردد.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadCurrentAsJson}
            >
              تبدیل فرم فعلی به JSON
            </Button>
          </div>

          <Textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setJsonError(null);
            }}
            placeholder={`{\n  "title": "...",\n  "bio": "...",\n  "specialization": "...",\n  "educations": [],\n  "skills": [],\n  "content": "<p>...</p>",\n  "social_links": {}\n}`}
            className="min-h-[320px] font-mono text-xs bg-white dark:bg-background leading-relaxed"
            dir="ltr"
          />

          {jsonError && <p className="text-sm text-rose-500">{jsonError}</p>}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={applyJsonToForm}
              disabled={!jsonInput.trim()}
            >
              اعمال روی فرم
            </Button>
            <Button
              type="button"
              onClick={saveFromJson}
              disabled={isPending || !jsonInput.trim()}
            >
              {isPending ? "در حال ذخیره..." : "ذخیره مستقیم از JSON"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const DoctorResumeTab = ({ doctorId }: { doctorId: string }) => {
  const {
    data: resumePayload,
    isLoading,
    error,
    refetch,
  } = useGetDoctorResume(doctorId);

  const { mutate: saveResume, isPending } = useSaveDoctorResume(() => {});

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <PuffLoader size={60} color="#3e86fa" />
      </div>
    );
  }

  if (error) {
    return <ErrorComponent refetch={refetch} />;
  }

  const resumeData = unwrapResumePayload(resumePayload);
  const formKey = resumeData
    ? `${doctorId}-${String(resumeData.updated_at ?? "new")}-${(resumeData.content ?? "").length}`
    : `${doctorId}-empty`;

  return (
    <ResumeEditor
      key={formKey}
      doctorId={doctorId}
      resumeData={resumeData}
      isPending={isPending}
      onSave={(data) =>
        saveResume({
          formData: normalizeResumeForSave(data),
          doctorId,
        })
      }
    />
  );
};

export default DoctorResumeTab;
