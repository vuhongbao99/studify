import { NextResponse } from "next/server";
import { deleteLesson, getLessonById } from "@/lib/study-store";

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
    return NextResponse.json({ lesson });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch lesson.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const existing = await getLessonById(id);
    if (!existing) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }
    await deleteLesson(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete lesson.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
