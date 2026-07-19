import { adaptBackendResponse } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

const emptyResume = {
  id: null,
  doctor_id: null,
  title: "",
  bio: "",
  specialization: "",
  educations: [],
  experiences: [],
  skills: [],
  certifications: [],
  social_links: {
    linkedin: "",
    instagram: "",
    website: "",
    twitter: "",
  },
  content: "",
  file_path: null,
  file_url: null,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const token = req.cookies.get("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/doctors/${id}/resume`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            message: payload?.message ?? "Resume not found.",
            ...emptyResume,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          message: payload?.message || "Error getting resume",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    if (payload?.data == null) {
      return NextResponse.json(
        {
          message: payload?.message ?? "Resume not found.",
          ...emptyResume,
        },
        { status: 200 }
      );
    }

    const adapted = adaptBackendResponse(payload);
    const resume =
      adapted?.data &&
      typeof adapted.data === "object" &&
      !Array.isArray(adapted.data)
        ? adapted.data
        : adapted;

    return NextResponse.json(
      {
        message: adapted?.message ?? "Success",
        ...resume,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const token = req.cookies.get("token");
    const formData = await req.formData();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/doctors/${id}/resume`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: formData,
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error saving resume",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Resume saved successfully.",
        ...(payload?.data ?? {}),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
