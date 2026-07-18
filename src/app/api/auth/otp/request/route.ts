import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/auth/otp/request`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, type: "admin" }),
      }
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ??
            payload?.errors?.phone?.[0] ??
            "خطا در ارسال کد ورود",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload ?? { message: "کد ورود ارسال شد." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
