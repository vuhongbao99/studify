import Link from "next/link";
import { CombineLessonsForm } from "@/components/combine-lessons-form";
import { getLessons } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Danh sách bài học</h1>
        <Link href="/" className="text-sm font-medium text-sky-700 hover:underline">
          Upload bài mới
        </Link>
      </div>

      <section className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="rounded-lg border p-3">
            <Link className="text-lg font-semibold text-slate-900 hover:underline" href={`/lessons/${lesson.id}`}>
              {lesson.title}
            </Link>
            <p className="text-sm text-slate-500">{lesson.source_filename}</p>
          </article>
        ))}
        {lessons.length === 0 ? <p className="text-slate-500">Chưa có bài học.</p> : null}
      </section>

      <CombineLessonsForm lessons={lessons} />
    </main>
  );
}
