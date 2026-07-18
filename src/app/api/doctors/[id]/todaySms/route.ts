import { NextRequest, NextResponse } from "next/server";

/**
 * Old backend had GET /doctors/{id}/panel/today-sms.
 * New API: fetch today's appointments, then send SMS via /sms/multi.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("token");
  const { id } = await params;

  try {
    const appsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/doctors/${id}/appointments/today`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    if (!appsRes.ok) {
      return NextResponse.json(
        { message: "Error fetching today's appointments" },
        { status: appsRes.status }
      );
    }

    const appsPayload = await appsRes.json();
    const appointments = Array.isArray(appsPayload?.data)
      ? appsPayload.data
      : Array.isArray(appsPayload)
        ? appsPayload
        : [];

    const phones = [
      ...new Set(
        appointments
          .map((a: any) => a?.client?.phone)
          .filter((p: string | undefined) => !!p)
      ),
    ] as string[];

    if (phones.length === 0) {
      return NextResponse.json(
        { message: "No clients with phone numbers for today" },
        { status: 404 }
      );
    }

    const smsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/sms/multi`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify({
          phones,
          message:
            "یادآوری نوبت کلینیک ابراز: امروز نوبت شماست. لطفاً رأس ساعت تعیین‌شده حضور داشته باشید.",
        }),
      }
    );

    if (!smsRes.ok) {
      const err = await smsRes.json().catch(() => null);
      return NextResponse.json(
        { message: err?.message ?? "Error sending sms" },
        { status: smsRes.status }
      );
    }

    return NextResponse.json(
      { message: "Sms sent successfully", count: phones.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
