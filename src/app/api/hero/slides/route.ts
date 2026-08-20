import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/hero/slides`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        cache: "no-store",
      }
    );

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { message: payload?.message ?? "Error getting slides" },
        { status: response.status }
      );
    }

    return NextResponse.json(adaptBackendResponse(payload), { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");
  const formData = await req.formData();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/hero/slides`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: formData,
      }
    );

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message ?? "Error creating slide",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(adaptBackendResponse(payload), { status: 201 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
