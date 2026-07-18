import { normalizeDoctorsPayload } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const page = params.get("page") || "1";
  const pageSize = params.get("pageSize") || params.get("size") || "10";
  const search = params.get("search") || "";
  const sortBy = params.get("sort_by") || "sort_order";
  const sortDirection = params.get("sort_direction") || "asc";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/doctors?page=${page}&per_page=${pageSize}&search=${encodeURIComponent(search)}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return NextResponse.json(
        { message: "Error getting doctors" },
        { status: response.status }
      );
    }

    const data = normalizeDoctorsPayload(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  
  try {
    const token = req.cookies.get("token");
    const formData = await req.formData();
    console.log(formData)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/doctors`,
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
      const data = await response.json();
      console.log(data);
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Doctor added successfuly" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
