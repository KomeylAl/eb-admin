import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/comments/${id}/approve`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: data?.message || "Error approving comment" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
