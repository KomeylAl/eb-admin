import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; materialId: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id, materialId } = await params;
  const contentType = req.headers.get("content-type") || "";

  let body: BodyInit;
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token?.value}`,
  };

  if (contentType.includes("application/json")) {
    body = JSON.stringify(await req.json());
    headers["Content-Type"] = "application/json";
  } else {
    body = await req.formData();
  }

  const response = await fetch(
    backendUrl(`workshops/${id}/materials/${materialId}`),
    {
      method: "PATCH",
      headers,
      body,
    }
  );

  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id, materialId } = await params;
  const response = await fetch(
    backendUrl(`workshops/${id}/materials/${materialId}`),
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
