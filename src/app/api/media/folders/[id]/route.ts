import { authHeaders, backendUrl, parseBackendJson } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  try {
    const response = await fetch(backendUrl(`media/folders/${id}`), {
      method: "DELETE",
      headers: authHeaders(token?.value),
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await parseBackendJson(response);
      return NextResponse.json(
        { message: errorData?.message ?? "Error deleting folder" },
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
