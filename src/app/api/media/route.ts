import { adaptBackendResponse, authHeaders, backendUrl, parseBackendJson } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const qs = req.nextUrl.searchParams.toString();

  try {
    const response = await fetch(backendUrl(`media${qs ? `?${qs}` : ""}`), {
      headers: authHeaders(token?.value),
    });

    if (!response.ok) {
      const data = await parseBackendJson(response);
      return NextResponse.json(
        { message: data?.message ?? "Error getting media" },
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
    const formData = await req.formData();
    const response = await fetch(backendUrl("media"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await parseBackendJson(response);
      return NextResponse.json(
        { message: errorData?.message ?? "Error uploading file", details: errorData },
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
