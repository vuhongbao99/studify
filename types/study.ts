export interface Card {
  id: string;
  lesson_id: string;
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
  question: string;
  answer: string;
  explanation: string;
}

export interface GeneratedLesson {
  lesson_title: string;
  source_summary: string;
  cards: GeneratedCard[];
}
