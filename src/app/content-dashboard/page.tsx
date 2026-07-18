"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { useContentDashboard } from "@/hooks/useContentDashboard";
import {
  ChartCard,
  DashboardSkeleton,
  SectionCard,
  StatCard,
  StatusBadge,
  StatusDonutChart,
  TrendAreaChart,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CalendarDays,
  FilePenLine,
  FileText,
  FolderTree,
  Plus,
  Tags,
} from "lucide-react";
import TransitionLink from "@/components/ui/TransitionLink";

const ContentDashboard = () => {
  const { data, isLoading, isError, refetch } = useContentDashboard();

  return (
    <div className="flex-1 h-screen overflow-y-auto flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />

      <div className="flex-1 p-4 md:p-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-xl md:text-2xl">داشبورد محتوا</h2>
            <p className="text-sm text-muted-foreground mt-1">
              آمار مطالب، دسته‌ها و کارگاه‌ها برای مدیریت سریع‌تر محتوا
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/content-dashboard/categories">
                <FolderTree />
                دسته‌بندی
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/content-dashboard/workshops">
                <CalendarDays />
                کارگاه
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/content-dashboard/posts/create">
                <Plus />
                مطلب جدید
              </Link>
            </Button>
          </div>
        </div>

        {isLoading && <DashboardSkeleton stats={5} />}

        {isError && (
          <div className="rounded-xl border border-dashed p-8 text-center space-y-3">
            <p className="text-rose-500">خطا در دریافت آمار محتوا</p>
            <Button variant="outline" onClick={() => refetch()}>
              تلاش مجدد
            </Button>
          </div>
        )}

        {data && (
          <>
            {data.partialErrors.length > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                برخی منابع داده در دسترس نبودند؛ آمار ممکن است ناقص باشد.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title="کل مطالب"
                value={data.totals.posts}
                icon={FileText}
                iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-300"
              />
              <StatCard
                title="منتشرشده"
                value={data.totals.published}
                description="مطالب قابل نمایش در سایت"
                icon={FilePenLine}
                iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              />
              <StatCard
                title="پیش‌نویس"
                value={data.totals.drafts}
                description="نیازمند تکمیل و انتشار"
                icon={FileText}
                iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-300"
              />
              <StatCard
                title="دسته‌بندی‌ها"
                value={data.totals.categories}
                description={`${data.totals.tags.toLocaleString("fa-IR")} برچسب`}
                icon={Tags}
                iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-300"
              />
              <StatCard
                title="کارگاه‌ها"
                value={data.totals.workshops}
                description={`${data.totals.departments.toLocaleString("fa-IR")} دپارتمان`}
                icon={Building2}
                iconClassName="bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <ChartCard
                className="lg:col-span-3"
                title="فعالیت محتوا"
                description="انتشار / ایجاد مطلب در ۳۰ روز اخیر"
                empty={data.publishTrend.every((d) => d.count === 0)}
              >
                <TrendAreaChart
                  data={data.publishTrend}
                  color="var(--chart-1)"
                  valueLabel="مطلب"
                />
              </ChartCard>

              <ChartCard
                className="lg:col-span-2"
                title="وضعیت مطالب"
                description="توزیع draft / published / archived"
                empty={data.postStatus.length === 0}
              >
                <StatusDonutChart data={data.postStatus} />
              </ChartCard>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <SectionCard
                title="آخرین مطالب"
                description="جدیدترین نوشته‌ها برای ویرایش سریع"
                href="/content-dashboard/posts"
              >
                <div className="divide-y">
                  {data.recentPosts.length === 0 && (
                    <p className="p-6 text-sm text-muted-foreground text-center">
                      مطلبی ثبت نشده است
                    </p>
                  )}
                  {data.recentPosts.map((post) => (
                    <TransitionLink
                      key={post.id}
                      href={`/content-dashboard/posts/${post.slug}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.dateLabel}
                        </p>
                      </div>
                      <StatusBadge status={post.status} />
                    </TransitionLink>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="کارگاه‌های پیش‌رو"
                description="کارگاه‌هایی که هنوز شروع نشده‌اند"
                href="/content-dashboard/workshops"
              >
                <div className="divide-y">
                  {data.upcomingWorkshops.length === 0 && (
                    <p className="p-6 text-sm text-muted-foreground text-center">
                      کارگاه پیش‌رویی وجود ندارد
                    </p>
                  )}
                  {data.upcomingWorkshops.map((workshop) => (
                    <TransitionLink
                      key={workshop.id}
                      href={`/content-dashboard/workshops/${workshop.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium truncate">{workshop.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {[workshop.dateLabel, workshop.week_day, workshop.time]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                    </TransitionLink>
                  ))}
                </div>
              </SectionCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentDashboard;
