import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; certificateId: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id, certificateId } = await params;
  const response = await fetch(
    backendUrl(`workshops/${id}/certificates/${certificateId}/download`),
    { headers: authHeaders(token?.value) }
  );

  if (!response.ok) {
    const data = adaptBackendResponse(await response.json().catch(() => ({})));
    return NextResponse.json(data, { status: response.status });
  }

  const headers = new Headers();
  const contentType = response.headers.get("content-type");
  const disposition = response.headers.get("content-disposition");
  if (contentType) headers.set("content-type", contentType);
  if (disposition) headers.set("content-disposition", disposition);

  return new NextResponse(response.body, { status: 200, headers });
}
