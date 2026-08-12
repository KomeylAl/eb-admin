import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = req.cookies.get("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/treatment-programs/${id}`,
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

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = req.cookies.get("token");
  const body = await req.json();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/treatment-programs/${id}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
