import { adaptBackendResponse, authHeaders, backendUrl, parseBackendJson } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");

  try {
    const response = await fetch(backendUrl("media/collections"), {
      headers: authHeaders(token?.value),
    });

    if (!response.ok) {
      const data = await parseBackendJson(response);
      return NextResponse.json(
        { message: data?.message ?? "Error getting collections" },
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
