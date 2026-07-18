import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const token = req.cookies.get("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/notifications/${id}/read`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(
      { message: "Notifications marked as read" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
