export type QuestionType = "open" | "mcq" | "true_false";

export interface Card {
  id: string;
  lesson_id: string;
  question_type: QuestionType;
  /** Bốn đáp án (trắc nghiệm); null với đúng/sai hoặc thẻ mở */
  options: string[] | null;
  question: string;
  answer: string;
  explanation: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  source_filename: string;
  source_summary: string;
  created_at: string;
}

export interface LessonWithCards extends Lesson {
  cards: Card[];
}

export interface GeneratedCard {
  question_type: "mcq" | "true_false";
  question: string;
  answer: string;
  explanation: string;
  /** Bắt buộc khi question_type === "mcq" */
  options?: string[];
}

export interface GeneratedLesson {
  lesson_title: string;
  source_summary: string;
  cards: GeneratedCard[];
}
