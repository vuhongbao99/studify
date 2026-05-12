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
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <label className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-800">
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

      <div className="h-2.5 w-full rounded-full bg-indigo-100">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-lg md:p-8">
        <p className="text-sm font-medium text-slate-500">
          Câu {index + 1}/{activeCards.length}
        </p>
        <p className="mt-4 text-xl font-semibold leading-relaxed text-slate-900 md:text-2xl">{card.question}</p>
        {showAnswer ? (
          <div className="mt-5 space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-lg font-semibold text-emerald-900">{card.answer}</p>
            <p className="text-sm leading-relaxed text-emerald-800">{card.explanation}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Lật thẻ
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={previous}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Trước
        </button>
        <button
          type="button"
          onClick={next}
          className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          Sau
        </button>
      </div>
    </section>
  );
}
