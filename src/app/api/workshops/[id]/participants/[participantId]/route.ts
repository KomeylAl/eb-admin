import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string; participantId: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id, participantId } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    backendUrl(`workshops/${id}/participants/${participantId}`),
    {
      method: "DELETE",
      headers: authHeaders(token.value),
    }
  );

  if (response.status === 204) {
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }

  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id, participantId } = await params;
  const jsonBody = await req.json();

  const response = await fetch(
    backendUrl(`workshops/${id}/participants/${participantId}`),
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        ...jsonBody,
        english_name: jsonBody.english_name ?? jsonBody.name_en,
      }),
    }
  );

  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  if (!response.ok) {
    return NextResponse.json(
      {
        message: data?.message || "خطا در ویرایش شرکت کننده",
        details: data,
      },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: response.status });
}

/** @deprecated prefer PATCH — kept for older forms */
export async function POST(req: NextRequest, { params }: Ctx) {
  return PATCH(req, { params });
}
