import type {
  DoctorResumeApi,
  DoctorResumeFormValues,
  ResumeSocialLinks,
} from "../../types/resumeTypes";

const META_KEYS = new Set([
  "id",
  "doctor_id",
  "file_path",
  "file_url",
  "created_at",
  "updated_at",
]);

export const emptySocialLinks = (): ResumeSocialLinks => ({
  linkedin: "",
  instagram: "",
  website: "",
  twitter: "",
});

export const emptyResumeForm = (): DoctorResumeFormValues => ({
  title: "",
  bio: "",
  specialization: "",
  content: "",
  educations: [{ degree: "", institution: "", year: "" }],
  experiences: [],
  skills: [],
  certifications: [],
  social_links: emptySocialLinks(),
  file: null,
  file_url: null,
});

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(","))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeSocialLinks(value: unknown): ResumeSocialLinks {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return emptySocialLinks();
  }
  const links = value as Record<string, unknown>;
  return {
    linkedin: String(links.linkedin ?? ""),
    instagram: String(links.instagram ?? ""),
    website: String(links.website ?? ""),
    twitter: String(links.twitter ?? ""),
  };
}

/** Flatten API payloads that may be nested under `data`. */
export function unwrapResumePayload(payload: unknown): DoctorResumeApi | null {
  if (!payload || typeof payload !== "object") return null;
  const body = payload as Record<string, unknown>;
  if (body.data && typeof body.data === "object" && !Array.isArray(body.data)) {
    return body.data as DoctorResumeApi;
  }
  if ("title" in body || "bio" in body || "content" in body) {
    return body as DoctorResumeApi;
  }
  return null;
}

export function resumeToFormValues(
  resume?: DoctorResumeApi | null
): DoctorResumeFormValues {
  if (!resume) return emptyResumeForm();

  return {
    title: resume.title ?? "",
    bio: resume.bio ?? "",
    specialization: resume.specialization ?? "",
    content: resume.content ?? "",
    educations: resume.educations?.length
      ? resume.educations
      : [{ degree: "", institution: "", year: "" }],
    experiences: resume.experiences ?? [],
    skills: asStringArray(resume.skills).join(", "),
    certifications: asStringArray(resume.certifications),
    social_links: normalizeSocialLinks(resume.social_links),
    file: null,
    file_url: resume.file_url ?? null,
  };
}

export function normalizeResumeForSave(
  data: DoctorResumeFormValues
): DoctorResumeFormValues {
  return {
    ...data,
    title: data.title ?? "",
    bio: data.bio ?? "",
    specialization: data.specialization ?? "",
    content: data.content ?? "",
    educations: Array.isArray(data.educations) ? data.educations : [],
    experiences: Array.isArray(data.experiences) ? data.experiences : [],
    skills: asStringArray(data.skills),
    certifications: asStringArray(data.certifications),
    social_links: normalizeSocialLinks(data.social_links),
  };
}

/**
 * Parse pasted backup/export JSON into form-ready resume fields.
 * Accepts a single object or an array (uses first item).
 */
export function parseResumeJsonInput(raw: string): DoctorResumeFormValues {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("متن JSON خالی است");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("ساختار JSON معتبر نیست");
  }

  let record: unknown = parsed;
  if (Array.isArray(parsed)) {
    if (!parsed.length) throw new Error("آرایه JSON خالی است");
    record = parsed[0];
  }

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("JSON باید یک آبجکت رزومه باشد");
  }

  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record as Record<string, unknown>)) {
    if (META_KEYS.has(key)) continue;
    cleaned[key] = value;
  }

  return resumeToFormValues(cleaned as DoctorResumeApi);
}
