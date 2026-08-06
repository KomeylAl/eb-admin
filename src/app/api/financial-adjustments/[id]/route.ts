import { adaptBackendResponse, backendUrl, authHeaders } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  try {
    const response = await fetch(backendUrl(`financial-adjustments/${id}`), {
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
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const body = await req.json();

  try {
    const response = await fetch(backendUrl(`financial-adjustments/${id}`), {
      method: "PUT",
      headers: {
        ...authHeaders(token?.value),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  try {
    const response = await fetch(backendUrl(`financial-adjustments/${id}`), {
      method: "DELETE",
      headers: authHeaders(token?.value),
    });
    if (!response.ok && response.status !== 204) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({ message: data }, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
