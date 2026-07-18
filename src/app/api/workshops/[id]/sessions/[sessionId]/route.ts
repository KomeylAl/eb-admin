import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; sessionId: string } }
) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const { sessionId } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/workshops/${id}/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return NextResponse.json(
        { message: "Error deleteing session" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; sessionId: string } }
) {
  try {
    const token = req.cookies.get("token");
    const { id } = await params;
    const { sessionId } = await params;

    const jsonBody = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/workshops/${id}/sessions/${sessionId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify(jsonBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Session updating error:", errorData);

      return NextResponse.json(
        { message: "خطا در ویرایش جلسه", details: errorData },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error(
      "POST /api/workshops/[id]/sessions/[id] error:",
      error.message
    );
    return NextResponse.json(
      { message: "مشکلی در سرور رخ داد", error: error.message },
      { status: 500 }
    );
  }
}
