import { adaptBackendResponse, authHeaders, backendUrl, parseBackendJson } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const qs = req.nextUrl.searchParams.toString();

  try {
    const response = await fetch(
      backendUrl(`media/folders${qs ? `?${qs}` : ""}`),
      { headers: authHeaders(token?.value) }
    );

    if (!response.ok) {
      const data = await parseBackendJson(response);
      return NextResponse.json(
        { message: data?.message ?? "Error getting folders" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");

  try {
    const body = await req.json();
    const response = await fetch(backendUrl("media/folders"), {
      method: "POST",
      headers: {
        ...authHeaders(token?.value),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await parseBackendJson(response);
      return NextResponse.json(
        { message: errorData?.message ?? "Error creating folder" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
