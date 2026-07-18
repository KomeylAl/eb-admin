import { adaptBackendResponse } from "@/lib/backend";
import { sendSingleSms } from "@/lib/smsHandlre";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  const params = req.nextUrl.searchParams;
  const page = params.get("page") || 0;
  const pageSize = params.get("pageSize") || params.get("size") || "10";
  const search = params.get("search") || "";
  const date = params.get("date") || "";
  const clientId = params.get("clientId") || "";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/assessments?page=${page}&per_page=${pageSize}&search=${search}&client_id=${clientId}&date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      return NextResponse.json(
        { message: "Error getting assessments" },
        { status: response.status }
      );
    }

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token");

    const formData = await req.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/assessments`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Unknown error" };
      }
      console.error("Assessment creation error:", errorData);

      return NextResponse.json(
        { message: "Error creating assessments", details: errorData },
        { status: response.status }
      );
    }

    await sendSingleSms(
      `کلینیک ابراز\n${formData.client.name} عزیز\nنوبت شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.`,
      formData.client.phone
    );

    const data = adaptBackendResponse(await response.json());
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/assessments error:", error.message);
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
