export type CertificateTemplateKey = "classic" | "minimal" | "formal";

export type CertificateRenderData = {
  template_key: CertificateTemplateKey | string;
  clinic_name?: string | null;
  title?: string | null;
  body_rendered?: string | null;
  body_text?: string | null;
  footer_text?: string | null;
  signer_name?: string | null;
  signer_title?: string | null;
  logo_url?: string | null;
  signature_url?: string | null;
  placeholders?: Record<string, string>;
};

export function fillCertificatePlaceholders(
  text: string,
  placeholders: Record<string, string>
): string {
  let out = text || "";
  Object.entries(placeholders).forEach(([key, value]) => {
    out = out
      .split(`{{${key}}}`)
      .join(value ?? "")
      .split(`{${key}}`)
      .join(value ?? "");
  });
  return out;
}

/** A4 landscape CSS size at ~96dpi */
export const CERT_WIDTH_PX = 1123;
export const CERT_HEIGHT_PX = 794;
