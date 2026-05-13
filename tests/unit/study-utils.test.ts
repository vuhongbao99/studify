import { describe, expect, it } from "vitest";
import { normalizeDocumentText } from "@/lib/docx";
import { shuffleCards } from "@/lib/shuffle";
import { combineCardsByLesson } from "@/lib/combine";
import type { Card } from "@/types/study";

const sampleCards: Card[] = [
  {
    id: "1",
    lesson_id: "l1",
    question_type: "open",
    options: null,
    question: "Q1",
    answer: "A1",
    explanation: "E1",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    lesson_id: "l1",
    question_type: "open",
    options: null,
    question: "Q2",
    answer: "A2",
    explanation: "E2",
    created_at: new Date().toISOString(),
  },
];

describe("study utils", () => {
  it("normalizes document text", () => {
    expect(normalizeDocumentText("a\r\n\r\n\r\nb")).toBe("a\n\nb");
  });

  it("shuffles deterministically with seed", () => {
    const first = shuffleCards(sampleCards, 1234).map((item) => item.id);
    const second = shuffleCards(sampleCards, 1234).map((item) => item.id);
    expect(first).toEqual(second);
  });

  it("combines lessons and prefixes question with lesson title", () => {
    const combined = combineCardsByLesson([{ lessonTitle: "Bai 1", cards: sampleCards }]);
    expect(combined[0].question.startsWith("[Bai 1]")).toBe(true);
  });
});
