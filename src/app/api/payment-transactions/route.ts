import { adaptBackendResponse, backendUrl, authHeaders } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;

  const qs = new URLSearchParams();
  qs.set("page", params.get("page") || "1");
  qs.set("per_page", params.get("pageSize") || params.get("size") || "15");

  for (const [apiKey, ...aliases] of [
    ["payment_id", "paymentId"],
    ["client_id", "clientId"],
    ["from_date", "fromDate"],
    ["to_date", "toDate"],
  ] as const) {
    const val =
      params.get(apiKey) ||
      params.get(aliases[0]) ||
      "";
    if (val) qs.set(apiKey, val);
  }

  try {
    const response = await fetch(
      `${backendUrl("payment-transactions")}?${qs}`,
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
