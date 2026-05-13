import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { buildGenerationPrompt } from "@/lib/prompt";
import {
  assertValidGeneratedCard,
  validateGeneratedCardMix,
} from "@/lib/quiz-shared";
import type { GeneratedLesson } from "@/types/study";

const generatedCardSchema = z
  .object({
    question_type: z.enum(["mcq", "true_false"]),
    question: z.string().min(10).max(320),
    answer: z.string().min(1).max(320),
    explanation: z.string().min(10).max(500),
    options: z.array(z.string()).length(4).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.question_type === "mcq") {
      if (!data.options || data.options.length !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "mcq items must include options[4].",
          path: ["options"],
        });
      }
    }
  });

const generatedLessonSchema = z.object({
  lesson_title: z.string().min(5).max(120),
  /** Model đôi khi tóm tắt dài; Postgres `text` không giới hạn thực tế */
  source_summary: z.string().min(10).max(5000),
  cards: z.array(generatedCardSchema).min(20).max(40),
});

export async function generateLessonFromText(rawText: string): Promise<GeneratedLesson> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  }
  const ai = new GoogleGenAI({ apiKey });

  const text = rawText.trim().slice(0, 45000);
  if (text.length < 100) {
    throw new Error("Document is too short to generate cards.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildGenerationPrompt(text),
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lesson_title: { type: Type.STRING },
          source_summary: { type: Type.STRING },
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question_type: { type: Type.STRING },
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["question_type", "question", "answer", "explanation"],
            },
          },
        },
        required: ["lesson_title", "source_summary", "cards"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  const lesson = generatedLessonSchema.parse(parsed);
  validateGeneratedCardMix(lesson.cards);
  for (const card of lesson.cards) {
    assertValidGeneratedCard(card);
  }
  return lesson;
}
