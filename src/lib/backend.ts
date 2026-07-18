/**
 * Laravel API base helper (Sanctum + /api/v1).
 */

export function backendUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";
  const normalized = path.replace(/^\/+/, "");
  return `${base}api/v1/${normalized}`;
}

/**
 * Adapts new API pagination `{ data: { items, meta } }` to the
 * shape the admin UI already expects: `{ data: items, meta }`.
 */
export function adaptBackendResponse<T = any>(payload: T): any {
  if (!payload || typeof payload !== "object") return payload;

  const body = payload as Record<string, any>;

  if (
    body.data &&
    typeof body.data === "object" &&
    Array.isArray(body.data.items) &&
    body.data.meta
  ) {
    return {
      message: body.message,
      data: body.data.items,
      meta: body.data.meta,
    };
  }

  return payload;
}

/** Flatten doctor_profile fields for existing admin UI forms/cards. */
export function normalizeDoctor(doctor: any): any {
  if (!doctor || typeof doctor !== "object") return doctor;
  const profile = doctor.doctor_profile ?? {};
  // Prefer public *_url fields over storage paths (docs guidance)
  const avatarUrl =
    doctor.avatar_url ??
    profile.avatar_url ??
    (typeof doctor.avatar === "string" && doctor.avatar.startsWith("http")
      ? doctor.avatar
      : null) ??
    (typeof profile.avatar === "string" && profile.avatar.startsWith("http")
      ? profile.avatar
      : null);

  return {
    ...doctor,
    national_code: doctor.national_code ?? profile.national_code,
    card_number: doctor.card_number ?? profile.card_number,
    medical_number: doctor.medical_number ?? profile.medical_number,
    avatar: avatarUrl,
    avatar_url: avatarUrl,
    days: doctor.days ?? profile.days ?? [],
    times: doctor.times ?? profile.times ?? [],
    departments: doctor.departments ?? [],
  };
}

export function normalizeDoctorsPayload(payload: any): any {
  const adapted = adaptBackendResponse(payload);
  if (Array.isArray(adapted?.data)) {
    return { ...adapted, data: adapted.data.map(normalizeDoctor) };
  }
  if (adapted?.data && typeof adapted.data === "object") {
    return { ...adapted, data: normalizeDoctor(adapted.data) };
  }
  return adapted;
}

export async function parseBackendJson(response: Response): Promise<any> {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return adaptBackendResponse(JSON.parse(text));
  } catch {
    return text;
  }
}

export function authHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}
