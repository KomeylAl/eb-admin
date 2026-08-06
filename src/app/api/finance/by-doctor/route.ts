import { adaptBackendResponse, backendUrl, authHeaders } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const qs = new URLSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);

  try {
    const response = await fetch(
      `${backendUrl("finance/reports/by-doctor")}?${qs}`,
      {
        method: "GET",
        headers: authHeaders(token?.value),
      }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({ message: data }, { status: response.status });
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
