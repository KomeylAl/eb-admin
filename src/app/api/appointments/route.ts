import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const page = params.get("page") || "1";
  const pageSize = params.get("pageSize") || params.get("size") || "10";
  const search = params.get("search") || "";
  const date = params.get("date") || "";
  const clientId = params.get("clientId") || "";
  console.log(clientId)

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/appointments?page=${page}&per_page=${pageSize}&search=${search}&date=${date}&client_id=${clientId}`,
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
      return NextResponse.json(
        { message: "Error getting appointments" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");
  const data = await req.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/appointments`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      return NextResponse.json(
        { message: "Error adding app" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "App Added Successfuly" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
