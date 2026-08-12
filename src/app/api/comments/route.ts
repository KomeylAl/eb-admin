import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const page = params.get("page") || "1";
  const pageSize = params.get("pageSize") || params.get("size") || "10";
  const search = params.get("search") || "";
  const approved = params.get("approved") || "";
  const commentableType = params.get("commentable_type") || "";

  const query = new URLSearchParams({
    page,
    per_page: pageSize,
  });
  if (search) query.set("search", search);
  if (approved) query.set("approved", approved);
  if (commentableType) query.set("commentable_type", commentableType);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/comments?${query.toString()}`,
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
      const data = await response.json().catch(() => ({}));
      console.log(data);
      return NextResponse.json(
        { message: "Error getting comments" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
