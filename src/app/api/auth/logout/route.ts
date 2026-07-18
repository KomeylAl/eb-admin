import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");
  try {
    if (token?.value) {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/auth/logout`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
    }

    const res = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    res.cookies.delete("token");
    res.cookies.delete("role");
    return res;
  } catch (error: any) {
    console.log(error);
    const res = NextResponse.json(
      { message: `Something went wrong ${error.message}` },
      { status: 500 }
    );
    res.cookies.delete("token");
    res.cookies.delete("role");
    return res;
  }
}
