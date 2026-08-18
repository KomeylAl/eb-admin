import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const response = await fetch(backendUrl(`workshops/${id}/participants`), {
    headers: authHeaders(token?.value),
  });
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const token = req.cookies.get("token");
    const { id } = await params;
    const jsonBody = await req.json();

    const response = await fetch(backendUrl(`workshops/${id}/participants`), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({
        ...jsonBody,
        english_name: jsonBody.english_name ?? jsonBody.name_en,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        {
          message:
            errorData?.message ||
            errorData?.errors?.phone?.[0] ||
            "خطا در ایجاد شرکت کننده",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "مشکلی در سرور رخ داد", error: error.message },
      { status: 500 }
    );
  }
}
