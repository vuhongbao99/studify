import type { GeneratedCard } from "@/types/study";

const TF = ["Đúng", "Sai"] as const;

export function normalizeComparable(s: string) {
  return s.trim().replace(/\s+/g, " ").toLocaleLowerCase("vi");
}

export function isMcqAnswerValid(options: string[], answer: string) {
  const target = normalizeComparable(answer);
  return options.some((opt) => normalizeComparable(opt) === target);
}

export function validateGeneratedCardMix(cards: GeneratedCard[]) {
  const mcq = cards.filter((c) => c.question_type === "mcq").length;
  const tf = cards.filter((c) => c.question_type === "true_false").length;
  if (mcq < 5) {
    throw new Error("AI must output at least 5 multiple-choice (mcq) items.");
  }
  if (tf < 5) {
    throw new Error("AI must output at least 5 true/false (true_false) items.");
  }
}

export function assertValidGeneratedCard(card: GeneratedCard) {
  if (card.question_type === "mcq") {
    if (!card.options || card.options.length !== 4) {
      throw new Error("Each mcq card must include exactly 4 options.");
    }
    const opts = card.options.map((o) => o.trim()).filter(Boolean);
    if (opts.length !== 4) {
      throw new Error("MCQ options must be non-empty.");
    }
    if (!isMcqAnswerValid(opts, card.answer.trim())) {
      throw new Error("MCQ answer must match one of the four options.");
    }
  }
  if (card.question_type === "true_false") {
    const ans = card.answer.trim();
    if (!TF.includes(ans as (typeof TF)[number])) {
      throw new Error('True/false answer must be exactly "Đúng" or "Sai".');
    }
  }
}
