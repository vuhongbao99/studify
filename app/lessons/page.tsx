import Link from "next/link";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { CombineLessonsForm } from "@/components/combine-lessons-form";
import { LessonDeleteButton } from "@/components/lesson-delete-button";
import { PageContainer } from "@/components/page-container";
import { getLessons } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <PageContainer className="space-y-8">
      <div className="space-y-2">
        <BreadcrumbNav items={[{ label: "Thư viện" }]} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Bài học của bạn</h1>
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            + Tạo bài mới
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson) => (
          <article
            key={lesson.id}
            className="flex flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-md shadow-slate-900/[0.04] transition hover:border-[var(--color-primary)]/40 hover:shadow-lg dark:bg-[var(--color-surface-elevated)]"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="grid size-14 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)] text-lg font-black text-white"
              >
                {lesson.title.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/lessons/${lesson.id}`} className="block">
                  <h2 className="text-lg font-semibold leading-snug text-slate-900 transition hover:text-[var(--color-primary)] dark:text-slate-50">
                    {lesson.title}
                  </h2>
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{lesson.source_summary}</p>
                <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                  {typeof lesson.card_count === "number" ? `${lesson.card_count} câu` : "—"} · {lesson.source_filename}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
              <Link
                href={`/lessons/${lesson.id}`}
                className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                Mở học
              </Link>
              <LessonDeleteButton lessonId={lesson.id} lessonTitle={lesson.title} variant="list" />
            </div>
          </article>
        ))}
      </section>
      {lessons.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-8 text-center text-slate-500">
          Chưa có bài học.{" "}
          <Link href="/" className="font-semibold text-[var(--color-primary)] hover:underline">
            Tạo bài đầu tiên
          </Link>
        </p>
      ) : null}

      <CombineLessonsForm lessons={lessons} />
    </PageContainer>
  );
}
