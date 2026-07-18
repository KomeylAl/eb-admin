import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone, password } = await req.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password, type: "admin" }),
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ??
            payload?.errors?.phone?.[0] ??
            "Invalid credentials",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    // Sanctum: { data: { user, token, token_type } }
    const token = payload?.data?.token ?? payload?.token;
    const user = payload?.data?.user ?? payload?.user;
    const adminRole = user?.admin_role ?? user?.role;

    if (!token || !user) {
      return NextResponse.json(
        { message: "Invalid login response from backend" },
        { status: 502 }
      );
    }

    // Keep `role` alias so existing UI (Navbar, WithRole, …) keeps working
    const normalizedUser = {
      ...user,
      role: adminRole,
    };

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
    );
    if (adminRole) {
      headers.append(
        "Set-Cookie",
        `role=${adminRole}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Logged in successfully.",
        user: normalizedUser,
        token,
        token_type: payload?.data?.token_type ?? "Bearer",
      },
      { headers }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: `Something went wrong ${error.message}` },
      { status: 500 }
    );
  }
}
