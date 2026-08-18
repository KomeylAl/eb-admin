"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/custom/Combobox";
import {
  useCertificateTemplatePresets,
  useDeleteWorkshopCertificate,
  useIssueWorkshopCertificates,
  useSaveWorkshopCertificateTemplate,
  useUploadWorkshopCertificate,
  useWorkshopCertificateTemplate,
  useWorkshopCertificates,
  useWorkshopParticipants,
  useWorksop,
} from "@/hooks/useWorkshops";
import { PuffLoader } from "react-spinners";
import CertificatePreview from "./CertificatePreview";
import {
  CertificateRenderData,
  fillCertificatePlaceholders,
} from "@/lib/certificate";
import { downloadCertificatePdf } from "@/lib/downloadCertificatePdf";
import { Modal } from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import { useModal } from "@/hooks/useModal";
import toast from "react-hot-toast";

const WorkshopCertificatesPanel = ({ workshopId }: { workshopId: string }) => {
  const { data: workshopRes, refetch: refetchWorkshop } = useWorksop(workshopId);
  const workshop = workshopRes?.data;
  const { data: participantsRes, refetch: refetchParticipants } =
    useWorkshopParticipants(workshopId);
  const participants = (participantsRes?.data ??
    workshop?.participants ??
    []) as any[];

  const { data: presetsRes } = useCertificateTemplatePresets();
  const presets = presetsRes?.data;
  const templateOptions = (presets?.templates || []).map(
    (t: { key: string; label: string }) => ({
      value: t.key,
      label: t.label,
    })
  );

  const { data: templateRes, isLoading: loadingTemplate, refetch: refetchTemplate } =
    useWorkshopCertificateTemplate(workshopId);
  const savedTemplate = templateRes?.data;

  const { data: certRes, isLoading: loadingCerts, refetch: refetchCerts } =
    useWorkshopCertificates(workshopId);
  const certificates = certRes?.data ?? [];

  const [templateKey, setTemplateKey] = useState("classic");
  const [clinicName, setClinicName] = useState("کلینیک روان‌شناسی ابراز");
  const [title, setTitle] = useState("گواهی پایان دوره");
  const [bodyText, setBodyText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeSignature, setRemoveSignature] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [uploadParticipantId, setUploadParticipantId] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewCert, setPreviewCert] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState("");
  const [exporting, setExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!savedTemplate) {
      if (presets?.default_body && !bodyText) {
        setBodyText(presets.default_body);
      }
      return;
    }
    setTemplateKey(savedTemplate.template_key || "classic");
    setClinicName(savedTemplate.clinic_name || "");
    setTitle(savedTemplate.title || "");
    setBodyText(savedTemplate.body_text || "");
    setFooterText(savedTemplate.footer_text || "");
    setSignerName(savedTemplate.signer_name || "");
    setSignerTitle(savedTemplate.signer_title || "");
    setRemoveLogo(false);
    setRemoveSignature(false);
    setLogo(null);
    setSignature(null);
  }, [savedTemplate, presets?.default_body]);

  const previewPlaceholders = useMemo(
    () => ({
      participant_name: "نام نمونه شرکت‌کننده",
      english_name: "Sample Name",
      national_code: "۰۰۱۲۳۴۵۶۷۸",
      phone: "۰۹۱۲۰۰۰۰۰۰۰",
      workshop_title: workshop?.title || "عنوان کارگاه",
      workshop_type: workshop?.type || "",
      start_date: workshop?.start_date || "",
      end_date: workshop?.end_date || "",
      issue_date: new Date().toISOString().slice(0, 10),
      certificate_number: "EBZ-PREVIEW",
      clinic_name: clinicName,
    }),
    [workshop, clinicName]
  );

  const livePreview: CertificateRenderData = {
    template_key: templateKey,
    clinic_name: clinicName,
    title,
    body_rendered: fillCertificatePlaceholders(bodyText, previewPlaceholders),
    footer_text: footerText,
    signer_name: signerName,
    signer_title: signerTitle,
    logo_url: logo
      ? URL.createObjectURL(logo)
      : removeLogo
        ? null
        : savedTemplate?.logo_url,
    signature_url: signature
      ? URL.createObjectURL(signature)
      : removeSignature
        ? null
        : savedTemplate?.signature_url,
    placeholders: previewPlaceholders,
  };

  const { mutate: saveTemplate, isPending: saving } =
    useSaveWorkshopCertificateTemplate(workshopId, () => {
      refetchTemplate();
    });

  const { mutate: issueCerts, isPending: issuing } =
    useIssueWorkshopCertificates(workshopId, () => {
      setSelectedIds([]);
      refetchCerts();
      refetchWorkshop();
      refetchParticipants();
    });

  const { mutate: uploadCert, isPending: uploading } =
    useUploadWorkshopCertificate(workshopId, () => {
      setUploadFile(null);
      setUploadParticipantId("");
      refetchCerts();
      refetchParticipants();
    });

  const { mutate: deleteCert, isPending: deleting } =
    useDeleteWorkshopCertificate(workshopId, () => {
      closeDelete();
      refetchCerts();
    });

  const {
    isOpen: deleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();

  const approved = participants.filter((p) => Boolean(p.approved));
  const issuedParticipantIds = new Set(
    certificates.map((c: any) => c.participant_id)
  );

  const onSaveTemplate = () => {
    const formData = new FormData();
    formData.append("template_key", templateKey);
    formData.append("clinic_name", clinicName);
    formData.append("title", title);
    formData.append("body_text", bodyText);
    formData.append("footer_text", footerText);
    formData.append("signer_name", signerName);
    formData.append("signer_title", signerTitle);
    if (logo) formData.append("logo", logo);
    if (signature) formData.append("signature", signature);
    if (removeLogo) formData.append("remove_logo", "1");
    if (removeSignature) formData.append("remove_signature", "1");
    saveTemplate(formData);
  };

  const toggleParticipant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const exportPdf = async (data: CertificateRenderData, filename: string) => {
    setPreviewCert({ payload: data });
    setExporting(true);
    // wait for offscreen render
    await new Promise((r) => setTimeout(r, 80));
    try {
      const root = exportRef.current?.querySelector(
        "[data-certificate-root]"
      ) as HTMLElement | null;
      if (!root) {
        throw new Error("پیش‌نمایش گواهی آماده نیست");
      }
      await downloadCertificatePdf(root, filename);
    } catch (e: any) {
      toast.error(e?.message || "خطا در ساخت PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-4">
        <h3 className="font-semibold">قالب گواهی (A4 افقی)</h3>
        <p className="text-sm text-muted-foreground">
          PDF روی سرور ساخته نمی‌شود؛ در همین پنل (و بعداً ابراز پلاس) از روی
          قالب فرانت صادر می‌شود. از placeholderهایی مثل{" "}
          <code>{"{{participant_name}}"}</code> استفاده کنید.
        </p>

        {loadingTemplate && <PuffLoader size={36} color="#3e86fa" />}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>طرح قالب</Label>
            <Combobox
              data={
                templateOptions.length
                  ? templateOptions
                  : [
                      { value: "classic", label: "کلاسیک" },
                      { value: "minimal", label: "مینیمال" },
                      { value: "formal", label: "رسمی" },
                    ]
              }
              placeholder="قالب"
              searchPlaceholder="جستجو..."
              value={templateKey}
              onChange={(v) => setTemplateKey(String(v))}
            />
          </div>
          <div className="space-y-2">
            <Label>نام کلینیک</Label>
            <Input
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>عنوان مدرک</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>متن مدرک</Label>
            <Textarea
              rows={4}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>پاورقی</Label>
            <Textarea
              rows={2}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>نام امضاکننده</Label>
            <Input
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>سمت امضاکننده</Label>
            <Input
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>لوگو</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setLogo(e.target.files?.[0] || null);
                setRemoveLogo(false);
              }}
            />
            {(savedTemplate?.logo_url || logo) && !removeLogo && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setLogo(null);
                  setRemoveLogo(true);
                }}
              >
                حذف لوگو
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Label>امضا</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSignature(e.target.files?.[0] || null);
                setRemoveSignature(false);
              }}
            />
            {(savedTemplate?.signature_url || signature) && !removeSignature && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSignature(null);
                  setRemoveSignature(true);
                }}
              >
                حذف امضا
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled={saving || !templateKey} onClick={onSaveTemplate}>
            {saving ? "در حال ذخیره..." : "ذخیره قالب"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={exporting}
            onClick={() => exportPdf(livePreview, "certificate-preview.pdf")}
          >
            دانلود پیش‌نمایش PDF
          </Button>
        </div>

        <div className="overflow-auto border rounded-lg bg-slate-50 p-3" ref={previewRef}>
          <CertificatePreview data={livePreview} scale={0.55} />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-4">
        <h3 className="font-semibold">صدور برای شرکت‌کنندگان تأییدشده</h3>
        {!savedTemplate && (
          <p className="text-sm text-amber-700">
            ابتدا قالب را ذخیره کنید، سپس گواهی صادر کنید.
          </p>
        )}
        {approved.length === 0 && (
          <p className="text-sm text-muted-foreground">
            شرکت‌کننده تأییدشده‌ای برای این کارگاه وجود ندارد.
          </p>
        )}
        <div className="space-y-2">
          {approved.map((p) => {
            const id = String(p.id);
            const already = issuedParticipantIds.has(id);
            return (
              <label
                key={id}
                className="flex items-center gap-3 text-sm border rounded-lg px-3 py-2"
              >
                <input
                  type="checkbox"
                  disabled={already || !savedTemplate}
                  checked={selectedIds.includes(id)}
                  onChange={() => toggleParticipant(id)}
                />
                <span className="flex-1">
                  {p.name}
                  {p.national_code ? ` · ${p.national_code}` : ""}
                </span>
                {already && (
                  <span className="text-xs text-emerald-700">صادر شده</span>
                )}
              </label>
            );
          })}
        </div>
        <Button
          disabled={
            issuing || !savedTemplate || selectedIds.length === 0
          }
          onClick={() => issueCerts(selectedIds)}
        >
          {issuing ? "در حال صدور..." : "صدور گواهی داینامیک"}
        </Button>
      </div>

      <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-4">
        <h3 className="font-semibold">آپلود فایل مدرک برای یک شرکت‌کننده</h3>
        <p className="text-sm text-muted-foreground">
          می‌توانید PDF یا تصویر مدرک را جداگانه برای هر شرکت‌کننده تأییدشده
          آپلود کنید. همین فایل در پنل ابراز پلاس قابل دانلود است.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>شرکت‌کننده</Label>
            <Combobox
              data={approved.map((p) => ({
                value: String(p.id),
                label: `${p.name}${p.national_code ? ` · ${p.national_code}` : ""}`,
              }))}
              placeholder="انتخاب شرکت‌کننده"
              searchPlaceholder="جستجو..."
              value={uploadParticipantId}
              onChange={(v) => setUploadParticipantId(String(v))}
            />
          </div>
          <div className="space-y-2">
            <Label>فایل (pdf / jpg / png / webp)</Label>
            <Input
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <Button
          disabled={uploading || !uploadParticipantId || !uploadFile}
          onClick={() => {
            if (!uploadFile || !uploadParticipantId) return;
            const formData = new FormData();
            formData.append("participant_id", uploadParticipantId);
            formData.append("file", uploadFile);
            uploadCert(formData);
          }}
        >
          {uploading ? "در حال آپلود..." : "آپلود مدرک"}
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">گواهی‌های صادرشده</h3>
        {loadingCerts && <PuffLoader size={36} color="#3e86fa" />}
        {!loadingCerts && certificates.length === 0 && (
          <p className="text-sm text-muted-foreground">هنوز گواهی‌ای صادر نشده است.</p>
        )}
        {certificates.map((item: any) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="font-medium">
                {item.participant?.name || item.payload?.placeholders?.participant_name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                شماره: {item.certificate_number}
                {item.issued_at ? ` · ${String(item.issued_at).slice(0, 10)}` : ""}
                {item.source_label ? ` · ${item.source_label}` : ""}
                {item.original_name ? ` · ${item.original_name}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.has_file && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`/api/workshops/${workshopId}/certificates/${item.id}/download`}
                  >
                    دانلود فایل آپلودشده
                  </a>
                </Button>
              )}
              {item.payload && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={exporting}
                  onClick={() =>
                    exportPdf(
                      item.payload as CertificateRenderData,
                      `${item.certificate_number}.pdf`
                    )
                  }
                >
                  دانلود PDF داینامیک
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setDeleteId(item.id);
                  openDelete();
                }}
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Offscreen full-size render for PDF export */}
      <div
        ref={exportRef}
        aria-hidden
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          pointerEvents: "none",
          opacity: 1,
        }}
      >
        {previewCert?.payload && (
          <CertificatePreview data={previewCert.payload} scale={1} />
        )}
      </div>

      <Modal
        showCloseButton={false}
        isOpen={deleteOpen}
        onClose={closeDelete}
        className="max-w-[700px] bg-white"
      >
        <DeleteModal
          deleteFn={() => deleteCert(deleteId)}
          isDeleting={deleting}
          onCancel={closeDelete}
          description="رکورد صدور و در صورت وجود فایل آپلودشده حذف می‌شود."
        />
      </Modal>
    </div>
  );
};

export default WorkshopCertificatesPanel;
