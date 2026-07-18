import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/auth/me`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Error getting user" },
        { status: response.status }
      );
    }

    const payload = adaptBackendResponse(await response.json());
    const user = payload?.data ?? payload;

    // Alias admin_role → role for existing UI
    if (user && typeof user === "object") {
      return NextResponse.json(
        {
          ...payload,
          data: {
            ...user,
            role: user.admin_role ?? user.role,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
