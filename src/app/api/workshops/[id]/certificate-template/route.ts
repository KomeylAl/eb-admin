import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const response = await fetch(
    backendUrl(`workshops/${id}/certificate-template`),
    { headers: authHeaders(token?.value) }
  );
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const formData = await req.formData();
  const response = await fetch(
    backendUrl(`workshops/${id}/certificate-template`),
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
