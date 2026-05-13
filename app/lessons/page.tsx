import Link from "next/link";
import { CombineLessonsForm } from "@/components/combine-lessons-form";
import { LessonDeleteButton } from "@/components/lesson-delete-button";
import { getLessons } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Danh sách bài học</h1>
        <Link href="/" className="text-sm font-semibold text-indigo-700 hover:underline">
          Tạo bài mới
        </Link>
      </div>

      <section className="space-y-3 rounded-3xl border border-indigo-100 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-indigo-900/40 dark:bg-slate-900/40">
        {lessons.map((lesson) => (
          <article
            key={lesson.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-indigo-50/60 p-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-700 dark:from-slate-900/80 dark:to-indigo-950/40"
          >
            <Link
              className="text-lg font-semibold text-slate-900 hover:underline dark:text-slate-100"
              href={`/lessons/${lesson.id}`}
            >
              {lesson.title}
            </Link>
            <LessonDeleteButton lessonId={lesson.id} lessonTitle={lesson.title} variant="list" />
          </article>
        ))}
        {lessons.length === 0 ? <p className="text-slate-500">Chưa có bài học.</p> : null}
      </section>

      <CombineLessonsForm lessons={lessons} />
    </main>
  );
}
