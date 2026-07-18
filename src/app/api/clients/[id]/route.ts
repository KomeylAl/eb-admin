import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const token = req.cookies.get("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/clients/${id}`,
      {
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

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  const data = await req.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/clients/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: `${data?.message ?? "خطا در ویرایش مراجع"}` },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Client updated successfuly" },
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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/clients/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );
    if (!response.ok) {
      const text = await response.text();
      const data = text
        ? JSON.parse(text)
        : { message: "خطا در حذف مراجع" };
      return NextResponse.json(
        { message: `${data?.message ?? "خطا در حذف مراجع"}` },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
