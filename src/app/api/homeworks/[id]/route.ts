import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const body = await req.json();
  const response = await fetch(backendUrl(`homeworks/${id}`), {
    method: "PATCH",
    headers: {
      ...authHeaders(token?.value),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const response = await fetch(backendUrl(`homeworks/${id}`), {
    method: "DELETE",
    headers: authHeaders(token?.value),
  });
  if (response.status === 204) {
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
