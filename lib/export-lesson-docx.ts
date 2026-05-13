import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { Card, Lesson } from "@/types/study";

function slugFileBase(title: string) {
  return title
    .replace(/[/\\?%*:|"<>[\]{}]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90) || "bai-hoc";
}

export async function buildLessonCardsDocxBuffer(lesson: Lesson, cardsSorted: Card[]): Promise<Uint8Array> {
  const openCards = cardsSorted.filter((c) => c.question_type === "open");
  const mcqCards = cardsSorted.filter((c) => c.question_type === "mcq");
  const tfCards = cardsSorted.filter((c) => c.question_type === "true_false");

  const sections: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: lesson.title, bold: true, size: 36 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: lesson.source_summary, italics: true })],
    }),
    new Paragraph({ text: "" }),
  ];

  function addSectionHeading(text: string) {
    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text, bold: true })],
      }),
    );
  }

  if (openCards.length > 0) {
    addSectionHeading(`Phần 1 — Flashcards (${openCards.length} thẻ)`);
    openCards.forEach((card, idx) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: `Thẻ ${idx + 1}`, bold: true })] }));
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "Câu hỏi: ", bold: true }), new TextRun(card.question)],
        }),
      );
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "Đáp án: ", bold: true }), new TextRun(card.answer)],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Giải thích: ", bold: true }),
            new TextRun(card.explanation || "—"),
          ],
        }),
      );
      sections.push(new Paragraph({ text: "" }));
    });
  }

  if (mcqCards.length > 0) {
    addSectionHeading(`Phần 2 — Trắc nghiệm (${mcqCards.length} câu)`);
    mcqCards.forEach((card, idx) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: `Câu ${idx + 1}`, bold: true })] }));
      sections.push(new Paragraph({ children: [new TextRun(card.question)] }));
      const opts = card.options ?? [];
      ["A", "B", "C", "D"].forEach((letter, i) => {
        sections.push(new Paragraph({ children: [new TextRun(`${letter}. ${opts[i] ?? ""}`)] }));
      });
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "Đáp án đúng: ", bold: true }), new TextRun(card.answer)],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Giải thích: ", bold: true }),
            new TextRun(card.explanation || "—"),
          ],
        }),
      );
      sections.push(new Paragraph({ text: "" }));
    });
  }

  if (tfCards.length > 0) {
    addSectionHeading(`Phần 3 — Đúng / Sai (${tfCards.length} câu)`);
    tfCards.forEach((card, idx) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: `Câu ${idx + 1}`, bold: true })] }));
      sections.push(new Paragraph({ children: [new TextRun(card.question)] }));
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "Đáp án đúng: ", bold: true }), new TextRun(card.answer)],
        }),
      );
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Giải thích: ", bold: true }),
            new TextRun(card.explanation || "—"),
          ],
        }),
      );
      sections.push(new Paragraph({ text: "" }));
    });
  }

  const doc = new Document({
    creator: "Studify",
    title: lesson.title.trim() ? `${lesson.title} — Câu hỏi & đáp án` : "Studify export",
    sections: [{ children: sections }],
  });

  return Packer.toBuffer(doc);
}

export function lessonExportFileBase(lesson: Lesson): string {
  const base = slugFileBase(lesson.title);
  return `${base}-cau-hoi-dap-an`;
}
