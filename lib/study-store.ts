import { getSupabaseServerClient } from "@/lib/supabase";
import type { Card, GeneratedLesson, Lesson, LessonWithCards } from "@/types/study";

function isMissingTableError(message: string) {
  return message.includes("Could not find the table");
}

export async function createLessonFromGenerated(
  sourceFilename: string,
  generated: GeneratedLesson,
): Promise<LessonWithCards> {
  const supabase = getSupabaseServerClient();

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .insert({
      title: generated.lesson_title.trim(),
      source_filename: sourceFilename,
      source_summary: generated.source_summary.trim(),
    })
    .select("*")
    .single<Lesson>();

  if (lessonError || !lesson) {
    if (lessonError?.message && isMissingTableError(lessonError.message)) {
      throw new Error("Missing Supabase tables. Run SQL migration 001_init.sql first.");
    }
    throw new Error(lessonError?.message ?? "Failed to create lesson.");
  }

  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .insert(
      generated.cards.map((card) => ({
        lesson_id: lesson.id,
        question: card.question.trim(),
        answer: card.answer.trim(),
        explanation: card.explanation.trim(),
      })),
    )
    .select("*");

  if (cardsError || !cards) {
    if (cardsError?.message && isMissingTableError(cardsError.message)) {
      throw new Error("Missing Supabase tables. Run SQL migration 001_init.sql first.");
    }
    throw new Error(cardsError?.message ?? "Failed to create cards.");
  }

  return { ...lesson, cards: cards as Card[] };
}

export async function getLessons(): Promise<Lesson[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error && isMissingTableError(error.message)) return [];
  if (error) throw new Error(error.message);
  return (data ?? []) as Lesson[];
}

export async function getLessonById(lessonId: string): Promise<LessonWithCards | null> {
  const supabase = getSupabaseServerClient();
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*, cards(*)")
    .eq("id", lessonId)
    .single();

  if (error) {
    if (isMissingTableError(error.message)) return null;
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return lesson as LessonWithCards;
}

export async function getCardsForLessons(lessonIds: string[]): Promise<Card[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .in("lesson_id", lessonIds)
    .order("created_at", { ascending: true });
  if (error && isMissingTableError(error.message)) return [];
  if (error) throw new Error(error.message);
  return (data ?? []) as Card[];
}
