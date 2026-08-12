import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const query = new URLSearchParams();
  for (const key of ["page", "per_page", "search", "is_active", "date"]) {
    const value = params.get(key);
    if (value) query.set(key, value);
  }

  const path = params.get("availability") === "1"
    ? `rooms/availability?date=${params.get("date") || ""}`
    : `rooms?${query}`;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/${path}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");
  const body = await req.json();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/rooms`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify(body),
    }
  );
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
