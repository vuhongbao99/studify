"use client";

import { useMemo, useState } from "react";
import type { Card } from "@/types/study";
import { shuffleCards } from "@/lib/shuffle";

interface StudyPlayerProps {
  cards: Card[];
  title: string;
}

export function StudyPlayer({ cards, title }: StudyPlayerProps) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);

  const activeCards = useMemo(
    () => (shuffleEnabled ? shuffleCards(cards, 2026) : cards),
    [cards, shuffleEnabled],
  );
  const card = activeCards[index];
  const progress = activeCards.length === 0 ? 0 : Math.round(((index + 1) / activeCards.length) * 100);

  function next() {
    setShowAnswer(false);
    setIndex((current) => Math.min(current + 1, activeCards.length - 1));
  }

  function previous() {
    setShowAnswer(false);
    setIndex((current) => Math.max(current - 1, 0));
  }

  if (!card) {
    return <p className="rounded-xl border bg-white p-6 text-slate-600">Chưa có thẻ học nào.</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={shuffleEnabled}
            onChange={(event) => {
              setShuffleEnabled(event.target.checked);
              setShowAnswer(false);
              setIndex(0);
            }}
          />
          Trộn câu hỏi
        </label>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Câu {index + 1}/{activeCards.length}
        </p>
        <p className="mt-3 text-lg font-semibold text-slate-900">{card.question}</p>
        {showAnswer ? (
          <div className="mt-4 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-medium text-emerald-900">{card.answer}</p>
            <p className="text-sm text-emerald-800">{card.explanation}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className="mt-5 rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
          >
            Hiện đáp án
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={previous}
          className="flex-1 rounded-lg border px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={next}
          className="flex-1 rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
        >
          Tiếp theo
        </button>
      </div>
    </section>
  );
}
