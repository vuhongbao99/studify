import Link from "next/link";
import { notFound } from "next/navigation";
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
      <div className="space-y-2">
        <Link href="/lessons" className="text-sm font-semibold text-indigo-700 hover:underline">
          ← Quay lại danh sách bài học
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="max-w-3xl text-slate-600">{lesson.source_summary}</p>
      </div>
      <StudyPlayer cards={lesson.cards} title="Luyện theo bài học" />
    </main>
  );
}
