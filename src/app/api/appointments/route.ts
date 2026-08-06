import { adaptBackendResponse, backendUrl, authHeaders } from "@/lib/backend";
import { toAppointmentPayload } from "@/lib/appointmentPayload";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const qs = new URLSearchParams();
  qs.set("page", params.get("page") || "1");
  qs.set(
    "per_page",
    params.get("pageSize") || params.get("size") || "10"
  );

  for (const [apiKey, alias] of [
    ["search", "search"],
    ["date", "date"],
    ["client_id", "clientId"],
    ["doctor_id", "doctorId"],
    ["status", "status"],
    ["payment_status", "paymentStatus"],
    ["from_date", "fromDate"],
    ["to_date", "toDate"],
    ["sort_by", "sortBy"],
    ["sort_direction", "sortDirection"],
  ] as const) {
    const val = params.get(apiKey) || params.get(alias) || "";
    if (val) qs.set(apiKey, val);
  }

  try {
    const response = await fetch(`${backendUrl("appointments")}?${qs}`, {
      method: "GET",
      headers: {
        ...authHeaders(token?.value),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return NextResponse.json(
        { message: "Error getting appointments" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");
  const body = await req.json();
  const data = toAppointmentPayload(body);

  try {
    const response = await fetch(backendUrl("appointments"), {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        ...authHeaders(token?.value),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log(error);
      return NextResponse.json(
        {
          message: error?.message || "Error adding appointment",
          errors: error?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "App Added Successfuly" },
      { status: response.status === 201 ? 201 : 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
