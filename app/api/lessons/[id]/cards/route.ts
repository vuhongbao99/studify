import { NextResponse } from "next/server";
import { cardUpsertSchema } from "@/lib/card-payload";
import { createCardRecord, getLessonById } from "@/lib/study-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const lesson = await getLessonById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }
    const body = await request.json();
    const parsed = cardUpsertSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ error: first?.message ?? "Invalid body." }, { status: 400 });
    }
    const card = await createCardRecord(id, parsed.data);
    return NextResponse.json({ card });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create card.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
