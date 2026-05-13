import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { UploadForm } from "@/components/upload-form";
import { getLessons } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lessons = await getLessons();
  return (
    <PageContainer className="space-y-8">
      <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-lg shadow-slate-900/5 dark:shadow-none">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-sky-500 px-6 py-8 text-white md:px-10 md:py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">Studify AI</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Học thẻ thông minh cho người Việt
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/90 md:text-lg">
            Tải file Word, AI tạo bộ câu trắc nghiệm và đúng/sai — ôn thi nhanh, dễ nhớ.
          </p>
          <div className="mt-6">
            <Link
              href="/lessons"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] shadow-md transition hover:bg-slate-50"
            >
              Vào thư viện bài học
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_1fr]">
        <UploadForm />

        <section className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-md shadow-slate-900/[0.04] dark:bg-[var(--color-surface-elevated)] md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Gần đây</h2>
            <Link className="text-sm font-semibold text-[var(--color-primary)] hover:underline" href="/lessons">
              Xem tất cả
            </Link>
          </div>
          <ul className="space-y-3">
            {lessons.slice(0, 5).map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="group flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition hover:border-[var(--color-primary)]/35 hover:bg-[var(--color-surface)] hover:shadow-sm dark:bg-slate-800/60"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--color-primary)] text-sm font-black text-white"
                  >
                    {lesson.title.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900 group-hover:text-[var(--color-primary)] dark:text-slate-100">
                      {lesson.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
                      {typeof lesson.card_count === "number" ? `${lesson.card_count} câu` : "Bài học"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {lessons.length === 0 ? <p className="text-sm text-slate-500">Chưa có bài học.</p> : null}
        </section>
      </section>
    </PageContainer>
  );
}
