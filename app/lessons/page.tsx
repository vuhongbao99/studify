import Link from "next/link";
import { CombineLessonsForm } from "@/components/combine-lessons-form";
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

      <section className="space-y-3 rounded-3xl border border-indigo-100 bg-white/90 p-5 shadow-sm backdrop-blur">
        {lessons.map((lesson) => (
          <article
            key={lesson.id}
            className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-indigo-50/60 p-4"
          >
            <Link className="text-lg font-semibold text-slate-900 hover:underline" href={`/lessons/${lesson.id}`}>
              {lesson.title}
            </Link>
          </article>
        ))}
        {lessons.length === 0 ? <p className="text-slate-500">Chưa có bài học.</p> : null}
      </section>

      <CombineLessonsForm lessons={lessons} />
    </main>
  );
}
