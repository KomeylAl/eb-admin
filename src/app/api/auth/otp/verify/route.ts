import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/auth/otp/verify`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, code, type: "admin" }),
      }
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ??
            payload?.errors?.code?.[0] ??
            payload?.errors?.phone?.[0] ??
            "کد واردشده صحیح نیست.",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    const token = payload?.data?.token ?? payload?.token;
    const user = payload?.data?.user ?? payload?.user;
    const adminRole = user?.admin_role ?? user?.role;

    if (!token || !user) {
      return NextResponse.json(
        { message: "Invalid OTP verification response from backend" },
        { status: 502 }
      );
    }

    const normalizedUser = { ...user, role: adminRole };
    const result = NextResponse.json({
      message: payload?.message ?? "Logged in successfully.",
      user: normalizedUser,
      token,
      token_type: payload?.data?.token_type ?? payload?.token_type ?? "Bearer",
    });

    result.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    if (adminRole) {
      result.cookies.set("role", adminRole, {
        httpOnly: true,
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
