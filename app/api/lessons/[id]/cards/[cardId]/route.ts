import { NextResponse } from "next/server";
import { cardUpsertSchema } from "@/lib/card-payload";
import { deleteCardRecord, updateCardRecord, getLessonById } from "@/lib/study-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> },
) {
  try {
    const { id, cardId } = await params;
    const lesson = await getLessonById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }
    if (!lesson.cards.some((c) => c.id === cardId)) {
      return NextResponse.json({ error: "Card not in this lesson." }, { status: 404 });
    }
    const body = await request.json();
    const parsed = cardUpsertSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ error: first?.message ?? "Invalid body." }, { status: 400 });
    }
    const card = await updateCardRecord(id, cardId, parsed.data);
    return NextResponse.json({ card });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update card.";
    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> },
) {
  try {
    const { id, cardId } = await params;
    const lesson = await getLessonById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }
    if (!lesson.cards.some((c) => c.id === cardId)) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }
    await deleteCardRecord(id, cardId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete card.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
