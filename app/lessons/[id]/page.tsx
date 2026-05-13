import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonDeleteButton } from "@/components/lesson-delete-button";
import { StudyPlayer } from "@/components/study-player";
import { getLessonById } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await getLessonById(id);

  if (!lesson) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <div className="space-y-3">
        <Link href="/lessons" className="text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-300">
          ← Quay lại danh sách bài học
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{lesson.title}</h1>
            <p className="max-w-3xl text-slate-600 dark:text-slate-300">{lesson.source_summary}</p>
          </div>
          <LessonDeleteButton lessonId={lesson.id} lessonTitle={lesson.title} variant="detail" />
        </div>
      </div>
      <StudyPlayer cards={lesson.cards} title="Luyện theo bài học" />
    </main>
  );
}
