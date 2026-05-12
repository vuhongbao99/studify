import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { buildGenerationPrompt } from "@/lib/prompt";
import type { GeneratedLesson } from "@/types/study";

const generatedLessonSchema = z.object({
  lesson_title: z.string().min(5).max(120),
  source_summary: z.string().min(10).max(600),
  cards: z
    .array(
      z.object({
        question: z.string().min(10).max(220),
        answer: z.string().min(5).max(320),
        explanation: z.string().min(10).max(500),
      }),
    )
    .min(10)
    .max(45),
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
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["question", "answer", "explanation"],
            },
          },
        },
        required: ["lesson_title", "source_summary", "cards"],
      },
    },
  });

  const parsed = JSON.parse(response.text ?? "{}");
  return generatedLessonSchema.parse(parsed);
}
