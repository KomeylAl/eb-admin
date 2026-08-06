import { adaptBackendResponse, backendUrl, authHeaders } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;

  const qs = new URLSearchParams();
  const page = params.get("page") || "1";
  const pageSize = params.get("pageSize") || params.get("size") || "15";
  qs.set("page", page);
  qs.set("per_page", pageSize);

  for (const key of [
    "search",
    "client_id",
    "doctor_id",
    "status",
    "method",
    "from_date",
    "to_date",
    "sort_by",
    "sort_direction",
  ] as const) {
    const camel =
      key === "client_id"
        ? "clientId"
        : key === "doctor_id"
          ? "doctorId"
          : key === "from_date"
            ? "fromDate"
            : key === "to_date"
              ? "toDate"
              : key === "sort_by"
                ? "sortBy"
                : key === "sort_direction"
                  ? "sortDirection"
                  : key;
    const val = params.get(key) || params.get(camel) || "";
    if (val) qs.set(key, val);
  }

  try {
    const response = await fetch(`${backendUrl("payments")}?${qs}`, {
      method: "GET",
      headers: authHeaders(token?.value),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({ message: data }, { status: response.status });
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
