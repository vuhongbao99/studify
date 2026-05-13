import Link from "next/link";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PageContainer } from "@/components/page-container";
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

  const title =
    lessons.length === 1 ? lessons[0]!.title : `Gộp ${lessons.length} bài`;

  return (
    <PageContainer variant="study" className="space-y-6">
      <div className="space-y-3">
        <BreadcrumbNav items={[{ label: "Thư viện", href: "/lessons" }, { label: "Học gộp" }]} />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {lessons.length} bài đang gộp trong một phiên học.{" "}
          <Link href="/lessons" className="font-semibold text-[var(--color-primary)] hover:underline">
            Chọn lại
          </Link>
        </p>
      </div>
      <StudyPlayer cards={cards} title="Phiên ôn tập" />
    </PageContainer>
  );
}
