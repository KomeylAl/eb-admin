import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get("token");
    const { id } = await params;

    const jsonBody = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/workshops/${id}/participants`,
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
      console.error("Participant creation error:", errorData);

      return NextResponse.json(
        { message: "خطا در ایجاد شرکت کننده", details: errorData },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error(
      "POST /api/workshops/[id]/participants error:",
      error.message
    );
    return NextResponse.json(
      { message: "مشکلی در سرور رخ داد", error: error.message },
      { status: 500 }
    );
  }
}
