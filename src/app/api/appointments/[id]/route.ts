import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("token");
  const { id } = await params;
  const data = await req.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/appointments/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      return NextResponse.json(
        { message: "Error adding app" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "App updated Successfuly" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  if (!token || !token.value) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/appointments/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

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
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
