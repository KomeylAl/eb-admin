import { authHeaders, backendUrl } from "@/lib/backend";
import { toAppointmentPayload } from "@/lib/appointmentPayload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const body = await req.json();
  const data = toAppointmentPayload(body);

  try {
    const response = await fetch(backendUrl(`appointments/${id}`), {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        ...authHeaders(token?.value),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log(error);
      return NextResponse.json(
        {
          message: error?.message || "Error updating appointment",
          errors: error?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "App updated Successfuly" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
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

  if (!token || !token.value) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(backendUrl(`appointments/${id}`), {
      method: "DELETE",
      headers: {
        ...authHeaders(token?.value),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Error deleteing appointments" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
