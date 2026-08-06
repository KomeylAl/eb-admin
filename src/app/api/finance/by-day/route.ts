import { adaptBackendResponse, backendUrl, authHeaders } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const qs = new URLSearchParams();

  for (const key of ["from", "to", "doctor_id", "doctorId"] as const) {
    const val = params.get(key) || "";
    if (!val) continue;
    if (key === "doctorId") qs.set("doctor_id", val);
    else qs.set(key, val);
  }

  try {
    const response = await fetch(
      `${backendUrl("finance/reports/by-day")}?${qs}`,
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
