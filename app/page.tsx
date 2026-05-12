import Link from "next/link";
import { UploadForm } from "@/components/upload-form";
import { getLessons } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lessons = await getLessons();
  return (
    <main className="mx-auto w-full max-w-6xl space-y-7 px-4 py-6 md:px-8 md:py-10">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-xl md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">Studify AI</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Học thẻ thông minh cho người Việt</h1>
        <p className="mt-3 max-w-2xl text-indigo-50">
          Tải file Word lên, AI tự tạo bài học, câu hỏi và đáp án để bạn ôn thi nhanh, dễ nhớ.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/lessons"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Vào thư viện bài học
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <UploadForm />

        <section className="space-y-4 rounded-3xl border border-indigo-100 bg-white/90 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Bài học gần đây</h2>
            <Link className="text-sm font-semibold text-indigo-700 hover:underline" href="/lessons">
              Xem tất cả
            </Link>
          </div>
          <ul className="space-y-2">
            {lessons.slice(0, 5).map((lesson) => (
              <li key={lesson.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Link href={`/lessons/${lesson.id}`} className="font-semibold text-slate-900 hover:underline">
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
          {lessons.length === 0 ? <p className="text-sm text-slate-500">Chưa có bài học.</p> : null}
        </section>
      </section>
    </main>
  );
}
