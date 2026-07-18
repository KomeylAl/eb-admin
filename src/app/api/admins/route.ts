import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const search = params.get("search") || "";
  const page = params.get("page") || "1";
  const pageSize = params.get("pageSize") || params.get("size") || "10";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/admins?search=${search}&page=${page}&per_page=${pageSize}`,
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
      return NextResponse.json(
        { message: "Error getting admins" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());

    // Alias admin_role → role for list UI
    if (Array.isArray(data?.data)) {
      data.data = data.data.map((admin: any) => ({
        ...admin,
        role: admin.admin_role ?? admin.role,
      }));
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");
  const body = await req.json();
  const { name, phone, role, admin_role, birth_date, password } = body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/admins`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify({
          name,
          phone,
          admin_role: admin_role ?? role,
          birth_date,
          password,
        }),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data?.message ?? `Error adding admins`, errors: data?.errors },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Admin added successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
