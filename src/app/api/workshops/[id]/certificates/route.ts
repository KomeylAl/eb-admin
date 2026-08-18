import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const response = await fetch(backendUrl(`workshops/${id}/certificates`), {
    headers: authHeaders(token?.value),
  });
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const response = await fetch(
      backendUrl(`workshops/${id}/certificates/upload`),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: formData,
      }
    );
    const data = adaptBackendResponse(await response.json().catch(() => ({})));
    return NextResponse.json(data, { status: response.status });
  }

  const body = await req.json();
  const response = await fetch(backendUrl(`workshops/${id}/certificates`), {
    method: "POST",
    headers: {
      ...authHeaders(token?.value),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
