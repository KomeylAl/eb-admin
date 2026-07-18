import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/auth/password/otp`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message ?? "خطا در ارسال کد تغییر رمز",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload ?? { message: "کد تغییر رمز ارسال شد." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
