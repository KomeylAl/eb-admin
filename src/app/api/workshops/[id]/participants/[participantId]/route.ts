import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; participantId: string } }
) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const { participantId } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/workshops/${id}/participants/${participantId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      console.log(data);
      return NextResponse.json(
        { message: data?.message ?? "Error deleting participant" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Participant deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Frontend still POSTs participant updates with optional `approved`.
 * New API uses PATCH .../approve or .../unapprove for approval toggles.
 * Other fields are re-submitted via POST create (upsert) when present.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; participantId: string } }
) {
  try {
    const token = req.cookies.get("token");
    const { id } = await params;
    const { participantId } = await params;
    const jsonBody = await req.json();

    if (typeof jsonBody?.approved === "boolean") {
      const action = jsonBody.approved ? "approve" : "unapprove";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/workshops/${id}/participants/${participantId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.value}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return NextResponse.json(
          { message: "خطا در ویرایش شرکت کننده", details: errorData },
          { status: response.status }
        );
      }

      const data = await response.json().catch(() => ({ message: "OK" }));
      return NextResponse.json(data, { status: 200 });
    }

    // Fallback: upsert participant via create endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/workshops/${id}/participants`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify(jsonBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Participant updating error:", errorData);
      return NextResponse.json(
        { message: "خطا در ویرایش شرکت کننده", details: errorData },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(
      "POST /api/workshops/[id]/participants/[id] error:",
      error.message
    );
    return NextResponse.json(
      { message: "مشکلی در سرور رخ داد", error: error.message },
      { status: 500 }
    );
  }
}
