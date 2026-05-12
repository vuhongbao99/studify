import type { Card } from "@/types/study";

export function combineCardsByLesson(
  cardsByLesson: Array<{ lessonTitle: string; cards: Card[] }>,
): Card[] {
  return cardsByLesson.flatMap((entry) =>
    entry.cards.map((card) => ({
      ...card,
      question: `[${entry.lessonTitle}] ${card.question}`,
    })),
  );
}
