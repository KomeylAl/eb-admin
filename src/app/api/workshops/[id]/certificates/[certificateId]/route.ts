import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; certificateId: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id, certificateId } = await params;
  const response = await fetch(
    backendUrl(`workshops/${id}/certificates/${certificateId}`),
    {
      method: "DELETE",
      headers: authHeaders(token?.value),
    }
  );
  if (response.status === 204) {
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
