import { NextResponse } from "next/server";
import { combineCardsByLesson } from "@/lib/combine";
import { getCardsForLessons, getLessons } from "@/lib/study-store";
import { shuffleCards } from "@/lib/shuffle";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonIds = (searchParams.get("lessonIds") ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const isShuffle = searchParams.get("shuffle") === "1";

    if (lessonIds.length === 0) {
      return NextResponse.json({ error: "At least one lesson id is required." }, { status: 400 });
    }

    const [cards, lessons] = await Promise.all([getCardsForLessons(lessonIds), getLessons()]);
    const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));

    const grouped = lessonIds.map((lessonId) => ({
      lessonTitle: lessonMap.get(lessonId)?.title ?? "Unknown lesson",
      cards: cards.filter((card) => card.lesson_id === lessonId),
    }));

    const combined = combineCardsByLesson(grouped);
    const output = isShuffle ? shuffleCards(combined) : combined;
    return NextResponse.json({ cards: output });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch study cards.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
