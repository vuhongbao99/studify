import Link from "next/link";
import { StudyPlayer } from "@/components/study-player";
import { combineCardsByLesson } from "@/lib/combine";
import { getLessonById } from "@/lib/study-store";

export const dynamic = "force-dynamic";

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ lessonIds?: string }>;
}) {
  const { lessonIds } = await searchParams;
  const ids = (lessonIds ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const lessons = (await Promise.all(ids.map((id) => getLessonById(id)))).filter((item) => item !== null);
  const cards = combineCardsByLesson(
    lessons.map((lesson) => ({
      lessonTitle: lesson.title,
      cards: lesson.cards,
    })),
  );

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 md:px-8">
      <div className="space-y-2">
        <Link href="/lessons" className="text-sm font-medium text-sky-700 hover:underline">
          ← Quay lại chọn bài
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Học gộp nhiều bài</h1>
        <p className="text-slate-600">{lessons.length} bài được chọn cho một phiên học.</p>
      </div>
      <StudyPlayer cards={cards} title="Phiên học tổng hợp" />
    </main>
  );
}
