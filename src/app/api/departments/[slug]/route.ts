import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // گرفتن توکن از کوکی
    const token = req.cookies.get("token");
    const { slug } = await params;

    // گرفتن FormData
    const formData = await req.formData();
    if (!formData.has("_method")) {
      formData.append("_method", "PUT");
    }


    // فرستادن درخواست به بک‌اند
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/departments/${slug}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Unknown error" };
      }
      console.error("Department updating error:", errorData);

      return NextResponse.json(
        { message: "Error updating department", details: errorData },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/departments/[slug] error:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const token = req.cookies.get("token");
  const { slug } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/departments/${slug}`,
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
        { message: "Error deleteing department" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Department deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
