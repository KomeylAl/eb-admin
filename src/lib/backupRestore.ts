import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies GET /api/v1/backup/{resource}
 * Flattens `{ data: { url, backup } }` so the UI can use `response.url`.
 */
export async function proxyBackup(req: NextRequest, resource: string) {
  const token = req.cookies.get("token");

  if (!token?.value) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/backup/${resource}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ?? `Error creating ${resource} backup`,
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    const nested = payload?.data ?? {};
    const url = nested.url ?? nested.backup?.file_url ?? payload?.url;

    return NextResponse.json(
      {
        message: payload?.message ?? "Backup created successfully.",
        url,
        backup: nested.backup ?? null,
        data: nested,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Proxies POST /api/v1/restore/{resource}
 * Accepts either a raw array or `{ data: [...] }` from the uploaded JSON file.
 */
export async function proxyRestore(req: NextRequest, resource: string) {
  const token = req.cookies.get("token");

  if (!token?.value) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    let items: any[] | null = null;
    let type = resource;

    if (Array.isArray(body)) {
      items = body;
    } else if (Array.isArray(body?.data)) {
      items = body.data;
      if (typeof body.type === "string") type = body.type;
    } else if (Array.isArray(body?.data?.items)) {
      items = body.data.items;
    } else {
      return NextResponse.json(
        {
          message:
            "Invalid restore payload. Expected an array of records or { data: [...] }.",
        },
        { status: 422 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}api/v1/restore/${resource}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ data: items, type }),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message ?? `Error restoring ${resource}`,
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Data restored successfully.",
        data: payload?.data ?? null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
