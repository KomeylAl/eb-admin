import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = req.cookies.get("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/treatment-programs/${id}/medical-record`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const formData = await req.formData();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/treatment-programs/${id}/medical-record`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
