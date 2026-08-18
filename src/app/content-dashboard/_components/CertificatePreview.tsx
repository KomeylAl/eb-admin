"use client";

import type { CSSProperties } from "react";
import {
  CERT_HEIGHT_PX,
  CERT_WIDTH_PX,
  CertificateRenderData,
  CertificateTemplateKey,
} from "@/lib/certificate";

type Props = {
  data: CertificateRenderData;
  scale?: number;
};

const shellStyle = (key: CertificateTemplateKey | string): CSSProperties => {
  const base: CSSProperties = {
    width: CERT_WIDTH_PX,
    height: CERT_HEIGHT_PX,
    boxSizing: "border-box",
    direction: "rtl",
    fontFamily: "Tahoma, 'Segoe UI', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
    background: "#fff",
    color: "#1a1a1a",
  };

  if (key === "minimal") {
    return {
      ...base,
      border: "1px solid #d4d4d4",
      padding: "48px 64px",
    };
  }

  if (key === "formal") {
    return {
      ...base,
      border: "10px double #1f3a5f",
      padding: "40px 56px",
      background:
        "linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #ffffff 100%)",
    };
  }

  return {
    ...base,
    border: "14px solid #b0893f",
    outline: "2px solid #b0893f",
    outlineOffset: "-22px",
    padding: "40px 56px",
    background:
      "radial-gradient(circle at top, #fff8e8 0%, #ffffff 42%, #ffffff 100%)",
  };
};

const CertificatePreview = ({ data, scale = 1 }: Props) => {
  const key = (data.template_key || "classic") as CertificateTemplateKey;
  const title = data.title || "گواهی شرکت";
  const body =
    data.body_rendered ||
    data.body_text ||
    "متن گواهی در اینجا نمایش داده می‌شود.";
  const clinic = data.clinic_name || data.placeholders?.clinic_name || "";
  const number = data.placeholders?.certificate_number || "";
  const issueDate = data.placeholders?.issue_date || "";

  return (
    <div
      style={{
        width: CERT_WIDTH_PX * scale,
        height: CERT_HEIGHT_PX * scale,
        overflow: "hidden",
      }}
    >
      <div
        data-certificate-root
        style={{
          ...shellStyle(key),
          transform: `scale(${scale})`,
          transformOrigin: "top right",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24 }}>
          <div>
            {clinic && (
              <p
                style={{
                  margin: 0,
                  fontSize: key === "minimal" ? 16 : 18,
                  fontWeight: 700,
                  color: key === "formal" ? "#1f3a5f" : "#6b4f1d",
                }}
              >
                {clinic}
              </p>
            )}
            <h1
              style={{
                margin: "12px 0 0",
                fontSize: key === "minimal" ? 28 : 34,
                fontWeight: 800,
                letterSpacing: key === "formal" ? 1 : 0,
              }}
            >
              {title}
            </h1>
          </div>
          {data.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logo_url}
              alt="logo"
              style={{ maxHeight: 72, maxWidth: 140, objectFit: "contain" }}
            />
          ) : null}
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 20,
              lineHeight: 1.9,
              textAlign: "justify",
              whiteSpace: "pre-wrap",
            }}
          >
            {body}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 13, color: "#555" }}>
            {number && <p style={{ margin: "0 0 4px" }}>شماره: {number}</p>}
            {issueDate && <p style={{ margin: 0 }}>تاریخ صدور: {issueDate}</p>}
            {data.footer_text && (
              <p style={{ margin: "8px 0 0", maxWidth: 420 }}>{data.footer_text}</p>
            )}
          </div>

          <div style={{ textAlign: "center", minWidth: 160 }}>
            {data.signature_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.signature_url}
                alt="signature"
                style={{ maxHeight: 56, maxWidth: 160, objectFit: "contain" }}
              />
            ) : (
              <div style={{ height: 40 }} />
            )}
            {data.signer_name && (
              <p style={{ margin: "6px 0 0", fontWeight: 700 }}>{data.signer_name}</p>
            )}
            {data.signer_title && (
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#666" }}>
                {data.signer_title}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
