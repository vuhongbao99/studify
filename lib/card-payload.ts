import { z } from "zod";
import { isMcqAnswerValid } from "@/lib/quiz-shared";
import type { QuestionType } from "@/types/study";

const tfAnswer = z.enum(["Đúng", "Sai"]);

export const cardUpsertSchema = z
  .object({
    question_type: z.enum(["open", "mcq", "true_false"]),
    question: z.string().min(1).max(900),
    answer: z.string().min(1).max(500),
    explanation: z.string().max(4000).optional().default(""),
    options: z.array(z.string()).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.question_type === "mcq") {
      const opts = data.options;
      if (!opts || opts.length !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Trắc nghiệm cần đúng 4 đáp án (A–D).",
          path: ["options"],
        });
        return;
      }
      const trimmed = opts.map((o) => o.trim());
      if (trimmed.some((t) => !t)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mỗi đáp án không được để trống.",
          path: ["options"],
        });
        return;
      }
      if (!isMcqAnswerValid(trimmed, data.answer.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Đáp án đúng phải khớp chính xác một trong 4 đáp án.",
          path: ["answer"],
        });
      }
      return;
    }
    if (data.question_type === "true_false") {
      const a = data.answer.trim();
      if (!tfAnswer.safeParse(a).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Đúng/Sai: đáp án chỉ được là "Đúng" hoặc "Sai".',
          path: ["answer"],
        });
      }
      return;
    }
    if (data.question_type === "open" && data.options && data.options.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Flashcard không dùng danh sách đáp án.",
        path: ["options"],
      });
    }
  });

export type CardUpsertPayload = z.infer<typeof cardUpsertSchema>;

/** Chuẩn hóa trước khi insert/update DB */
export function normalizeCardForDb(payload: CardUpsertPayload): {
  question_type: QuestionType;
  question: string;
  answer: string;
  explanation: string;
  options: string[] | null;
} {
  return {
    question_type: payload.question_type,
    question: payload.question.trim(),
    answer: payload.answer.trim(),
    explanation: (payload.explanation ?? "").trim(),
    options:
      payload.question_type === "mcq" && payload.options
        ? payload.options.map((o) => o.trim())
        : null,
  };
}
