import { getSupabaseServerClient } from "@/lib/supabase";
import { normalizeCardForDb, type CardUpsertPayload } from "@/lib/card-payload";
import type { Card, GeneratedLesson, Lesson, LessonWithCards } from "@/types/study";

function parseCardRow(row: Record<string, unknown>): Card {
  const optionsRaw = row.options;
  let options: string[] | null = null;
  if (Array.isArray(optionsRaw)) {
    options = optionsRaw.map((item) => String(item));
  }
  const qt = row.question_type;
  const questionType =
    qt === "mcq" || qt === "true_false" || qt === "open" ? qt : "open";
  return {
    ...(row as unknown as Card),
    question_type: questionType,
    options,
  };
}

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
        question_type: card.question_type,
        options:
          card.question_type === "mcq"
            ? card.options?.map((option) => option.trim()) ?? null
            : null,
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

  return { ...lesson, cards: (cards as Record<string, unknown>[]).map(parseCardRow) };
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) {
    if (error.message && isMissingTableError(error.message)) {
      throw new Error("Missing Supabase tables. Run SQL migration 001_init.sql first.");
    }
    throw new Error(error.message);
  }
}

export async function getLessons(): Promise<Lesson[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, source_filename, source_summary, created_at, cards(count)")
    .order("created_at", { ascending: false });

  if (error && isMissingTableError(error.message)) return [];
  if (error) throw new Error(error.message);

  type Row = Lesson & { cards?: { count: number }[] | null };
  return (data ?? []).map((row) => {
    const r = row as Row;
    const nested = r.cards;
    const raw = Array.isArray(nested) && nested[0] ? (nested[0] as { count?: number | string }).count : undefined;
    const count =
      typeof raw === "number"
        ? raw
        : typeof raw === "string"
          ? Number.parseInt(raw, 10) || 0
          : 0;
    return {
      id: r.id,
      title: r.title,
      source_filename: r.source_filename,
      source_summary: r.source_summary,
      created_at: r.created_at,
      card_count: count,
    } as Lesson;
  });
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

  const raw = lesson as LessonWithCards & {
    cards?: Record<string, unknown>[];
  };
  const cards = (raw.cards ?? [])
    .map((row) => parseCardRow(row as unknown as Record<string, unknown>))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return { ...(raw as Lesson), cards };
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
  return (data ?? []).map((row) => parseCardRow(row as Record<string, unknown>));
}

export async function createCardRecord(lessonId: string, payload: CardUpsertPayload): Promise<Card> {
  const supabase = getSupabaseServerClient();
  const normalized = normalizeCardForDb(payload);
  const { data, error } = await supabase
    .from("cards")
    .insert({
      lesson_id: lessonId,
      question_type: normalized.question_type,
      question: normalized.question,
      answer: normalized.answer,
      explanation: normalized.explanation,
      options: normalized.options,
    })
    .select("*")
    .single();

  if (error) {
    if (isMissingTableError(error.message)) {
      throw new Error("Missing Supabase tables. Run SQL migrations first.");
    }
    throw new Error(error.message);
  }
  return parseCardRow(data as Record<string, unknown>);
}

export async function updateCardRecord(lessonId: string, cardId: string, payload: CardUpsertPayload): Promise<Card> {
  const supabase = getSupabaseServerClient();
  const normalized = normalizeCardForDb(payload);
  const { data, error } = await supabase
    .from("cards")
    .update({
      question_type: normalized.question_type,
      question: normalized.question,
      answer: normalized.answer,
      explanation: normalized.explanation,
      options: normalized.options,
    })
    .eq("id", cardId)
    .eq("lesson_id", lessonId)
    .select("*")
    .single();

  if (error) {
    if (isMissingTableError(error.message)) {
      throw new Error("Missing Supabase tables. Run SQL migrations first.");
    }
    if (error.code === "PGRST116") throw new Error("Card not found.");
    throw new Error(error.message);
  }
  return parseCardRow(data as Record<string, unknown>);
}

export async function deleteCardRecord(lessonId: string, cardId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("cards").delete().eq("id", cardId).eq("lesson_id", lessonId);
  if (error) {
    if (isMissingTableError(error.message)) {
      throw new Error("Missing Supabase tables. Run SQL migrations first.");
    }
    throw new Error(error.message);
  }
}
