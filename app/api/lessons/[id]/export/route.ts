import { NextResponse } from "next/server";
import { buildLessonCardsDocxBuffer, lessonExportFileBase } from "@/lib/export-lesson-docx";
import { getLessonById } from "@/lib/study-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const lesson = await getLessonById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }
    const buf = await buildLessonCardsDocxBuffer(lesson, lesson.cards);
    const fallbackName = `${lessonExportFileBase(lesson)}.docx`;
    const encodedUtf8 = encodeURIComponent(fallbackName);
    const asciiName = fallbackName.replace(/[^\w.\-()/]+/g, "_").slice(0, 120);
    const body = Buffer.from(buf);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedUtf8}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
