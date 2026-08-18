"use client";

import { CERT_HEIGHT_PX, CERT_WIDTH_PX } from "@/lib/certificate";

export async function downloadCertificatePdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: CERT_WIDTH_PX,
    height: CERT_HEIGHT_PX,
  });

  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
