import { useQuery } from "@tanstack/react-query";
import {
  asNullableString,
  asString,
  buildDailyCounts,
  countByField,
  fetchCollection,
  formatFaDate,
  getLocalDateKey,
  safeTotal,
  type DayCount,
  type NamedCount,
} from "@/lib/dashboard";

export type ContentDashboardData = {
  totals: {
    posts: number;
    published: number;
    drafts: number;
    categories: number;
    tags: number;
    workshops: number;
    departments: number;
  };
  publishTrend: DayCount[];
  postStatus: NamedCount[];
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    published_at?: string | null;
    created_at?: string | null;
    dateLabel: string;
  }>;
  upcomingWorkshops: Array<{
    id: string;
    title: string;
    slug?: string;
    start_date?: string | null;
    week_day?: string | null;
    time?: string | null;
    dateLabel: string;
  }>;
  partialErrors: string[];
};

const POST_STATUS_LABELS: Record<string, string> = {
  draft: "پیش‌نویس",
  published: "منتشرشده",
  archived: "آرشیو",
};

async function loadContentDashboard(): Promise<ContentDashboardData> {
  const partialErrors: string[] = [];
  const todayKey = getLocalDateKey();

  const [posts, categories, tags, workshops, departments] = await Promise.all([
    fetchCollection("/api/posts"),
    fetchCollection("/api/categories"),
    fetchCollection("/api/tags"),
    fetchCollection("/api/workshops"),
    fetchCollection("/api/departments"),
  ]);

  if (!posts.ok) partialErrors.push("posts");
  if (!categories.ok) partialErrors.push("categories");
  if (!tags.ok) partialErrors.push("tags");
  if (!workshops.ok) partialErrors.push("workshops");
  if (!departments.ok) partialErrors.push("departments");

  const published = posts.data.filter((p) => p?.status === "published").length;
  const drafts = posts.data.filter((p) => p?.status === "draft").length;

  const publishTrend = buildDailyCounts(
    posts.data.filter((p) => p?.status === "published" || p?.published_at),
    "published_at",
    30
  );
  // Fallback to created_at for drafts/new content activity
  const createdTrend = buildDailyCounts(posts.data, "created_at", 30);
  const mergedTrend = publishTrend.map((day, i) => ({
    ...day,
    count: Math.max(day.count, createdTrend[i]?.count || 0),
  }));

  const recentPosts = [...posts.data]
    .sort((a, b) => {
      const da = new Date(
        asString(a.updated_at || a.created_at, "0")
      ).getTime();
      const db = new Date(
        asString(b.updated_at || b.created_at, "0")
      ).getTime();
      return db - da;
    })
    .slice(0, 6)
    .map((p) => {
      const publishedAt = asNullableString(p.published_at);
      const createdAt = asNullableString(p.created_at);
      return {
        id: asString(p.id),
        title: asString(p.title, "بدون عنوان"),
        slug: asString(p.slug),
        status: asString(p.status, "draft"),
        published_at: publishedAt,
        created_at: createdAt,
        dateLabel: formatFaDate(publishedAt || createdAt),
      };
    });

  const upcomingWorkshops = [...workshops.data]
    .filter((w) => {
      const start = asNullableString(w.start_date)?.slice(0, 10) ?? null;
      return !start || start >= todayKey;
    })
    .sort((a, b) => {
      const da = asString(a.start_date, "9999");
      const db = asString(b.start_date, "9999");
      return da.localeCompare(db);
    })
    .slice(0, 5)
    .map((w) => {
      const startDate = asNullableString(w.start_date);
      return {
        id: asString(w.id),
        title: asString(w.title, "کارگاه"),
        slug: asString(w.slug) || undefined,
        start_date: startDate,
        week_day: asNullableString(w.week_day),
        time: asNullableString(w.time),
        dateLabel: formatFaDate(startDate),
      };
    });

  return {
    totals: {
      posts: safeTotal(posts.meta, posts.data.length),
      published,
      drafts,
      categories: safeTotal(categories.meta, categories.data.length),
      tags: safeTotal(tags.meta, tags.data.length),
      workshops: safeTotal(workshops.meta, workshops.data.length),
      departments: safeTotal(departments.meta, departments.data.length),
    },
    publishTrend: mergedTrend,
    postStatus: countByField(posts.data, "status", POST_STATUS_LABELS),
    recentPosts,
    upcomingWorkshops,
    partialErrors,
  };
}

export function useContentDashboard() {
  return useQuery({
    queryKey: ["content-dashboard"],
    queryFn: loadContentDashboard,
    staleTime: 60_000,
  });
}
