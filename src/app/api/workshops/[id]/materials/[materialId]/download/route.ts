import { authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; materialId: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id, materialId } = await params;
  const response = await fetch(
    backendUrl(`workshops/${id}/materials/${materialId}/download`),
    { headers: authHeaders(token?.value) }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(
      { message: payload?.message || "Download failed" },
      { status: response.status }
    );
  }

  const blob = await response.arrayBuffer();
  const contentType =
    response.headers.get("Content-Type") || "application/octet-stream";
  const disposition =
    response.headers.get("Content-Disposition") ||
    'attachment; filename="material"';

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
    },
  });
}
