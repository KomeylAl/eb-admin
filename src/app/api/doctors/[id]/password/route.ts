import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { password } = await req.json();
    if (!password)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/doctors/${id}/password`,
      {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.log(error)
      return NextResponse.json(
        { message: `${error ?? "خطا در ایحاد رمز عبور"}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "OK" }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}
