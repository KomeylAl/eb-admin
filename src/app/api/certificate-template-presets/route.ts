import { adaptBackendResponse, authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const response = await fetch(backendUrl("certificate-template-presets"), {
    headers: authHeaders(token?.value),
  });
  const data = adaptBackendResponse(await response.json().catch(() => ({})));
  return NextResponse.json(data, { status: response.status });
}
