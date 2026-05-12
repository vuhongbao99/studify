import Link from "next/link";
import { UploadForm } from "@/components/upload-form";
import { getLessons } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lessons = await getLessons();
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 md:px-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Studify AI</h1>
        <p className="max-w-2xl text-slate-600">
          Upload file Word, AI sẽ tự tạo tên bài học + bộ câu hỏi đáp án để học kiểu Quizlet cho kỳ thi
          công an văn bằng 2.
        </p>
      </section>

      <UploadForm />

      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Bài học đã tạo</h2>
          <Link className="text-sm font-medium text-sky-700 hover:underline" href="/lessons">
            Xem tất cả
          </Link>
        </div>
        <ul className="space-y-2">
          {lessons.slice(0, 5).map((lesson) => (
            <li key={lesson.id} className="rounded-lg border bg-slate-50 p-3">
              <Link href={`/lessons/${lesson.id}`} className="font-medium text-slate-900 hover:underline">
                {lesson.title}
              </Link>
              <p className="text-sm text-slate-500">{lesson.source_filename}</p>
            </li>
          ))}
        </ul>
        {lessons.length === 0 ? <p className="text-sm text-slate-500">Chưa có bài học nào.</p> : null}
      </section>
    </main>
  );
}
