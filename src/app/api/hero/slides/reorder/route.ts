import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token");

  try {
    const body = await req.json();
    const orderedIds = body?.ordered_ids;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { message: "ordered_ids must be a non-empty array" },
        { status: 422 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/hero/slides/reorder`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify({ ordered_ids: orderedIds }),
      }
    );

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message ?? "Error reordering slides",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(adaptBackendResponse(payload), { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
