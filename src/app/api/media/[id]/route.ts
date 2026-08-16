import { adaptBackendResponse, authHeaders, backendUrl, parseBackendJson } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  try {
    const body = await req.json();
    const response = await fetch(backendUrl(`media/${id}`), {
      method: "PATCH",
      headers: {
        ...authHeaders(token?.value),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await parseBackendJson(response);
      return NextResponse.json(
        { message: errorData?.message ?? "Error updating media" },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  try {
    const response = await fetch(backendUrl(`media/${id}`), {
      method: "DELETE",
      headers: authHeaders(token?.value),
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await parseBackendJson(response);
      return NextResponse.json(
        { message: errorData?.message ?? "Error deleting media" },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
