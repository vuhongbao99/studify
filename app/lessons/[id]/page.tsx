import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { LessonDeleteButton } from "@/components/lesson-delete-button";
import { PageContainer } from "@/components/page-container";
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
    <PageContainer variant="study" className="space-y-6">
      <div className="space-y-3">
        <BreadcrumbNav items={[{ label: "Thư viện", href: "/lessons" }, { label: lesson.title }]} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
              {lesson.title}
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{lesson.source_summary}</p>
            <p className="text-xs font-medium text-slate-400">
              {lesson.cards.length} câu · {lesson.source_filename}
            </p>
          </div>
          <LessonDeleteButton lessonId={lesson.id} lessonTitle={lesson.title} variant="detail" />
        </div>
      </div>
      <StudyPlayer cards={lesson.cards} title={lesson.title} />
    </PageContainer>
  );
}
