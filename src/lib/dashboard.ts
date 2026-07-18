export type DayCount = { date: string; label: string; count: number };
export type NamedCount = { name: string; value: number; color?: string };

export function getLocalDateKey(input: Date = new Date()): string {
  const y = input.getFullYear();
  const m = String(input.getMonth() + 1).padStart(2, "0");
  const d = String(input.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toDateKey(input?: string | Date | null): string | null {
  if (!input) return null;
  if (typeof input === "string") {
    const match = input.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return null;
  return getLocalDateKey(d);
}

export function getLastNDays(days: number = 30): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    result.push(getLocalDateKey(d));
  }
  return result;
}

export function formatFaDayLabel(dateKey: string): string {
  try {
    return new Date(`${dateKey}T12:00:00`).toLocaleDateString("fa-IR", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateKey;
  }
}

export function formatFaDate(input?: string | null): string {
  if (!input) return "—";
  try {
    return new Date(input).toLocaleDateString("fa-IR");
  } catch {
    return input;
  }
}

export type RecordLike = Record<string, unknown>;

export function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

export function asNullableString(value: unknown): string | null {
  if (value == null) return null;
  const str = asString(value);
  return str || null;
}

export type CollectionMeta = {
  total?: number;
  last_page?: number;
  current_page?: number;
  per_page?: number;
} | null;

export function buildDailyCounts(
  items: RecordLike[],
  dateField: string,
  days: number = 30
): DayCount[] {
  const keys = getLastNDays(days);
  const map = new Map(keys.map((k) => [k, 0]));

  for (const item of items) {
    const raw = item?.[dateField];
    const key = toDateKey(
      typeof raw === "string" || raw instanceof Date ? raw : null
    );
    if (key && map.has(key)) {
      map.set(key, (map.get(key) || 0) + 1);
    }
  }

  return keys.map((date) => ({
    date,
    label: formatFaDayLabel(date),
    count: map.get(date) || 0,
  }));
}

export function countByField(
  items: RecordLike[],
  field: string,
  labels?: Record<string, string>
): NamedCount[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const raw = item?.[field] ?? "unknown";
    const key = String(raw);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries()).map(([key, value]) => ({
    name: labels?.[key] ?? key,
    value,
  }));
}

export async function fetchCollection(
  path: string,
  pageSize: number = 100
): Promise<{ data: RecordLike[]; meta: CollectionMeta; ok: boolean }> {
  try {
    const first = await fetch(
      `${path}${path.includes("?") ? "&" : "?"}page=1&pageSize=${pageSize}&size=${pageSize}`,
      { cache: "no-store" }
    );
    const json = await first.json().catch(() => null);
    if (!first.ok) {
      return { data: [], meta: null, ok: false };
    }

    let data: RecordLike[] = Array.isArray(json?.data)
      ? [...(json.data as RecordLike[])]
      : [];
    const meta = (json?.meta as CollectionMeta) ?? null;
    const lastPage = Number(meta?.last_page || 1);

    // Cap extra pages to keep dashboard responsive
    const maxPages = Math.min(lastPage, 5);
    for (let page = 2; page <= maxPages; page++) {
      const res = await fetch(
        `${path}${path.includes("?") ? "&" : "?"}page=${page}&pageSize=${pageSize}&size=${pageSize}`,
        { cache: "no-store" }
      );
      const pageJson = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(pageJson?.data)) break;
      data = data.concat(pageJson.data as RecordLike[]);
    }

    return { data, meta, ok: true };
  } catch {
    return { data: [], meta: null, ok: false };
  }
}

export function safeTotal(meta: CollectionMeta, fallbackLength = 0): number {
  const total = Number(meta?.total);
  return Number.isFinite(total) ? total : fallbackLength;
}
