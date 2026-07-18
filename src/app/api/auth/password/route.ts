import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, password, password_confirmation } = await req.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/auth/password`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, password, password_confirmation }),
      }
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ??
            payload?.errors?.code?.[0] ??
            payload?.errors?.password?.[0] ??
            "خطا در تغییر رمز عبور",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      payload ?? { message: "رمز عبور با موفقیت تغییر کرد." }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
