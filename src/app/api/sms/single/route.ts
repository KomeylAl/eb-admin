import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone, text, message } = await req.json();
  try {
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/sms/single`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({
          phone,
          message: message ?? text,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      console.error("SMS API error:", data);
      return NextResponse.json(
        { message: data?.message ?? data },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({ message: "OK" }));
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/sms/single error:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
